"use client";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ApolloProvider, client } from "../lib/apolloClient";
import "./globals.css";
import { AppSidebar } from "@/components/ui/app-sidebar";
import Header from "@/components/ui/header";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={"antialiased"}>
        <SidebarProvider>
          <AppSidebar />
          <SidebarTrigger />
          <div className="w-full">
            <Header />
            <ApolloProvider client={client}>
              <div className="p-4">{children}</div>
            </ApolloProvider>
          </div>
        </SidebarProvider>
      </body>
    </html>
  );
}
