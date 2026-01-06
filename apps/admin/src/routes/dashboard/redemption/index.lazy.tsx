import { createLazyFileRoute } from "@tanstack/react-router";
import Redemption from "@/sections/redemption";

export const Route = createLazyFileRoute("/dashboard/redemption/")({
  component: Redemption,
});
