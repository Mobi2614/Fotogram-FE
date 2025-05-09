"use client";

import { UserProvider } from "@/contexts/user-context";
import React, { Suspense } from "react";
import { SidebarProvider } from "./ui/sidebar";
import { AppSidebar } from "./app-sidebar";
import Header from "./header";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense>
      <QueryClientProvider client={queryClient}>
        <UserProvider>
          <SidebarProvider>
            <AppSidebar />
            <main className="w-full">
              <Header />
              {children}
            </main>
          </SidebarProvider>
        </UserProvider>
      </QueryClientProvider>
    </Suspense>
  );
}
