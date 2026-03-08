"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@workspace/ui/components/button";
import { Checkbox } from "@workspace/ui/components/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { Label } from "@workspace/ui/components/label";
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
import TagInput from "@workspace/ui/composed/tag-input";
import { getGroupConfig, getNodeGroupList } from "@workspace/ui/services/admin/group";
import { useQuery } from "@tanstack/react-query";
import type { TFunction } from "i18next";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { z } from "zod";
import { useNode } from "@/stores/node";
import { useServer } from "@/stores/server";

export type ProtocolName =
  | "shadowsocks"
  | "vmess"
  | "vless"
  | "trojan"
  | "hysteria"
  | "tuic"
  | "anytls"
  | "naive"
  | "http"
  | "socks"
  | "mieru";

const buildSchema = (t: TFunction) =>
  z.object({
    name: z
      .string()
      .trim()
      .min(1, t("errors.nameRequired", "Please enter a name")),
    server_id: z
      .number({ message: t("errors.serverRequired", "Please select a server") })
      .int()
      .positive(t("errors.serverRequired", "Please select a server"))
      .optional(),
    protocol: z
      .string()
      .min(1, t("errors.protocolRequired", "Please select a protocol")),
    address: z
      .string()
      .trim()
      .min(1, t("errors.serverAddrRequired", "Please enter an entry address")),
    port: z
      .number({
        message: t("errors.portRange", "Port must be between 1 and 65535"),
      })
      .int()
      .min(1, t("errors.portRange", "Port must be between 1 and 65535"))
      .max(65_535, t("errors.portRange", "Port must be between 1 and 65535")),
    tags: z.array(z.string()),
    node_group_ids: z.optional(z.array(z.string()).default([])),
  });

export type NodeFormValues = z.infer<ReturnType<typeof buildSchema>>;

