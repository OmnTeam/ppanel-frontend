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
import { Markdown } from "@workspace/ui/composed/markdown";
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

export default function RegisterForm({
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
  const { verify, auth, invite } = common;
  const [captchaId, setCaptchaId] = useState("");

  const isTurnstile = verify.captcha_type === "turnstile";
  const isLocal = verify.captcha_type === "local";
  const captchaEnabled = verify.enable_user_register_captcha;

  const handleCheckUser = async (email: string) => {
    try {
      if (!auth.email.enable_domain_suffix) return true;
      const domain = email.split("@")[1];
      const isValid = auth.email?.domain_suffix_list
        .split("\n")
        .includes(domain || "");
      return isValid;
    } catch (error) {
      console.log("Error checking user:", error);
      return false;
    }
  };

  const formSchema = z
    .object({
      email: z
        .string()
        .email(t("register.email", "Please enter a valid email address"))
        .refine(handleCheckUser, {
          message: t(
            "register.whitelist",
            "This email domain is not in the whitelist"
          ),
        }),
      password: z.string(),
      repeat_password: z.string(),
      code: auth.email.enable_verify ? z.string() : z.string().nullish(),
      invite: invite.forced_invite ? z.string().min(1) : z.string().nullish(),
      cf_token:
        captchaEnabled && isTurnstile && verify.turnstile_site_key
          ? z.string()
          : z.string().nullish(),
      captcha_code:
        captchaEnabled && isLocal
          ? z.string().min(1, t("captcha.required", "Please enter captcha code"))
          : z.string().nullish(),
    })
    .superRefine(({ password, repeat_password }, ctx) => {
      if (password !== repeat_password) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t("register.passwordMismatch", "Passwords do not match"),
          path: ["repeat_password"],
        });
      }
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...initialValues,
      invite: localStorage.getItem("invite") || "",
    },
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
      {auth.register.stop_register ? (
        <Markdown>
          {t("register.message", "Registration is currently disabled")}
        </Markdown>
      ) : (
        <Form {...form}>
          <form className="grid gap-6" onSubmit={handleSubmit}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder={t("register.emailPlaceholder", "Enter your email...")}
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
                      placeholder={t("register.passwordPlaceholder", "Enter your password...")}
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="repeat_password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder={t("register.repeatPasswordPlaceholder", "Enter password again...")}
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {auth.email.enable_verify && (
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex items-center gap-2">
                        <Input
                          disabled={loading}
                          placeholder={t("register.codePlaceholder", "Enter code...")}
                          type="text"
                          {...field}
                          value={field.value as string}
                        />
                        <SendCode
                          params={{
                            email: form.watch("email"),
                            type: 1,
                          }}
                          type="email"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="invite"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={loading || !!localStorage.getItem("invite")}
                      placeholder={t(
                        "register.invite",
                        "Invitation Code (Optional)"
                      )}
                      {...field}
                      value={field.value || ""}
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
                        id="register"
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
              {t("register.title", "Register")}
            </Button>
          </form>
        </Form>
      )}
      <div className="mt-4 text-right text-sm">
        {t("register.existingAccount", "Already have an account?")}&nbsp;
        <Button
          className="p-0"
          onClick={() => {
            setInitialValues(undefined);
            onSwitchForm("login");
          }}
          variant="link"
        >
          {t("register.switchToLogin", "Login")}
        </Button>
      </div>
    </>
  );
}
