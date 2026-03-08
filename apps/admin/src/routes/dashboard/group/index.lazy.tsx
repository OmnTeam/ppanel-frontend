import { createLazyFileRoute } from "@tanstack/react-router";
import Group from "@/sections/group";

export const Route = createLazyFileRoute("/dashboard/group/")({
  component: Group,
});
