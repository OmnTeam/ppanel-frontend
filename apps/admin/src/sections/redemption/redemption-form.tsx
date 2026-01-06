import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@workspace/ui/components/button";
import {
  Form,
  FormControl,
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
import { Combobox } from "@workspace/ui/composed/combobox";
import { EnhancedInput } from "@workspace/ui/composed/enhanced-input";
import { Icon } from "@workspace/ui/composed/icon";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { useSubscribe } from "@/stores/subscribe";

const formSchema = z.object({
  id: z.number().optional(),
  code: z.string().optional(),
  batch_count: z.number().optional(),
  total_count: z.number().min(1, "Total count is required"),
  subscribe_plan: z.number().min(1, "Subscribe plan is required"),
  unit_time: z.string().min(1, "Unit time is required"),
  quantity: z.number().min(1, "Quantity is required"),
});

interface RedemptionFormProps<T> {
  onSubmit: (data: T) => Promise<boolean> | boolean;
  initialValues?: T;
  loading?: boolean;
  trigger: string;
  title: string;
}

export default function RedemptionForm<T extends Record<string, any>>({
  onSubmit,
  initialValues,
  loading,
  trigger,
  title,
}: RedemptionFormProps<T>) {
  const { t } = useTranslation("redemption");

  const [open, setOpen] = useState(false);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...initialValues,
    } as any,
  });

  useEffect(() => {
    form?.reset(initialValues);
  }, [form, initialValues]);

  async function handleSubmit(data: { [x: string]: any }) {
    // When editing, merge the id from initialValues
    const submitData = initialValues?.id
      ? { ...data, id: initialValues.id }
      : data;
    const bool = await onSubmit(submitData as T);
    if (bool) setOpen(false);
  }

  const { subscribes } = useSubscribe();
  const isEdit = !!initialValues?.id;

  return (
    <Sheet onOpenChange={setOpen} open={open}>
      <SheetTrigger asChild>
        <Button
          onClick={() => {
            form.reset();
            setOpen(true);
          }}
        >
          {trigger}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[500px] max-w-full md:max-w-screen-md">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-48px-36px-36px-env(safe-area-inset-top))]">
          <Form {...form}>
            <form
              className="space-y-4 px-6 pt-4"
              onSubmit={form.handleSubmit(handleSubmit)}
            >
              {isEdit && (
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("form.code", "Code")}</FormLabel>
                      <FormControl>
                        <EnhancedInput
                          disabled
                          onValueChange={(value) => {
                            form.setValue(field.name, value);
                          }}
                          placeholder={t("form.code", "Code")}
                          value={field.value}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              {!isEdit && (
                <FormField
                  control={form.control}
                  name="batch_count"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("form.batchCount", "Batch Count")}
                      </FormLabel>
                      <FormControl>
                        <EnhancedInput
                          min={1}
                          placeholder={t(
                            "form.batchCountPlaceholder",
                            "Batch Count"
                          )}
                          step={1}
                          type="number"
                          {...field}
                          onValueChange={(value) => {
                            form.setValue(field.name, value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <FormField
                control={form.control}
                name="subscribe_plan"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("form.subscribePlan", "Subscribe Plan")}
                    </FormLabel>
                    <FormControl>
                      <Combobox<number, false>
                        onChange={(value) => {
                          form.setValue(field.name, value);
                        }}
                        options={subscribes?.map((item) => ({
                          value: item.id!,
                          label: item.name!,
                        }))}
                        placeholder={t(
                          "form.selectPlan",
                          "Select Subscribe Plan"
                        )}
                        value={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="unit_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("form.unitTime", "Unit Time")}
                    </FormLabel>
                    <FormControl>
                      <Combobox<string, false>
                        onChange={(value) => {
                          form.setValue(field.name, value);
                        }}
                        options={[
                          { value: "day", label: t("form.day", "Day") },
                          { value: "month", label: t("form.month", "Month") },
                          { value: "quarter", label: t("form.quarter", "Quarter") },
                          { value: "half_year", label: t("form.halfYear", "Half Year") },
                          { value: "year", label: t("form.year", "Year") },
                        ]}
                        placeholder={t(
                          "form.selectUnitTime",
                          "Select Unit Time"
                        )}
                        value={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("form.duration", "Duration")}
                    </FormLabel>
                    <FormControl>
                      <EnhancedInput
                        min={1}
                        placeholder={t(
                          "form.durationPlaceholder",
                          "Duration"
                        )}
                        step={1}
                        type="number"
                        {...field}
                        onValueChange={(value) => {
                          form.setValue(field.name, value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="total_count"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("form.totalCount", "Total Count")}
                    </FormLabel>
                    <FormControl>
                      <EnhancedInput
                        min={1}
                        placeholder={t(
                          "form.totalCountPlaceholder",
                          "Total Count"
                        )}
                        step={1}
                        type="number"
                        {...field}
                        onValueChange={(value) => {
                          form.setValue(field.name, value);
                        }}
                      />
                    </FormControl>
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
            onClick={() => {
              setOpen(false);
            }}
            variant="outline"
          >
            {t("form.cancel", "Cancel")}
          </Button>
          <Button disabled={loading} onClick={form.handleSubmit(handleSubmit)}>
            {loading && (
              <Icon className="mr-2 animate-spin" icon="mdi:loading" />
            )}{" "}
            {t("form.confirm", "Confirm")}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
