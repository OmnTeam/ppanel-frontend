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
import { Icon } from "@workspace/ui/composed/icon";
import type { Dispatch, SetStateAction } from "react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { useGlobalStore } from "@/stores/global";
import type { TurnstileRef } from "../turnstile";
import CloudFlareTurnstile from "../turnstile";
import LocalCaptcha, { type LocalCaptchaRef } from "../local-captcha";

export default function LoginForm({
  loading,
  onSubmit,
  initialValues,
  setInitialValues,
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
  const { verify } = common;
  const [captchaId, setCaptchaId] = useState("");

  const isTurnstile = verify.captcha_type === "turnstile";
  const isLocal = verify.captcha_type === "local";
  const captchaEnabled = verify.enable_user_login_captcha;

  const formSchema = z.object({
    email: z.email(t("login.email", "Please enter a valid email address")),
    password: z.string(),
    cf_token:
      captchaEnabled && isTurnstile && verify.turnstile_site_key
        ? z.string()
        : z.string().optional(),
    captcha_code:
      captchaEnabled && isLocal
        ? z.string().min(1, t("captcha.required", "Please enter captcha code"))
        : z.string().optional(),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues,
  });

  const turnstile = useRef<TurnstileRef>(null);
  const localCaptcha = useRef<LocalCaptchaRef>(null);
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
    }
  });

  return (
    <>
      <Form {...form}>
        <form className="grid gap-6" onSubmit={handleSubmit}>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder={t("login.emailPlaceholder", "Enter your email...")}
                    type="email"
                    {...field}
                  />
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
                    placeholder={t("login.passwordPlaceholder", "Enter your password...")}
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
                      id="login"
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
          <Button disabled={loading} type="submit">
            {loading && <Icon className="animate-spin" icon="mdi:loading" />}
            {t("login.title", "Login")}
          </Button>
        </form>
      </Form>
      <div className="mt-4 flex w-full justify-between text-sm">
        <Button
          className="p-0"
          onClick={() => onSwitchForm("reset")}
          type="button"
          variant="link"
        >
          {t("login.forgotPassword", "Forgot Password?")}
        </Button>
        <Button
          className="p-0"
          onClick={() => {
            setInitialValues(undefined);
            onSwitchForm("register");
          }}
          variant="link"
        >
          {t("login.registerAccount", "Register Account")}
        </Button>
      </div>
    </>
  );
}
