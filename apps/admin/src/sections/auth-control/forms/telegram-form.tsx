import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@workspace/ui/components/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@workspace/ui/components/sheet";
import { Switch } from "@workspace/ui/components/switch";
import { EnhancedInput } from "@workspace/ui/composed/enhanced-input";
import { Icon } from "@workspace/ui/composed/icon";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { z } from "zod";
import { useAuthMethodConfig } from "../use-auth-method-config";

const telegramSchema = z.object({
  enabled: z.boolean(),
  bot: z.string().optional(),
  bot_token: z.string().optional(),
});

type TelegramFormData = z.infer<typeof telegramSchema>;

export default function TelegramForm() {
  const { t } = useTranslation("auth-control");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { data, refetch, save } = useAuthMethodConfig("telegram", {
    enabled: open,
  });

  const form = useForm<TelegramFormData>({
    resolver: zodResolver(telegramSchema),
    defaultValues: {
      enabled: false,
      bot: "",
      bot_token: "",
    },
  });

  useEffect(() => {
    if (!data) return;

    form.reset({
      enabled: data.enabled,
      bot: data.config.bot || "",
      bot_token: data.config.bot_token || "",
    });
  }, [data, form]);

  async function onSubmit(values: TelegramFormData) {
    setLoading(true);
    try {
      await save({
        enabled: values.enabled,
        config: {
          bot: values.bot,
          bot_token: values.bot_token,
        },
      });
      toast.success(t("common.saveSuccess", "Saved successfully"));
      refetch();
      setOpen(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Sheet onOpenChange={setOpen} open={open}>
      <SheetTrigger asChild>
        <div className="flex cursor-pointer items-center justify-between transition-colors">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Icon className="h-5 w-5 text-primary" icon="mdi:telegram" />
            </div>
            <div className="flex-1">
              <p className="font-medium">
                {t("telegram.title", "Telegram Sign-In")}
              </p>
              <p className="text-muted-foreground text-sm">
                {t(
                  "telegram.description",
                  "Authenticate users with Telegram accounts"
                )}
              </p>
            </div>
          </div>
          <Icon className="size-6" icon="mdi:chevron-right" />
        </div>
      </SheetTrigger>
      <SheetContent className="w-[500px] max-w-full md:max-w-screen-md">
        <SheetHeader>
          <SheetTitle>{t("telegram.title", "Telegram Sign-In")}</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100dvh-48px-36px-36px-24px-env(safe-area-inset-top))] px-6">
          <Form {...form}>
            <form
              className="space-y-2 pt-4"
              id="telegram-form"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                control={form.control}
                name="enabled"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("telegram.enable", "Enable")}</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        className="!mt-0 float-end"
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormDescription>
                      {t(
                        "telegram.enableDescription",
                        "When enabled, users can sign in with their Telegram account"
                      )}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bot"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("telegram.clientId", "Bot ID")}</FormLabel>
                    <FormControl>
                      <EnhancedInput
                        onValueChange={field.onChange}
                        placeholder="6123456789"
                        value={field.value}
                      />
                    </FormControl>
                    <FormDescription>
                      {t(
                        "telegram.clientIdDescription",
                        "Telegram Bot ID, available from @BotFather"
                      )}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bot_token"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("telegram.clientSecret", "Bot Token")}
                    </FormLabel>
                    <FormControl>
                      <EnhancedInput
                        onValueChange={field.onChange}
                        placeholder="6123456789:AAHn_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                        type="password"
                        value={field.value}
                      />
                    </FormControl>
                    <FormDescription>
                      {t(
                        "telegram.clientSecretDescription",
                        "Telegram Bot Token, available from @BotFather"
                      )}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </ScrollArea>
        <SheetFooter className="flex-row justify-end gap-2 pt-3">
          <Button
            disabled={loading}
            onClick={() => setOpen(false)}
            variant="outline"
          >
            {t("common.cancel", "Cancel")}
          </Button>
          <Button disabled={loading} form="telegram-form" type="submit">
            {loading && (
              <Icon className="mr-2 animate-spin" icon="mdi:loading" />
            )}
            {t("common.save", "Save")}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
