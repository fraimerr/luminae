import Link from "next/link";
import { LucideIcon, LayoutDashboard, Box, Terminal, ScrollText } from "lucide-react";

interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
}

const items: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard/[guildId]",
    icon: LayoutDashboard,
  },
  {
    title: "Modules",
    href: "/dashboard/[guildId]/modules",
    icon: Box,
  },
  {
    title: "Commands",
    href: "/dashboard/[guildId]/commands",
    icon: Terminal,
  },
  {
    title: "Logs",
    href: "/dashboard/[guildId]/logs",
    icon: ScrollText,
  },
];

export function Sidebar({ guildId }: { guildId: string }) {
  return (
    <aside className="w-64 border-r min-h-[calc(100vh-65px)] p-4 space-y-4">
      <nav className="space-y-2">
        {items.map((item) => {
          const href = item.href.replace("[guildId]", guildId);
          return (
            <Link
              key={item.href}
              href={href}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
            >
              <item.icon className="h-4 w-4" />
              {item.title}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
