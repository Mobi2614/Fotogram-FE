"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@/contexts/user-context";
import VideoGrid from "./video-grid";

export default function ProfileTabs() {
  const [activeTab, setActiveTab] = useState("photos");
  const { user } = useUser();

  if (user?.role !== "creator") return null;

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
      <TabsList className="grid w-full grid-cols-1">
        <TabsTrigger value="photos">Your Photos</TabsTrigger>
      </TabsList>
      <TabsContent value="photos">
        <VideoGrid />
      </TabsContent>
    </Tabs>
  );
}
