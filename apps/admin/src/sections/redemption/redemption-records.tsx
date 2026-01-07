import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import { getRedemptionRecordList } from "@workspace/ui/services/admin/redemption";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { formatDate } from "@/utils/common";

interface RedemptionRecordsProps {
  codeId: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function RedemptionRecords({
  codeId,
  open,
  onOpenChange,
}: RedemptionRecordsProps) {
  const { t } = useTranslation("redemption");
  const [loading, setLoading] = useState(false);
  const [records, setRecords] = useState<API.RedemptionRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [pagination, setPagination] = useState({ page: 1, size: 10 });

  const fetchRecords = async () => {
    if (!codeId) return;

    setLoading(true);
    try {
      const { data } = await getRedemptionRecordList({
        ...pagination,
        code_id: codeId,
      });
      setRecords(data.data?.list || []);
      setTotal(data.data?.total || 0);
    } catch (error) {
      console.error("Failed to fetch redemption records:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && codeId) {
      fetchRecords();
    }
  }, [open, codeId, pagination]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {t("records", "Redemption Records")}
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          {loading ? (
            <div className="flex justify-center py-8">
              <span>{t("loading", "Loading...")}</span>
            </div>
          ) : records.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {t("noRecords", "No records found")}
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("id", "ID")}</TableHead>
                    <TableHead>{t("userId", "User ID")}</TableHead>
                    <TableHead>{t("subscribeId", "Subscribe ID")}</TableHead>
                    <TableHead>{t("unitTime", "Unit Time")}</TableHead>
                    <TableHead>{t("quantity", "Quantity")}</TableHead>
                    <TableHead>{t("redeemedAt", "Redeemed At")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {records.map((record) => {
                    const unitTimeMap: Record<string, string> = {
                      day: t("form.day", "Day"),
                      month: t("form.month", "Month"),
                      quarter: t("form.quarter", "Quarter"),
                      half_year: t("form.halfYear", "Half Year"),
                      year: t("form.year", "Year"),
                    };
                    return (
                      <TableRow key={record.id}>
                        <TableCell>{record.id}</TableCell>
                        <TableCell>{record.user_id}</TableCell>
                        <TableCell>{record.subscribe_id}</TableCell>
                        <TableCell>{unitTimeMap[record.unit_time] || record.unit_time}</TableCell>
                        <TableCell>{record.quantity}</TableCell>
                        <TableCell>
                          {record.redeemed_at
                            ? formatDate(record.redeemed_at)
                            : "--"}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              {total > pagination.size && (
                <div className="flex justify-between items-center mt-4">
                  <span className="text-sm text-muted-foreground">
                    {t("total", "Total")}: {total}
                  </span>
                  <div className="flex gap-2">
                    <button
                      className="px-3 py-1 text-sm border rounded hover:bg-accent disabled:opacity-50"
                      disabled={pagination.page === 1}
                      onClick={() =>
                        setPagination((p) => ({ ...p, page: p.page - 1 }))
                      }
                    >
                      {t("previous", "Previous")}
                    </button>
                    <button
                      className="px-3 py-1 text-sm border rounded hover:bg-accent disabled:opacity-50"
                      disabled={pagination.page * pagination.size >= total}
                      onClick={() =>
                        setPagination((p) => ({ ...p, page: p.page + 1 }))
                      }
                    >
                      {t("next", "Next")}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
