import { Sidebar } from "~/components/ui/sidebar";
import React from "react";

// Define the proper type for params
type PageParams = { guildId: string };

export default function ServerLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: PageParams | Promise<PageParams>;
}) {
  // Use type assertion to handle the potential Promise type
  const resolvedParams = React.use(params as any) as PageParams;
  
  return (
    <div className="flex">
      <Sidebar guildId={resolvedParams.guildId} />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}