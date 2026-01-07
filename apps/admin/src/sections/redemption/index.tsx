import { Button } from "@workspace/ui/components/button";
import { Switch } from "@workspace/ui/components/switch";
import { ConfirmButton } from "@workspace/ui/composed/confirm-button";
import {
  ProTable,
  type ProTableActions,
} from "@workspace/ui/composed/pro-table/pro-table";
import {
  batchDeleteRedemptionCode,
  createRedemptionCode,
  deleteRedemptionCode,
  getRedemptionCodeList,
  toggleRedemptionCodeStatus,
  updateRedemptionCode,
} from "@workspace/ui/services/admin/redemption";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useSubscribe } from "@/stores/subscribe";
import RedemptionForm from "./redemption-form";
import RedemptionRecords from "./redemption-records";

export default function Redemption() {
  const { t } = useTranslation("redemption");
  const [loading, setLoading] = useState(false);
  const [recordsOpen, setRecordsOpen] = useState(false);
  const [selectedCodeId, setSelectedCodeId] = useState<number | null>(null);
  const { subscribes } = useSubscribe();
  const ref = useRef<ProTableActions>(null);
  return (
    <>
    <ProTable<API.RedemptionCode, { subscribe_plan: number; unit_time: string; code: string }>
      action={ref}
      actions={{
        render: (row) => [
          <Button
            key="records"
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedCodeId(row.id);
              setRecordsOpen(true);
            }}
          >
            {t("records", "Records")}
          </Button>,
          <RedemptionForm<API.UpdateRedemptionCodeRequest>
            initialValues={row}
            key="edit"
            loading={loading}
            onSubmit={async (values) => {
              setLoading(true);
              try {
                await updateRedemptionCode({ ...values });
                toast.success(t("updateSuccess", "Update Success"));
                ref.current?.refresh();
                setLoading(false);
                return true;
              } catch (_error) {
                setLoading(false);
                return false;
              }
            }}
            title={t("editRedemptionCode", "Edit Redemption Code")}
            trigger={t("edit", "Edit")}
          />,
          <ConfirmButton
            cancelText={t("cancel", "Cancel")}
            confirmText={t("confirm", "Confirm")}
            description={t(
              "deleteWarning",
              "Once deleted, data cannot be recovered. Please proceed with caution."
            )}
            key="delete"
            onConfirm={async () => {
              await deleteRedemptionCode({ id: row.id });
              toast.success(t("deleteSuccess", "Delete Success"));
              ref.current?.refresh();
            }}
            title={t("confirmDelete", "Are you sure you want to delete?")}
            trigger={
              <Button variant="destructive">{t("delete", "Delete")}</Button>
            }
          />,
        ],
        batchRender: (rows) => [
          <ConfirmButton
            cancelText={t("cancel", "Cancel")}
            confirmText={t("confirm", "Confirm")}
            description={t(
              "deleteWarning",
              "Once deleted, data cannot be recovered. Please proceed with caution."
            )}
            key="delete"
            onConfirm={async () => {
              await batchDeleteRedemptionCode({
                ids: rows.map((item) => item.id),
              });
              toast.success(t("deleteSuccess", "Delete Success"));
              ref.current?.reset();
            }}
            title={t("confirmDelete", "Are you sure you want to delete?")}
            trigger={
              <Button variant="destructive">{t("delete", "Delete")}</Button>
            }
          />,
        ],
      }}
      columns={[
        {
          accessorKey: "code",
          header: t("code", "Code"),
        },
        {
          accessorKey: "subscribe_plan",
          header: t("subscribePlan", "Subscribe Plan"),
          cell: ({ row }) => {
            const plan = subscribes?.find(
              (s) => s.id === row.getValue("subscribe_plan")
            );
            return plan?.name || "--";
          },
        },
        {
          accessorKey: "unit_time",
          header: t("unitTime", "Unit Time"),
          cell: ({ row }) => {
            const unitTime = row.getValue("unit_time") as string;
            const unitTimeMap: Record<string, string> = {
              day: t("form.day", "Day"),
              month: t("form.month", "Month"),
              quarter: t("form.quarter", "Quarter"),
              half_year: t("form.halfYear", "Half Year"),
              year: t("form.year", "Year"),
            };
            return unitTimeMap[unitTime] || unitTime;
          },
        },
        {
          accessorKey: "quantity",
          header: t("duration", "Duration"),
          cell: ({ row }) => `${row.original.quantity}`,
        },
        {
          accessorKey: "total_count",
          header: t("totalCount", "Total Count"),
          cell: ({ row }) => (
            <div className="flex flex-col">
              <span>
                {t("totalCount", "Total")}: {row.original.total_count}
              </span>
              <span>
                {t("remainingCount", "Remaining")}:{" "}
                {row.original.total_count - (row.original.used_count || 0)}
              </span>
              <span>
                {t("usedCount", "Used")}: {row.original.used_count || 0}
              </span>
            </div>
          ),
        },
        {
          accessorKey: "status",
          header: t("status", "Status"),
          cell: ({ row }) => (
            <Switch
              defaultChecked={row.getValue("status") === 1}
              onCheckedChange={async (checked) => {
                await toggleRedemptionCodeStatus({
                  id: row.original.id,
                  status: checked ? 1 : 0,
                });
                toast.success(
                  checked
                    ? t("updateSuccess", "Update Success")
                    : t("updateSuccess", "Update Success")
                );
                ref.current?.refresh();
              }}
            />
          ),
        },
      ]}
      header={{
        toolbar: (
          <RedemptionForm<API.CreateRedemptionCodeRequest>
            loading={loading}
            onSubmit={async (values) => {
              setLoading(true);
              try {
                await createRedemptionCode(values);
                toast.success(t("createSuccess", "Create Success"));
                ref.current?.refresh();
                setLoading(false);
                return true;
              } catch (_error) {
                setLoading(false);
                return false;
              }
            }}
            title={t("createRedemptionCode", "Create Redemption Code")}
            trigger={t("create", "Create")}
          />
        ),
      }}
      params={[
        {
          key: "subscribe_plan",
          placeholder: t("subscribePlan", "Subscribe Plan"),
          options: subscribes?.map((item) => ({
            label: item.name!,
            value: String(item.id),
          })),
        },
        {
          key: "unit_time",
          placeholder: t("unitTime", "Unit Time"),
          options: [
            { label: t("form.day", "Day"), value: "day" },
            { label: t("form.month", "Month"), value: "month" },
            { label: t("form.quarter", "Quarter"), value: "quarter" },
            { label: t("form.halfYear", "Half Year"), value: "half_year" },
            { label: t("form.year", "Year"), value: "year" },
          ],
        },
        {
          key: "code",
        },
      ]}
      request={async (pagination, filters) => {
        const { data } = await getRedemptionCodeList({
          ...pagination,
          ...filters,
        });
        return {
          list: data.data?.list || [],
          total: data.data?.total || 0,
        };
      }}
    />
    <RedemptionRecords
      codeId={selectedCodeId}
      open={recordsOpen}
      onOpenChange={setRecordsOpen}
    />
    </>
  );
}