export default function NodeForm(props: {
  trigger: string;
  title: string;
  loading?: boolean;
  initialValues?: Partial<NodeFormValues>;
  onSubmit: (values: NodeFormValues) => Promise<boolean> | boolean;
}) {
  const { trigger, title, loading, initialValues, onSubmit } = props;
  const { t } = useTranslation("nodes");
  const Scheme = useMemo(() => buildSchema(t), [t]);
  const [open, setOpen] = useState(false);

  const [autoFilledFields, setAutoFilledFields] = useState<Set<string>>(
    new Set()
  );

  const addAutoFilledField = (fieldName: string) => {
    setAutoFilledFields((prev) => new Set(prev).add(fieldName));
  };

  const removeAutoFilledField = (fieldName: string) => {
    setAutoFilledFields((prev) => {
      const newSet = new Set(prev);
      newSet.delete(fieldName);
      return newSet;
    });
  };

  const form = useForm<NodeFormValues>({
    resolver: zodResolver(Scheme),
    defaultValues: {
      name: "",
      server_id: undefined,
      protocol: "",
      address: "",
      port: 0,
      tags: [],
      node_group_ids: [],
      ...initialValues,
    },
    mode: "onSubmit", // Only validate on form submission
  });

  const serverId = form.watch("server_id");

  const { servers, getAvailableProtocols } = useServer();
  const { tags } = useNode();

  const existingTags: string[] = tags || [];

  const availableProtocols = getAvailableProtocols(serverId);

  // Fetch node groups
  const { data: nodeGroupsData } = useQuery({
    queryKey: ["nodeGroups"],
    queryFn: async () => {
      const { data } = await getNodeGroupList({ page: 1, size: 1000 });
      return data.data?.list || [];
    },
  });

  // Fetch group config to check if group feature is enabled
  const { data: groupConfigData } = useQuery({
    queryKey: ["groupConfig"],
    queryFn: async () => {
      const { data } = await getGroupConfig();
      return data.data;
    },
  });

  const isGroupEnabled = groupConfigData?.enabled || false;

  useEffect(() => {
    if (initialValues) {
      const resetValues: NodeFormValues = {
        name: "",
        server_id: undefined,
        protocol: "",
        address: "",
        port: 0,
        tags: [],
        node_group_ids: [],
      };

      // Copy only the values we need from initialValues
      if (initialValues.name) resetValues.name = initialValues.name;
      if (initialValues.server_id) resetValues.server_id = initialValues.server_id;
      if (initialValues.protocol) resetValues.protocol = initialValues.protocol;
      if (initialValues.address) resetValues.address = initialValues.address;
      if (initialValues.port) resetValues.port = initialValues.port;
      if (initialValues.tags) resetValues.tags = initialValues.tags;

      // Convert node_group_ids from number[] to string[], ensure it's always an array
      if (initialValues.node_group_ids && Array.isArray(initialValues.node_group_ids)) {
        resetValues.node_group_ids = initialValues.node_group_ids.map((id: string | number) => String(id));
      } else {
        resetValues.node_group_ids = [];
      }

      form.reset(resetValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValues]);

  function handleServerChange(nextId?: number | null) {
    const id = nextId ?? undefined;
    form.setValue("server_id", id);

    if (!id) {
      setAutoFilledFields(new Set());
      return;
    }

    const selectedServer = servers.find((s) => s.id === id);
    if (!selectedServer) return;

    const currentValues = form.getValues();
    const fieldsToFill: string[] = [];

    if (!currentValues.name || autoFilledFields.has("name")) {
      form.setValue("name", selectedServer.name as string, {
        shouldDirty: false,
      });
      fieldsToFill.push("name");
    }

    if (!currentValues.address || autoFilledFields.has("address")) {
      form.setValue("address", selectedServer.address as string, {
        shouldDirty: false,
      });
      fieldsToFill.push("address");
    }

    const protocols = getAvailableProtocols(id);
    const firstProtocol = protocols[0];

    if (
      firstProtocol &&
      (!currentValues.protocol || autoFilledFields.has("protocol"))
    ) {
      form.setValue("protocol", firstProtocol.protocol, { shouldDirty: false });
      fieldsToFill.push("protocol");

      if (
        !currentValues.port ||
        currentValues.port === 0 ||
        autoFilledFields.has("port")
      ) {
        const port = firstProtocol.port || 0;
        form.setValue("port", port, { shouldDirty: false });
        fieldsToFill.push("port");
      }
    }

    setAutoFilledFields(new Set(fieldsToFill));
  }

  const handleManualFieldChange = (
    fieldName: keyof NodeFormValues,
    value: any
  ) => {
    form.setValue(fieldName, value);
    removeAutoFilledField(fieldName);
  };

  function handleProtocolChange(nextProto?: ProtocolName | null) {
    const protocol = (nextProto || "") as ProtocolName | "";
    form.setValue("protocol", protocol);

    if (!(protocol && serverId)) {
      removeAutoFilledField("protocol");
      return;
    }

    const currentValues = form.getValues();
    const isPortAutoFilled = autoFilledFields.has("port");

    removeAutoFilledField("protocol");

    if (!currentValues.port || currentValues.port === 0 || isPortAutoFilled) {
      const protocolData = availableProtocols.find(
        (p) => p.protocol === protocol
      );

      if (protocolData) {
        const port = protocolData.port || 0;
        form.setValue("port", port, { shouldDirty: false });
        addAutoFilledField("port");
      }
    }
  }

  async function handleSubmit(values: NodeFormValues) {
    const result = await onSubmit(values);
    if (result) {
      setOpen(false);
      setAutoFilledFields(new Set());
    }
  }

  return (
    <Sheet onOpenChange={setOpen} open={open}>
      <SheetTrigger asChild>
        <Button
          onClick={() => {
            form.reset();
            setAutoFilledFields(new Set());
          }}
        >
          {trigger}
        </Button>
      </SheetTrigger>

      <SheetContent className="w-[560px] max-w-full">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100dvh-48px-36px-36px-env(safe-area-inset-top))] px-6 pt-4">
          <Form {...form}>
            <form className="grid grid-cols-1 gap-4">
              <FormField
                control={form.control}
                name="server_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("server", "Server")}</FormLabel>
                    <FormControl>
                      <Combobox<number, false>
                        onChange={(v) => handleServerChange(v)}
                        options={servers.map((s) => ({
                          value: s.id,
                          label: `${s.name} (${(s.address as any) || ""})`,
                        }))}
                        placeholder={t("select_server", "Select server…")}
                        value={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="protocol"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("protocol", "Protocol")}</FormLabel>
                    <FormControl>
                      <Combobox<string, false>
                        onChange={(v) =>
                          handleProtocolChange((v as ProtocolName) || null)
                        }
                        options={availableProtocols.map((p) => ({
                          value: p.protocol,
                          label: `${p.protocol}${p.port ? ` (${p.port})` : ""}`,
                        }))}
                        placeholder={t("select_protocol", "Select protocol…")}
                        value={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("name", "Name")}</FormLabel>
                    <FormControl>
                      <EnhancedInput
                        {...field}
                        onValueChange={(v) =>
                          handleManualFieldChange("name", v as string)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("address", "Address")}</FormLabel>
                    <FormControl>
                      <EnhancedInput
                        {...field}
                        onValueChange={(v) =>
                          handleManualFieldChange("address", v as string)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="port"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("port", "Port")}</FormLabel>
                    <FormControl>
                      <EnhancedInput
                        {...field}
                        max={65_535}
                        min={1}
                        onValueChange={(v) =>
                          handleManualFieldChange("port", Number(v))
                        }
                        placeholder="1-65535"
                        type="number"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Tags field - always shown */}
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("tags", "Tags")}</FormLabel>
                    <FormControl>
                      <TagInput
                        onChange={(v) => form.setValue(field.name, v)}
                        options={existingTags}
                        placeholder={t(
                          "tags_placeholder",
                          "Use Enter or comma (,) to add multiple tags"
                        )}
                        value={field.value || []}
                      />
                    </FormControl>
                    <FormDescription>
                      {isGroupEnabled
                        ? t(
                            "tags_groupMode_description",
                            "Optional tags for display and filtering (node group will be used as tag if empty)."
                          )
                        : t(
                            "tags_description",
                            "Permission grouping tag (incl. plan binding and delivery policies)."
                          )}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Show Node Group field only when group feature is enabled */}
              {isGroupEnabled && (
                <FormField
                  control={form.control}
                  name="node_group_ids"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("nodeGroup", "Node Group")}</FormLabel>
                      <FormControl>
                        <div className="grid grid-cols-2 gap-2">
                          {nodeGroupsData?.map((g) => (
                            <div
                              key={g.id}
                              className="flex items-center space-x-2"
                            >
                              <Checkbox
                                id={`node-group-${g.id}`}
                                checked={field.value?.includes(String(g.id)) || false}
                                onCheckedChange={(checked) => {
                                  // Ensure field.value is always an array
                                  const currentValue = Array.isArray(field.value) ? field.value : [];
                                  if (checked) {
                                    const newValue = [...currentValue, String(g.id)];
                                    form.setValue(field.name, newValue, {
                                      shouldValidate: true,
                                      shouldDirty: true,
                                    });
                                  } else {
                                    const newValue = currentValue.filter((v: string) => v !== String(g.id));
                                    form.setValue(field.name, newValue, {
                                      shouldValidate: true,
                                      shouldDirty: true,
                                    });
                                  }
                                }}
                              />
                              <Label
                                htmlFor={`node-group-${g.id}`}
                                className="cursor-pointer"
                              >
                                {g.name}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </FormControl>
                      <FormDescription>
                        {t(
                          "nodeGroup_description",
                          "Assign this node to multiple groups for user access control."
                        )}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </form>
          </Form>
        </ScrollArea>

        <SheetFooter className="flex-row justify-end gap-2 pt-3">
          <Button
            disabled={loading}
            onClick={() => setOpen(false)}
            variant="outline"
          >
            {t("cancel", "Cancel")}
          </Button>
          <Button
            disabled={loading}
            onClick={form.handleSubmit(handleSubmit, (errors) => {
              const key = Object.keys(errors)[0] as keyof typeof errors;
              if (key) toast.error(String(errors[key]?.message));
              return false;
            })}
          >
            {t("confirm", "Confirm")}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
