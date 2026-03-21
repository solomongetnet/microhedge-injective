"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, Bell, Shield, Mail, Smartphone, Key, Check, Zap, LogOut } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function SettingsPage() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [hedgeAlerts, setHedgeAlerts] = useState(true);
  const [priceAlerts, setPriceAlerts] = useState(true);
  const [dailyDigest, setDailyDigest] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account and preferences</p>
      </div>

      <Tabs defaultValue="account" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="notifications">Alerts & Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>

        {/* Account Tab */}
        <TabsContent value="account" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Manage your account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* User Profile */}
              <div className="flex items-center gap-4 pb-6 border-b border-border">
                <Avatar className="h-16 w-16 bg-primary text-primary-foreground">
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold text-foreground">John Doe</div>
                  <p className="text-sm text-muted-foreground">john.doe@microhedge.io</p>
                  <Button size="sm" variant="outline" className="mt-2">
                    Update Photo
                  </Button>
                </div>
              </div>

              {/* Account Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first-name">First Name</Label>
                  <Input
                    id="first-name"
                    defaultValue="John"
                    className="bg-input border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last-name">Last Name</Label>
                  <Input
                    id="last-name"
                    defaultValue="Doe"
                    className="bg-input border-border"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue="john.doe@microhedge.io"
                    className="bg-input border-border"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  Save Changes
                </Button>
                <Button variant="outline">Cancel</Button>
              </div>
            </CardContent>
          </Card>

          {/* Account Status */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Account Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-foreground">Account Status</div>
                  <p className="text-sm text-muted-foreground">Your account is active and in good standing</p>
                </div>
                <Badge className="bg-positive/20 text-positive flex gap-1">
                  <Check className="w-3 h-3" />
                  Active
                </Badge>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div>
                  <div className="font-medium text-foreground">Member Since</div>
                  <p className="text-sm text-muted-foreground">January 15, 2024</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Alerts & Notifications</CardTitle>
              <CardDescription>Manage how you receive updates about your hedges</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Email Notifications */}
              <div className="space-y-4 border-b border-border pb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <div className="font-medium text-foreground">Email Notifications</div>
                      <p className="text-sm text-muted-foreground">Receive alerts via email</p>
                    </div>
                  </div>
                  <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                </div>
              </div>

              {/* Push Notifications */}
              <div className="space-y-4 border-b border-border pb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <div className="font-medium text-foreground">Push Notifications</div>
                      <p className="text-sm text-muted-foreground">Get notifications on your device</p>
                    </div>
                  </div>
                  <Switch checked={pushNotifications} onCheckedChange={setPushNotifications} />
                </div>
              </div>

              {/* Hedge Activity Alerts */}
              <div className="space-y-4 border-b border-border pb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-accent" />
                    <div>
                      <div className="font-medium text-foreground">Hedge Activity Alerts</div>
                      <p className="text-sm text-muted-foreground">Notify when hedges are opened/closed</p>
                    </div>
                  </div>
                  <Switch checked={hedgeAlerts} onCheckedChange={setHedgeAlerts} />
                </div>
              </div>

              {/* Price Alerts */}
              <div className="space-y-4 border-b border-border pb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Zap className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <div className="font-medium text-foreground">Price Alerts</div>
                      <p className="text-sm text-muted-foreground">Alert when prices hit targets</p>
                    </div>
                  </div>
                  <Switch checked={priceAlerts} onCheckedChange={setPriceAlerts} />
                </div>
              </div>

              {/* Daily Digest */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium text-foreground">Daily Digest</div>
                    <p className="text-sm text-muted-foreground">Summary email every morning at 9 AM</p>
                  </div>
                </div>
                <Switch checked={dailyDigest} onCheckedChange={setDailyDigest} />
              </div>

              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground w-full mt-4">
                Save Preferences
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Keep your account secure</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Password */}
              <div className="border-b border-border pb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="font-medium text-foreground">Password</div>
                    <p className="text-sm text-muted-foreground">Last changed 3 months ago</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Change Password
                  </Button>
                </div>
              </div>

              {/* Two-Factor Authentication */}
              <div className="border-b border-border pb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-foreground">Two-Factor Authentication</div>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                  </div>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Key className="w-4 h-4" />
                    Enable
                  </Button>
                </div>
              </div>

              {/* API Keys */}
              <div className="border-b border-border pb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-foreground">API Keys</div>
                    <p className="text-sm text-muted-foreground">Manage your API access</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Manage Keys
                  </Button>
                </div>
              </div>

              {/* Active Sessions */}
              <div>
                <div className="font-medium text-foreground mb-3">Active Sessions</div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-secondary/20 rounded-lg border border-border">
                    <div>
                      <div className="text-sm font-medium text-foreground">Current Device</div>
                      <p className="text-xs text-muted-foreground">Chrome on Mac · 192.168.1.1</p>
                    </div>
                    <Badge className="bg-positive/20 text-positive">Active</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="bg-card border-destructive/30">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full text-destructive border-destructive/30 hover:bg-destructive/5 gap-2">
                <LogOut className="w-4 h-4" />
                Sign Out All Devices
              </Button>
              <Button variant="outline" className="w-full text-destructive border-destructive/30 hover:bg-destructive/5">
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Display Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Currency */}
              <div className="space-y-2">
                <Label htmlFor="currency">Preferred Currency</Label>
                <select
                  id="currency"
                  defaultValue="usd"
                  className="w-full px-3 py-2 rounded-lg bg-input border border-border text-foreground"
                >
                  <option value="usd">USD ($)</option>
                  <option value="eur">EUR (€)</option>
                  <option value="gbp">GBP (£)</option>
                  <option value="jpy">JPY (¥)</option>
                </select>
              </div>

              {/* Decimal Places */}
              <div className="space-y-2">
                <Label htmlFor="decimals">Price Decimals</Label>
                <select
                  id="decimals"
                  defaultValue="2"
                  className="w-full px-3 py-2 rounded-lg bg-input border border-border text-foreground"
                >
                  <option value="0">0</option>
                  <option value="2">2</option>
                  <option value="4">4</option>
                </select>
              </div>

              {/* Date Format */}
              <div className="space-y-2">
                <Label htmlFor="dateformat">Date Format</Label>
                <select
                  id="dateformat"
                  defaultValue="mdy"
                  className="w-full px-3 py-2 rounded-lg bg-input border border-border text-foreground"
                >
                  <option value="mdy">MM/DD/YYYY</option>
                  <option value="dmy">DD/MM/YYYY</option>
                  <option value="ymd">YYYY-MM-DD</option>
                </select>
              </div>

              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground w-full">
                Save Preferences
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
