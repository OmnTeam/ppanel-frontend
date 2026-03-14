import { createLazyFileRoute } from "@tanstack/react-router";
import TrafficStatistics from "@/sections/user/traffic-statistics";

export const Route = createLazyFileRoute("/(main)/(user)/traffic")({
  component: TrafficStatistics,
});
