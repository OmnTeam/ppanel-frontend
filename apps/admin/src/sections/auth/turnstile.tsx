import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { Icon } from "@workspace/ui/composed/icon";
import { useTheme } from "next-themes";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { useTranslation } from "react-i18next";
import Turnstile, { useTurnstile } from "react-turnstile";

import { useGlobalStore } from "@/stores/global";

export type TurnstileRef = {
  reset: () => void;
};

const CloudFlareTurnstile = forwardRef<
  TurnstileRef,
  {
    id?: string;
    value?: null | string;
    onChange: (value?: string) => void;
  }
>(function CloudFlareTurnstile({ id, value, onChange }, ref) {
  const { common } = useGlobalStore();
  const { verify } = common;
  const { resolvedTheme } = useTheme();
  const { i18n, t } = useTranslation("auth");
  const locale = i18n.language;
  const turnstile = useTurnstile();
  const [open, setOpen] = useState(false);
  const [verified, setVerified] = useState(false);

  useImperativeHandle(
    ref,
    () => ({
      reset: () => {
        setVerified(false);
        onChange("");
        turnstile.reset();
      },
    }),
    [turnstile, onChange]
  );

  useEffect(() => {
    if (value === "") {
      setVerified(false);
      turnstile.reset();
    }
  }, [turnstile, value]);

  const handleOpen = () => {
    if (verified) return;
    setOpen(true);
  };

  if (!verify.turnstile_site_key) return null;

  return (
    <>
      {/* Trigger button */}
      <button
        type="button"
        onClick={handleOpen}
        className={`relative flex w-full items-center gap-3 rounded-md border px-4 py-3 text-sm transition-colors ${
          verified
            ? "border-green-400 bg-green-50 text-green-700 dark:bg-green-950/30"
            : "border-input bg-background hover:bg-muted"
        }`}
      >
        <span
          className={`relative flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
            verified ? "bg-green-500" : "bg-primary"
          }`}
        >
          {verified ? (
            <Icon className="text-xs text-white" icon="mdi:check" />
          ) : (
            <>
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-primary" />
            </>
          )}
        </span>
        <span className={verified ? "font-medium" : "text-muted-foreground"}>
          {verified
            ? t("captcha.turnstile.success", "Verified")
            : t("captcha.turnstile.clickToVerify", "Click to verify")}
        </span>
        {verified && <Icon className="ml-auto text-green-500" icon="mdi:check-circle" />}
      </button>

      {/* Turnstile dialog */}
      <Dialog open={open} onOpenChange={(o) => { if (!o) setOpen(false); }}>
        <DialogContent className="flex w-auto flex-col items-center gap-4 p-6">
          <DialogHeader>
            <DialogTitle>{t("captcha.turnstile.title", "Security Verification")}</DialogTitle>
          </DialogHeader>
          <Turnstile
            fixedSize
            id={id}
            language={locale.toLowerCase()}
            onExpire={() => {
              onChange("");
              turnstile.reset();
            }}
            onTimeout={() => {
              onChange("");
              turnstile.reset();
            }}
            onVerify={(token) => {
              setVerified(true);
              onChange(token);
              setTimeout(() => setOpen(false), 400);
            }}
            sitekey={verify.turnstile_site_key}
            theme={resolvedTheme as "light" | "dark"}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="w-full"
            onClick={() => setOpen(false)}
          >
            {t("captcha.turnstile.cancel", "Cancel")}
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
});

export default CloudFlareTurnstile;
