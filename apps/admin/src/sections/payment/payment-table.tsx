import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Switch } from "@workspace/ui/components/switch";
import { ConfirmButton } from "@workspace/ui/composed/confirm-button";
import {
  ProTable,
  type ProTableActions,
} from "@workspace/ui/composed/pro-table/pro-table";
import {
  createPaymentMethod,
  deletePaymentMethod,
  getPaymentMethodList,
  updatePaymentMethod,
} from "@workspace/ui/services/admin/payment";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Display } from "@/components/display";
import PaymentForm, { type PaymentFormValues } from "./payment-form";

type PaymentRow = API.PaymentConfig & {
  notify_url?: string;
  sort?: number;
};

export default function PaymentTable() {
  const { t } = useTranslation("payment");
  const [loading, setLoading] = useState(false);
  const ref = useRef<ProTableActions>(null);

  const buildPaymentPayload = (
    values: Partial<PaymentFormValues>,
    row?: Partial<PaymentRow>
  ) => ({
    ...(row || {}),
    ...values,
    sort:
      typeof values.sort === "number"
        ? values.sort
        : typeof row?.sort === "number"
          ? row.sort
          : 0,
  });

  return (
    <ProTable<PaymentRow, { search: string }>
      action={ref}
      actions={{
        render: (row) => [
          <PaymentForm<PaymentFormValues>
            initialValues={row}
            isEdit
            key="edit"
            loading={loading}
            onSubmit={async (values) => {
              setLoading(true);
              try {
                await updatePaymentMethod(
                  buildPaymentPayload(values, row) as API.UpdatePaymentMethodRequest
                );
                toast.success(t("updateSuccess", "Updated successfully"));
                ref.current?.refresh();
                setLoading(false);
                return true;
              } catch {
                setLoading(false);
                return false;
              }
            }}
            title={t("editPayment", "Edit Payment Method")}
            trigger={<Button>{t("edit", "Edit")}</Button>}
          />,
          <ConfirmButton
            cancelText={t("cancel", "Cancel")}
            confirmText={t("confirm", "Confirm")}
            description={t(
              "deleteWarning",
              "Are you sure you want to delete this payment method? This action cannot be undone."
            )}
            key="delete"
            onConfirm={async () => {
              await deletePaymentMethod({
                id: row.id,
              });
              toast.success(t("deleteSuccess", "Deleted successfully"));
              ref.current?.refresh();
            }}
            title={t("confirmDelete", "Confirm Delete")}
            trigger={
              <Button variant="destructive">{t("delete", "Delete")}</Button>
            }
          />,
          <Button
            key="copy"
            onClick={async () => {
              setLoading(true);
              try {
                const { id: _id, ...params } = row;
                await createPaymentMethod(
                  {
                    ...buildPaymentPayload(params),
                    enable: false,
                  } as API.CreatePaymentMethodRequest
                );
                toast.success(t("copySuccess", "Copied successfully"));
                ref.current?.refresh();
                setLoading(false);
                return true;
              } catch {
                setLoading(false);
                return false;
              }
            }}
            variant="outline"
          >
            {t("copy", "Copy")}
          </Button>,
        ],
        batchRender(rows) {
          return [
            <ConfirmButton
              cancelText={t("cancel", "Cancel")}
              confirmText={t("confirm", "Confirm")}
              description={t(
                "deleteWarning",
                "Are you sure you want to delete this payment method? This action cannot be undone."
              )}
              key="delete"
              onConfirm={async () => {
                for (const row of rows) {
                  await deletePaymentMethod({ id: row.id });
                }
                toast.success(t("deleteSuccess", "Deleted successfully"));
                ref.current?.refresh();
              }}
              title={t("confirmDelete", "Confirm Delete")}
              trigger={
                <Button variant="destructive">
                  {t("batchDelete", "Batch Delete")}
                </Button>
              }
            />,
          ];
        },
      }}
      columns={[
        {
          accessorKey: "enable",
          header: t("enable", "Enable"),
          cell: ({ row }) => (
            <Switch
              checked={Boolean(row.getValue("enable"))}
              onCheckedChange={async (checked) => {
                await updatePaymentMethod(
                  {
                    ...buildPaymentPayload({}, row.original),
                    enable: checked,
                  } as API.UpdatePaymentMethodRequest
                );
                ref.current?.refresh();
              }}
            />
          ),
        },
        {
          accessorKey: "icon",
          header: t("icon", "Icon"),
          cell: ({ row }) => {
            const icon = row.getValue("icon") as string;
            return (
              <Avatar className="h-8 w-8">
                {icon ? (
                  <AvatarImage alt={row.getValue("name")} src={icon} />
                ) : null}
                <AvatarFallback>
                  {(row.getValue("name") as string)?.charAt(0) || "?"}
                </AvatarFallback>
              </Avatar>
            );
          },
        },
        {
          accessorKey: "name",
          header: t("name", "Name"),
        },
        {
          accessorKey: "sort",
          header: t("sort", "Sort"),
          cell: ({ row }) => row.original.sort ?? 0,
        },
        {
          accessorKey: "platform",
          header: t("platform", "Platform"),
          cell: ({ row }) => <Badge>{t(row.original.platform)}</Badge>,
        },
        {
          accessorKey: "notify_url",
          header: t("notify_url", "Notify URL"),
        },
        {
          accessorKey: "fee",
          header: t("handlingFee", "Handling Fee"),
          cell: ({ row }) => {
            const feeMode = row.original.fee_mode;
            if (feeMode === 1) {
              return <Badge>{row.original.fee_percent}%</Badge>;
            }
            if (feeMode === 2) {
              return (
                <Badge>
                  <Display type="currency" value={row.original.fee_amount} />
                </Badge>
              );
            }
            return "--";
          },
        },
      ]}
      header={{
        title: t("paymentManagement", "Payment Management"),
        toolbar: (
          <PaymentForm<PaymentFormValues>
            loading={loading}
            onSubmit={async (values) => {
              setLoading(true);
              try {
                await createPaymentMethod(
                  {
                    ...buildPaymentPayload(values),
                    enable: false,
                  } as API.CreatePaymentMethodRequest
                );
                toast.success(t("createSuccess", "Created successfully"));
                ref.current?.refresh();
                setLoading(false);
                return true;
              } catch {
                setLoading(false);
                return false;
              }
            }}
            title={t("createPayment", "Add Payment Method")}
            trigger={<Button>{t("create", "Add Payment Method")}</Button>}
          />
        ),
      }}
      params={[
        {
          key: "search",
          placeholder: t("searchPlaceholder", "Enter search terms"),
        },
      ]}
      request={async (pagination, filter) => {
        const { data } = await getPaymentMethodList({
          ...pagination,
          ...filter,
        });
        const list = ((data?.data?.list || []) as PaymentRow[]).sort((a, b) => {
          const sortDiff = (a.sort ?? 0) - (b.sort ?? 0);
          if (sortDiff !== 0) return sortDiff;
          return a.id - b.id;
        });
        return {
          list,
          total: data?.data?.total || 0,
        };
      }}
    />
  );
}
