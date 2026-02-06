import { useMutation } from "@tanstack/react-query";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { redeemCode } from "@workspace/ui/services/user/user";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

interface RedeemCodeProps {
  onSuccess?: () => void;
}

export default function RedeemCode({ onSuccess }: RedeemCodeProps) {
  const { t } = useTranslation("dashboard");
  const [code, setCode] = useState("");

  const redeemMutation = useMutation({
    mutationFn: (code: string) => redeemCode({ code }),
    onSuccess: (response) => {
      toast.success(response.data.message || t("redeemSuccess", "兑换成功"));
      setCode("");
      onSuccess?.();
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message || t("redeemFailed", "兑换失败");
      toast.error(errorMessage);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      toast.error(t("pleaseEnterCode", "请输入兑换码"));
      return;
    }
    redeemMutation.mutate(code.trim());
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{t("redeemCode", "CDK 兑换")}</CardTitle>
        <CardDescription>
          {t("redeemCodeDescription", "输入兑换码即可兑换对应的订阅套餐")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <Label htmlFor="redemption-code">
              {t("redemptionCode", "兑换码")}
            </Label>
            <div className="flex gap-2">
              <Input
                id="redemption-code"
                onChange={(e) => setCode(e.target.value)}
                placeholder={t(
                  "enterRedemptionCode",
                  "请输入兑换码"
                )}
                value={code}
              />
              <Button
                disabled={redeemMutation.isPending || !code.trim()}
                loading={redeemMutation.isPending}
                type="submit"
              >
                {t("redeem", "兑换")}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
