import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { Icon } from "@workspace/ui/composed/icon";
import { adminGenerateCaptcha } from "@workspace/ui/services/admin/auth";
import { adminVerifyCaptchaSlider } from "@workspace/ui/services/admin/auth";
import { forwardRef, useCallback, useImperativeHandle, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

export interface SliderCaptchaRef {
  reset: () => void;
}

interface SliderCaptchaProps {
  value?: string;
  onChange?: (value: string) => void;
}

interface TrailPoint {
  x: number;
  y: number;
  t: number;
}

const BLOCK_SIZE = 100;
const BG_NATURAL_WIDTH = 560;
const BG_NATURAL_HEIGHT = 280;

const SliderCaptcha = forwardRef<SliderCaptchaRef, SliderCaptchaProps>(
  ({ onChange }, ref) => {
    const { t } = useTranslation("auth");
    const containerRef = useRef<HTMLDivElement>(null);
    const [open, setOpen] = useState(false);
    const [captchaId, setCaptchaId] = useState("");
    const [bgImage, setBgImage] = useState("");
    const [blockImage, setBlockImage] = useState("");
    const [loading, setLoading] = useState(false);
    const [verified, setVerified] = useState(false);
    const [status, setStatus] = useState<"idle" | "success" | "fail">("idle");
    const [blockPos, setBlockPos] = useState({ x: 0, y: 50 });
    const [shaking, setShaking] = useState(false);

    const dragging = useRef(false);
    const startPointer = useRef({ x: 0, y: 0 });
    const startBlock = useRef({ x: 0, y: 50 });
    const dragStartTime = useRef(0);
    const trail = useRef<TrailPoint[]>([]);

    const getContainerSize = () => {
      const el = containerRef.current;
      if (!el) return { w: BG_NATURAL_WIDTH, h: BG_NATURAL_HEIGHT };
      return { w: el.clientWidth, h: el.clientHeight };
    };

    const fetchCaptcha = useCallback(async () => {
      setLoading(true);
      setStatus("idle");
      setBlockPos({ x: 0, y: 50 });
      trail.current = [];
      try {
        const res = await adminGenerateCaptcha();
        const data = res.data?.data;
        if (data) {
          setCaptchaId(data.id);
          setBgImage(data.image);
          setBlockImage(data.block_image ?? "");
        }
      } catch (e) {
        console.error("Failed to generate slider captcha:", e);
      } finally {
        setLoading(false);
      }
    }, []);

    const handleOpen = () => {
      if (verified) return;
      setOpen(true);
      fetchCaptcha();
    };

    useImperativeHandle(ref, () => ({
      reset: () => {
        setVerified(false);
        onChange?.("");
        setOpen(false);
        trail.current = [];
      },
    }));

    const onPointerDown = (e: React.PointerEvent) => {
      if (status === "success" || loading) return;
      dragging.current = true;
      dragStartTime.current = Date.now();
      trail.current = [];
      startPointer.current = { x: e.clientX, y: e.clientY };
      startBlock.current = { ...blockPos };
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      e.preventDefault();

      const { w, h } = getContainerSize();
      const scaleX = BG_NATURAL_WIDTH / w;
      const scaleY = BG_NATURAL_HEIGHT / h;
      trail.current.push({
        x: Math.round(startBlock.current.x),
        y: Math.round(startBlock.current.y),
        t: 0,
      });
      void scaleX; void scaleY;
    };

    const onPointerMove = (e: React.PointerEvent) => {
      if (!dragging.current) return;
      const { w, h } = getContainerSize();
      const scaleX = BG_NATURAL_WIDTH / w;
      const scaleY = BG_NATURAL_HEIGHT / h;
      const dx = (e.clientX - startPointer.current.x) * scaleX;
      const dy = (e.clientY - startPointer.current.y) * scaleY;
      const newX = Math.max(0, Math.min(startBlock.current.x + dx, BG_NATURAL_WIDTH - BLOCK_SIZE));
      const newY = Math.max(0, Math.min(startBlock.current.y + dy, BG_NATURAL_HEIGHT - BLOCK_SIZE));
      setBlockPos({ x: newX, y: newY });

      trail.current.push({
        x: Math.round(newX),
        y: Math.round(newY),
        t: Date.now() - dragStartTime.current,
      });
    };

    const onPointerUp = async (e: React.PointerEvent) => {
      if (!dragging.current) return;
      dragging.current = false;
      const { w, h } = getContainerSize();
      const scaleX = BG_NATURAL_WIDTH / w;
      const scaleY = BG_NATURAL_HEIGHT / h;
      const dx = (e.clientX - startPointer.current.x) * scaleX;
      const dy = (e.clientY - startPointer.current.y) * scaleY;
      const finalX = Math.round(Math.max(0, Math.min(startBlock.current.x + dx, BG_NATURAL_WIDTH - BLOCK_SIZE)));
      const finalY = Math.round(Math.max(0, Math.min(startBlock.current.y + dy, BG_NATURAL_HEIGHT - BLOCK_SIZE)));
      setBlockPos({ x: finalX, y: finalY });

      trail.current.push({
        x: finalX,
        y: finalY,
        t: Date.now() - dragStartTime.current,
      });

      try {
        const res = await adminVerifyCaptchaSlider({
          id: captchaId,
          x: finalX,
          y: finalY,
          trail: JSON.stringify(trail.current),
        });
        const token = res.data?.data?.token;
        if (token) {
          setStatus("success");
          setTimeout(() => {
            setVerified(true);
            onChange?.(token);
            setOpen(false);
          }, 600);
        } else {
          triggerFail();
        }
      } catch {
        triggerFail();
      }
    };

    const triggerFail = () => {
      setStatus("fail");
      setShaking(true);
      setTimeout(() => {
        setShaking(false);
        fetchCaptcha();
      }, 800);
    };

    const blockLeftPct = (blockPos.x / BG_NATURAL_WIDTH) * 100;
    const blockTopPct = (blockPos.y / BG_NATURAL_HEIGHT) * 100;
    const blockSizeWPct = (BLOCK_SIZE / BG_NATURAL_WIDTH) * 100;
    const blockSizeHPct = (BLOCK_SIZE / BG_NATURAL_HEIGHT) * 100;

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
              ? t("captcha.slider.success", "Verified")
              : t("captcha.slider.clickToVerify", "Click to verify")}
          </span>
          {verified && <Icon className="ml-auto text-green-500" icon="mdi:check-circle" />}
        </button>

        {/* Slider dialog */}
        <Dialog open={open} onOpenChange={(o) => { if (!o) setOpen(false); }}>
          <DialogContent className="select-none p-6 sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{t("captcha.slider.title", "Security Verification")}</DialogTitle>
            </DialogHeader>

            <div
              ref={containerRef}
              className={`relative w-full overflow-hidden rounded-md bg-muted ${
                shaking ? "animate-[shake_0.4s_ease-in-out]" : ""
              }`}
              style={{ paddingTop: `${(BG_NATURAL_HEIGHT / BG_NATURAL_WIDTH) * 100}%` }}
            >
              <div className="absolute inset-0">
                {loading ? (
                  <div className="flex h-full items-center justify-center">
                    <Icon className="animate-spin text-2xl" icon="mdi:loading" />
                  </div>
                ) : bgImage ? (
                  <>
                    <img
                      src={bgImage}
                      alt="captcha background"
                      className="absolute inset-0 h-full w-full"
                      draggable={false}
                    />
                    {blockImage && (
                      <img
                        src={blockImage}
                        alt="captcha block"
                        className="absolute cursor-grab active:cursor-grabbing"
                        style={{
                          filter: status === "success"
                            ? "drop-shadow(0 0 3px rgba(74,222,128,0.9))"
                            : status === "fail"
                              ? "drop-shadow(0 0 3px rgba(248,113,113,0.9))"
                              : "drop-shadow(0 0 2px rgba(255,255,255,0.7))",
                          left: `${blockLeftPct}%`,
                          top: `${blockTopPct}%`,
                          width: `${blockSizeWPct}%`,
                          height: `${blockSizeHPct}%`,
                          touchAction: "none",
                        }}
                        draggable={false}
                        onPointerDown={onPointerDown}
                        onPointerMove={onPointerMove}
                        onPointerUp={onPointerUp}
                      />
                    )}
                    {status !== "idle" && (
                      <div
                        className={`absolute inset-0 flex items-center justify-center text-sm font-medium ${
                          status === "success" ? "bg-green-500/20 text-green-700" : "bg-red-500/20 text-red-700"
                        }`}
                      >
                        {status === "success"
                          ? t("captcha.slider.success", "Verified")
                          : t("captcha.slider.fail", "Try again")}
                      </div>
                    )}
                  </>
                ) : null}
              </div>
            </div>

            <p className="text-center text-xs text-muted-foreground">
              {t("captcha.slider.hint", "Drag the piece to fit the puzzle")}
            </p>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="w-full"
              onClick={fetchCaptcha}
              disabled={loading}
            >
              <Icon icon="mdi:refresh" />
              {t("captcha.clickToRefresh", "Refresh")}
            </Button>
          </DialogContent>
        </Dialog>

        <style>{`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            20% { transform: translateX(-8px); }
            40% { transform: translateX(8px); }
            60% { transform: translateX(-6px); }
            80% { transform: translateX(6px); }
          }
        `}</style>
      </>
    );
  }
);

SliderCaptcha.displayName = "SliderCaptcha";

export default SliderCaptcha;
