import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@workspace/ui/components/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { AreaCodeSelect } from "@workspace/ui/composed/area-code-select";
import { Icon } from "@workspace/ui/composed/icon";
import type { Dispatch, SetStateAction } from "react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { useGlobalStore } from "@/stores/global";
import SendCode from "../send-code";
import type { TurnstileRef } from "../turnstile";
import CloudFlareTurnstile from "../turnstile";
import LocalCaptcha, { type LocalCaptchaRef } from "../local-captcha";
import SliderCaptcha, { type SliderCaptchaRef } from "../slider-captcha";

export default function ResetForm({
  loading,
  onSubmit,
  initialValues,
  onSwitchForm,
}: {
  loading?: boolean;
  onSubmit: (data: any) => void;
  initialValues: any;
  setInitialValues: Dispatch<SetStateAction<any>>;
  onSwitchForm: Dispatch<SetStateAction<"register" | "reset" | "login">>;
}) {
  const { t } = useTranslation("auth");

  const { common } = useGlobalStore();
  const { verify, auth } = common;
  const [captchaId, setCaptchaId] = useState("");

  const isTurnstile = verify.captcha_type === "turnstile";
  const isLocal = verify.captcha_type === "local";
  const isSlider = verify.captcha_type === "slider";
  const captchaEnabled = verify.enable_user_reset_password_captcha;

  const formSchema = z.object({
    telephone_area_code: z.string(),
    telephone: z.string(),
    password: z.string(),
    code: auth?.email?.enable_verify ? z.string() : z.string().nullish(),
    cf_token:
      captchaEnabled && isTurnstile && verify.turnstile_site_key
        ? z.string()
        : z.string().nullish(),
    captcha_code:
      captchaEnabled && isLocal
        ? z.string().min(1, t("captcha.required", "Please enter captcha code"))
        : z.string().nullish(),
    slider_token:
      captchaEnabled && isSlider
        ? z.string().min(1, t("captcha.sliderRequired", "Please complete the slider"))
        : z.string().optional(),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { cf_token: "", captcha_code: "", slider_token: "", ...initialValues },
  });

  const turnstile = useRef<TurnstileRef>(null);
  const localCaptcha = useRef<LocalCaptchaRef>(null);
  const sliderCaptcha = useRef<SliderCaptchaRef>(null);
  const handleSubmit = form.handleSubmit((data) => {
    try {
      // Add captcha_id for local captcha
      if (isLocal && captchaEnabled) {
        (data as any).captcha_id = captchaId;
      }
      onSubmit(data);
    } catch (_error) {
      turnstile.current?.reset();
      localCaptcha.current?.reset();
      sliderCaptcha.current?.reset();
    }
  });

  return (
    <>
      <Form {...form}>
        <form className="grid gap-6" onSubmit={handleSubmit}>
          <FormField
            control={form.control}
            name="telephone"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex">
                    <FormField
                      control={form.control}
                      name="telephone_area_code"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <AreaCodeSelect
                              className="w-32 rounded-r-none border-r-0"
                              onChange={(value) => {
                                if (value.phone) {
                                  form.setValue(
                                    "telephone_area_code",
                                    value.phone
                                  );
                                }
                              }}
                              placeholder={t("register.areaCodePlaceholder", "Area code...")}
                              simple
                              value={field.value}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Input
                      className="rounded-l-none"
                      placeholder={t("register.telephonePlaceholder", "Enter your telephone...")}
                      type="tel"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder={t("register.codePlaceholder", "Enter code...")}
                      type="text"
                      {...field}
                      value={field.value as string}
                    />
                    <SendCode
                      params={{
                        telephone: form.watch("telephone"),
                        telephone_area_code: form.watch("telephone_area_code"),
                        type: 2,
                      }}
                      type="phone"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder={t("reset.passwordPlaceholder", "Enter your new password...")}
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {captchaEnabled && isTurnstile && (
            <FormField
              control={form.control}
              name="cf_token"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <CloudFlareTurnstile
                      id="reset"
                      {...field}
                      ref={turnstile}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          {captchaEnabled && isLocal && (
            <FormField
              control={form.control}
              name="captcha_code"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <LocalCaptcha
                      {...field}
                      ref={localCaptcha}
                      onCaptchaIdChange={setCaptchaId}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          {captchaEnabled && isSlider && (
            <FormField
              control={form.control}
              name="slider_token"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <SliderCaptcha
                      {...field}
                      ref={sliderCaptcha}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <Button disabled={loading} type="submit">
            {loading && <Icon className="animate-spin" icon="mdi:loading" />}
            {t("reset.title", "Reset Password")}
          </Button>
        </form>
      </Form>
      <div className="mt-4 text-right text-sm">
        {t("reset.existingAccount", "Remember your password?")}&nbsp;
        <Button
          className="p-0"
          onClick={() => {
            onSwitchForm("login");
          }}
          variant="link"
        >
          {t("reset.switchToLogin", "Login")}
        </Button>
      </div>
    </>
  );
}
