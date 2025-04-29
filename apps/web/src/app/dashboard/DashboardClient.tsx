"use client";

import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Plus, Settings } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "~/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { APIV1UserGuildsResponse } from "@luminae/types";
import { getData } from "~/lib/api/getData";

export default function DashboardClient() {
  const { data, isLoading } = useQuery({
    queryKey: ["/users/@me/guilds"],
    queryFn: () => getData<APIV1UserGuildsResponse>("/users/@me/guilds"),
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 animate-in fade-in-50">
        <div className="space-y-8">
          <Skeleton className="h-10 w-48" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array(3)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} className="aspect-square" />
              ))}
          </div>
        </div>
      </div>
    );
  }

  const guilds = data as APIV1UserGuildsResponse;

  return (
    <div className="container mx-auto px-4 py-16 animate-in fade-in-50">
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Your Servers
          </h1>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Server
          </Button>
        </div>

        <div className="grid gap-3 sm:grid-cols-4 lg:grid-cols-6">
          {guilds?.data.map((guild) => (
            <Card
              key={guild.id}
              className="group hover:shadow-lg transition-all"
            >
              <CardContent className="p-3">
                <div className="h-16 w-16 relative rounded-lg overflow-hidden mb-2 mx-auto">
                  <Image
                    src={
                      guild.icon
                        ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`
                        : "/12c5bcd4928a3a6453d4f676b0a59e86.jpg"
                    }
                    alt={`${guild.name} icon`}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="space-y-2">
                  <div className="text-center">
                    <h2 className="font-medium text-sm truncate">
                      {guild.name}
                    </h2>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full h-7 text-xs"
                    asChild
                  >
                    <Link
                      href={
                        guild.botPresent
                          ? `/dashboard/${guild.id}`
                          : `https://discord.com/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID}&permissions=8&scope=bot%20applications.commands&guild_id=${guild.id}&disable_guild_select=true`
                      }
                    >
                      {guild.botPresent ? (
                        <>
                          <Settings className="w-3 h-3 mr-1" />
                          Manage
                        </>
                      ) : (
                        <>
                          <Plus className="w-3 h-3 mr-1" />
                          Add Bot
                        </>
                      )}
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
} 