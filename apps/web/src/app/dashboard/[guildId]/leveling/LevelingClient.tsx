"use client";

import React from "react";
import { Switch } from "~/components/ui/switch";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { getData } from "~/lib/api/getData";

const formSchema = z.object({
  enabled: z.boolean().default(true),
  announce: z.boolean().default(true),
  channelId: z.string().optional(),
  message: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function LevelingClient({
  guildId,
}: {
  guildId: string;
}) {
  const queryClient = useQueryClient();
  const { data: configData, isLoading } = useQuery({
    queryKey: [`/guilds/${guildId}/config/leveling`],
    queryFn: () => getData<{ data: FormValues }>(`/guilds/${guildId}/config/leveling`),
  });

  const { data: channels } = useQuery({
    queryKey: [`/guilds/${guildId}/channels`],
    queryFn: () => getData<{ data: Array<{ id: string; name: string }> }>(`/guilds/${guildId}/channels`),
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      enabled: true,
      announce: true,
      message: "{user.mention} has leveled up to **Level {level}**!",
    },
    values: configData?.data,
  });

  const { mutate } = useMutation({
    mutationFn: async (values: FormValues) => {
      const response = await fetch(`http://localhost:5000/v1/guilds/${guildId}/config/leveling`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json().catch(() => null);
        throw new Error(error?.message ?? "Failed to update leveling config");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`/guilds/${guildId}/config/leveling`],
      });
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-6 w-24 bg-muted rounded" />
            <div className="h-4 w-2/3 bg-muted rounded" />
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Leveling</h1>
        <p className="text-sm text-muted-foreground">Configure leveling settings for your server</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit((data) => mutate(data))}>
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Basic Settings</CardTitle>
                <CardDescription>Configure basic leveling settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="enabled"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Enable Leveling</FormLabel>
                        <FormDescription>Turn the leveling system on or off</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="announce"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Announce Level Ups</FormLabel>
                        <FormDescription>Send a message when users level up</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Announcement Settings</CardTitle>
                <CardDescription>Configure how level up announcements are shown</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="channelId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Announcement Channel</FormLabel>
                      <FormDescription>Choose where level up messages are sent</FormDescription>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a channel" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {channels?.data?.map((channel) => (
                            <SelectItem key={channel.id} value={channel.id}>
                              #{channel.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Level Up Message</FormLabel>
                      <FormDescription>
                        Customize the message sent when users level up. Available variables: {"{user.mention}"},{" "}
                        {"{level}"}
                      </FormDescription>
                      <FormControl>
                        <Textarea placeholder="Type your message here" className="resize-none" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => form.reset()}>
                Reset
              </Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
