"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import {
  ProList,
  type ProListActions,
} from "@workspace/ui/composed/pro-list/pro-list";
import { Icon } from "@workspace/ui/composed/icon";
import { Markdown } from "@workspace/ui/composed/markdown";
import { queryAnnouncement } from "@workspace/ui/services/user/announcement";
import { formatDate } from "@workspace/ui/utils/formatting";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";

export default function Announcement() {
  const { t } = useTranslation("dashboard");
  const [, setActiveTab] = useState("all");
  const pinnedRef = useRef<ProListActions>(null);
  const normalRef = useRef<ProListActions>(null);

  const requestAnnouncements = async (
    pagination: { page: number; size: number },
    filter: { pinned?: boolean; popup?: boolean }
  ) => {
    const params: any = {
      page: pagination.page,
      size: pagination.size,
    };

    if (filter.pinned !== undefined) {
      params.pinned = filter.pinned;
    }
    if (filter.popup !== undefined) {
      params.popup = filter.popup;
    }

    const response = await queryAnnouncement(params);
    return {
      list: response.data.data?.announcements || [],
      total: response.data.data?.total || 0,
    };
  };

  const renderAnnouncement = (item: any) => (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg">{item.title}</CardTitle>
            {item.pinned && (
              <span className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                <Icon className="size-3" icon="uil:pin" />
                {t("pinned", "Pinned")}
              </span>
            )}
            {item.popup && (
              <span className="flex items-center gap-1 rounded-full bg-orange-500/10 px-2 py-0.5 text-xs font-medium text-orange-500">
                <Icon className="size-3" icon="uil:popcorn" />
                {t("popup", "Popup")}
              </span>
            )}
          </div>
          <CardDescription className="text-sm">
            <time dateTime={item.created_at}>
              {formatDate(item.created_at)}
            </time>
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="prose prose-sm max-w-none dark:prose-invert">
          <Markdown>{item.content}</Markdown>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-4">
      <h2 className="flex items-center gap-1.5 font-semibold">
        <Icon className="size-5" icon="uil:bell" />
        {t("announcements", "Announcements")}
      </h2>
      <Tabs defaultValue="all" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">
            {t("all", "All")}
          </TabsTrigger>
          <TabsTrigger value="pinned">
            {t("pinnedOnly", "Pinned Only")}
          </TabsTrigger>
          <TabsTrigger value="popup">
            {t("popupOnly", "Popup Only")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <ProList
            action={normalRef}
            renderItem={renderAnnouncement}
            request={async (pagination) => {
              return requestAnnouncements(pagination, {});
            }}
          />
        </TabsContent>

        <TabsContent value="pinned">
          <ProList
            action={pinnedRef}
            renderItem={renderAnnouncement}
            request={async (pagination) => {
              return requestAnnouncements(pagination, { pinned: true });
            }}
          />
        </TabsContent>

        <TabsContent value="popup">
          <ProList
            action={normalRef}
            renderItem={renderAnnouncement}
            request={async (pagination) => {
              return requestAnnouncements(pagination, { popup: true });
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
