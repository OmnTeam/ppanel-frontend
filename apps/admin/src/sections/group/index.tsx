"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";
import { useTranslation } from "react-i18next";
// import UserGroups from "./user-groups";
import NodeGroups from "./node-groups";
import GroupHistory from "./group-history";
import GroupConfig from "./group-config";
import AverageModeTab from "./average-mode-tab";
import SubscribeModeTab from "./subscribe-mode-tab";
import TrafficModeTab from "./traffic-mode-tab";
import CurrentGroupResults from "./current-group-results";

export default function Group() {
  const { t } = useTranslation("group");

  return (
    <div className="space-y-4">
      <h2 className="font-semibold text-lg">
        {t("title", "Group Management")}
      </h2>

      <Tabs defaultValue="config">
        <TabsList className="flex flex-wrap gap-2">
          <TabsTrigger value="config">
            {t("config", "Config")}
          </TabsTrigger>
          {/* <TabsTrigger value="user">
            {t("userGroups", "User Groups")}
          </TabsTrigger> */}
          <TabsTrigger value="node">
            {t("nodeGroups", "Node Groups")}
          </TabsTrigger>
          <TabsTrigger value="average">
            {t("averageMode", "Average Mode")}
          </TabsTrigger>
          <TabsTrigger value="subscribe">
            {t("subscribeMode", "Subscribe Mode")}
          </TabsTrigger>
          <TabsTrigger value="traffic">
            {t("trafficMode", "Traffic Mode")}
          </TabsTrigger>
          <TabsTrigger value="results">
            {t("currentGroupingResult", "Current Grouping Result")}
          </TabsTrigger>
          <TabsTrigger value="history">
            {t("history", "History")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="config" className="mt-4">
          <GroupConfig />
        </TabsContent>

        {/* <TabsContent value="user" className="mt-4">
          <UserGroups />
        </TabsContent> */}

        <TabsContent value="node" className="mt-4">
          <NodeGroups />
        </TabsContent>

        <TabsContent value="average" className="mt-4">
          <AverageModeTab />
        </TabsContent>

        <TabsContent value="subscribe" className="mt-4">
          <SubscribeModeTab />
        </TabsContent>

        <TabsContent value="traffic" className="mt-4">
          <TrafficModeTab />
        </TabsContent>

        <TabsContent value="results" className="mt-4">
          <CurrentGroupResults />
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          <GroupHistory />
        </TabsContent>
      </Tabs>
    </div>
  );
}
