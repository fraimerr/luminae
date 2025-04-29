"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Palette, Image as ImageIcon, Type, Layout } from "lucide-react";
import { useAuth } from "~/contexts/AuthContext";

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Colors & Theme
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Primary Color</Label>
              <div className="grid grid-cols-6 gap-2">
                {["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEEAD", "#D4A5A5"].map((color) => (
                  <button
                    key={color}
                    className="w-full aspect-square rounded-md border-2 border-border hover:border-primary transition-colors"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Background Style</Label>
              <div className="grid grid-cols-3 gap-2">
                <Button variant="outline" size="sm" className="w-full">
                  Solid
                </Button>
                <Button variant="outline" size="sm" className="w-full">
                  Gradient
                </Button>
                <Button variant="outline" size="sm" className="w-full">
                  Pattern
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Type className="w-5 h-5" />
            Text Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Username Style</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" className="w-full">
                  Default
                </Button>
                <Button variant="outline" size="sm" className="w-full">
                  Custom
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Custom Text</Label>
              <Input placeholder="Enter custom text..." />
            </div>
            <div className="space-y-2">
              <Label>Font Family</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" className="w-full font-sans">
                  Sans
                </Button>
                <Button variant="outline" size="sm" className="w-full font-serif">
                  Serif
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5" />
            Background Image
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Upload Image</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                <Button variant="outline" size="sm">
                  Choose File
                </Button>
                <p className="text-xs text-muted-foreground mt-2">Supports PNG, JPG up to 2MB</p>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Preset Backgrounds</Label>
              <div className="grid grid-cols-3 gap-2">
                {Array(6)
                  .fill(0)
                  .map((_, i) => (
                    <button
                      key={i}
                      className="aspect-video rounded-md bg-secondary hover:ring-2 hover:ring-primary transition-all"
                    />
                  ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardContent className="pt-6">
          <div className="flex justify-end gap-2">
            <Button variant="outline">Reset to Default</Button>
            <Button>Save Changes</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
