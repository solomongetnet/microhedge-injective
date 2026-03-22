"use client";

import { useState } from "react";
import { 
  User, 
  Bell, 
  Shield, 
  Zap, 
  Settings as SettingsIcon, 
  Wallet, 
  Globe, 
  Lock, 
  Smartphone, 
  Mail, 
  Check, 
  ChevronRight,
  Info,
  LogOut,
  Moon,
  Sun,
  Palette,
  Eye,
  Brain,
  Network
} from "lucide-react";
import { toast } from "sonner";
import { useAccount, useDisconnect } from "wagmi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function SettingsPage() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const [activeTab, setActiveTab] = useState("profile");

  // Mock states for interactive elements
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    onChain: true,
    marketing: false
  });

  const [aiPreferences, setAiPreferences] = useState({
    confidenceThreshold: "85",
    autoAnalyze: true
  });

  const handleSave = () => {
    toast.success("Settings saved successfully!", {
      description: "Your preferences have been updated."
    });
  };

  const handleDisconnect = () => {
    disconnect();
    toast.info("Wallet disconnected");
  };

  return (
    <div className="w-full space-y-10 p-6 pb-20 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#fce4ec] flex items-center justify-center text-[#d80073] shadow-sm">
              <SettingsIcon size={24} />
            </div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">Settings</h1>
          </div>
          <p className="text-gray-500 font-medium">Manage your MicroHedger profile and protocol preferences.</p>
        </div>
        
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            className="rounded-2xl border-gray-200 font-bold hover:bg-gray-50 transition-all"
            onClick={() => setActiveTab("profile")}
          >
            Cancel
          </Button>
          <Button 
            className="bg-[#d80073] hover:bg-[#c20067] text-white rounded-2xl font-black px-8 shadow-lg shadow-[#d80073]/20 transition-all active:scale-[0.98]"
            onClick={handleSave}
          >
            Save Changes
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-8">
        <TabsList className="bg-gray-100/50 p-1.5 rounded-[24px] border border-gray-200/50 w-full md:w-fit grid grid-cols-2 md:flex md:flex-wrap h-auto gap-1">
          <TabsTrigger 
            value="profile" 
            className="rounded-2xl font-bold py-3 px-6 data-[state=active]:bg-white data-[state=active]:text-[#d80073] data-[state=active]:shadow-sm transition-all"
          >
            <User size={16} className="mr-2" /> Profile
          </TabsTrigger>
          <TabsTrigger 
            value="notifications" 
            className="rounded-2xl font-bold py-3 px-6 data-[state=active]:bg-white data-[state=active]:text-[#d80073] data-[state=active]:shadow-sm transition-all"
          >
            <Bell size={16} className="mr-2" /> Notifications
          </TabsTrigger>
          <TabsTrigger 
            value="security" 
            className="rounded-2xl font-bold py-3 px-6 data-[state=active]:bg-white data-[state=active]:text-[#d80073] data-[state=active]:shadow-sm transition-all"
          >
            <Shield size={16} className="mr-2" /> Security
          </TabsTrigger>
          <TabsTrigger 
            value="advanced" 
            className="rounded-2xl font-bold py-3 px-6 data-[state=active]:bg-white data-[state=active]:text-[#d80073] data-[state=active]:shadow-sm transition-all"
          >
            <Zap size={16} className="mr-2" /> Advanced
          </TabsTrigger>
        </TabsList>

        {/* ── Profile Tab ── */}
        <TabsContent value="profile" className="space-y-6 outline-none">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* User Info Card */}
            <Card className="lg:col-span-2 border-none shadow-sm bg-white rounded-[32px] overflow-hidden">
              <CardHeader className="p-8 pb-4">
                <CardTitle className="text-2xl font-black text-gray-900">Personal Information</CardTitle>
                <CardDescription className="font-medium">Update your display details and public presence.</CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="flex flex-col md:flex-row items-center gap-8 p-6 bg-gray-50 rounded-[24px] border border-gray-100">
                  <div className="relative group">
                    <Avatar className="h-24 w-24 border-4 border-white shadow-md">
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-[#fce4ec] text-[#d80073] text-2xl font-black">
                        {address?.slice(2, 4).toUpperCase() || "MH"}
                      </AvatarFallback>
                    </Avatar>
                    <button className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-white text-[10px] font-bold uppercase tracking-widest">
                      Change
                    </button>
                  </div>
                  <div className="flex-1 text-center md:text-left space-y-2">
                    <h3 className="text-xl font-black text-gray-900">Wallet Identity</h3>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Active Connection</span>
                    </div>
                    <p className="text-sm text-gray-500 font-mono break-all">{address || "0x000...000"}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-widest text-gray-400">Display Name</Label>
                    <Input 
                      placeholder="e.g. Injective Farmer" 
                      className="rounded-2xl border-gray-100 bg-gray-50 focus:bg-white focus:border-[#d80073] transition-all h-12 font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-widest text-gray-400">Email Address</Label>
                    <Input 
                      type="email" 
                      placeholder="farmer@injective.network" 
                      className="rounded-2xl border-gray-100 bg-gray-50 focus:bg-white focus:border-[#d80073] transition-all h-12 font-bold"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-xs font-black uppercase tracking-widest text-gray-400">Bio / Farm Description</Label>
                    <Input 
                      placeholder="Managing 50 hectares of Coffee in Eastern Africa..." 
                      className="rounded-2xl border-gray-100 bg-gray-50 focus:bg-white focus:border-[#d80073] transition-all h-12 font-bold"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Wallet & Connection Card */}
            <Card className="border-none shadow-sm bg-white rounded-[32px] overflow-hidden flex flex-col">
              <CardHeader className="p-8 pb-4">
                <CardTitle className="text-2xl font-black text-gray-900">Wallet</CardTitle>
                <CardDescription className="font-medium">Connection status and assets.</CardDescription>
              </CardHeader>
              <CardContent className="p-8 flex-1 space-y-6">
                <div className="p-6 bg-indigo-600 rounded-[24px] text-white space-y-4 relative overflow-hidden group">
                  <div className="absolute -right-8 -bottom-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
                    <Wallet size={120} />
                  </div>
                  <div className="flex items-center justify-between relative z-10">
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-70">Mainnet Network</span>
                    <Globe size={14} className="opacity-70" />
                  </div>
                  <div className="space-y-1 relative z-10">
                    <div className="text-[10px] font-black uppercase tracking-widest opacity-70">Balance</div>
                    <div className="text-3xl font-black tracking-tighter">1,245.50 <span className="text-sm opacity-60">INJ</span></div>
                  </div>
                  <div className="pt-2 relative z-10">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-xl border border-white/10 w-fit">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Injective inEVM</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full h-12 rounded-2xl border-gray-100 font-bold hover:bg-gray-50 flex items-center justify-between px-6"
                  >
                    Switch Network <ChevronRight size={16} className="text-gray-400" />
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full h-12 rounded-2xl border-rose-50 text-rose-500 font-bold hover:bg-rose-50 hover:text-rose-600 flex items-center justify-center gap-2"
                    onClick={handleDisconnect}
                  >
                    <LogOut size={16} /> Disconnect Wallet
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ── Notifications Tab ── */}
        <TabsContent value="notifications" className="space-y-6 outline-none">
          <Card className="border-none shadow-sm bg-white rounded-[32px] overflow-hidden">
            <CardHeader className="p-8 pb-4">
              <CardTitle className="text-2xl font-black text-gray-900">Communication Preferences</CardTitle>
              <CardDescription className="font-medium">Choose how you receive alerts and updates.</CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                {/* Email Notifications */}
                <div className="flex items-center justify-between group">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#fce4ec] flex items-center justify-center text-[#d80073] group-hover:scale-110 transition-transform">
                      <Mail size={20} />
                    </div>
                    <div>
                      <h4 className="font-black text-gray-900 uppercase text-xs tracking-widest">Email Notifications</h4>
                      <p className="text-sm text-gray-500 font-medium">Weekly digest and hedge activity summaries.</p>
                    </div>
                  </div>
                  <Switch 
                    checked={notifications.email} 
                    onCheckedChange={(v) => setNotifications({...notifications, email: v})} 
                    className="data-[state=checked]:bg-[#d80073]"
                  />
                </div>

                {/* On-Chain Events */}
                <div className="flex items-center justify-between group">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                      <Network size={20} />
                    </div>
                    <div>
                      <h4 className="font-black text-gray-900 uppercase text-xs tracking-widest">On-Chain Alerts</h4>
                      <p className="text-sm text-gray-500 font-medium">Real-time alerts for smart contract executions.</p>
                    </div>
                  </div>
                  <Switch 
                    checked={notifications.onChain} 
                    onCheckedChange={(v) => setNotifications({...notifications, onChain: v})} 
                    className="data-[state=checked]:bg-[#d80073]"
                  />
                </div>

                {/* Push Notifications */}
                <div className="flex items-center justify-between group">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                      <Smartphone size={20} />
                    </div>
                    <div>
                      <h4 className="font-black text-gray-900 uppercase text-xs tracking-widest">Push Notifications</h4>
                      <p className="text-sm text-gray-500 font-medium">Critical price movements on your mobile device.</p>
                    </div>
                  </div>
                  <Switch 
                    checked={notifications.push} 
                    onCheckedChange={(v) => setNotifications({...notifications, push: v})} 
                    className="data-[state=checked]:bg-[#d80073]"
                  />
                </div>

                {/* Marketing */}
                <div className="flex items-center justify-between group">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">
                      <Zap size={20} />
                    </div>
                    <div>
                      <h4 className="font-black text-gray-900 uppercase text-xs tracking-widest">Platform Updates</h4>
                      <p className="text-sm text-gray-500 font-medium">New features, assets, and strategic tips.</p>
                    </div>
                  </div>
                  <Switch 
                    checked={notifications.marketing} 
                    onCheckedChange={(v) => setNotifications({...notifications, marketing: v})} 
                    className="data-[state=checked]:bg-[#d80073]"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Security Tab ── */}
        <TabsContent value="security" className="space-y-6 outline-none">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-none shadow-sm bg-white rounded-[32px] overflow-hidden">
              <CardHeader className="p-8 pb-4">
                <CardTitle className="text-2xl font-black text-gray-900">Security Layer</CardTitle>
                <CardDescription className="font-medium">Protect your session and sensitive actions.</CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                      <Smartphone size={20} />
                    </div>
                    <div>
                      <h4 className="font-black text-gray-900 uppercase text-xs tracking-widest">Biometric Auth</h4>
                      <p className="text-sm text-gray-500 font-medium">Use FaceID/Fingerprint for tx signing.</p>
                    </div>
                  </div>
                  <Switch defaultChecked className="data-[state=checked]:bg-[#d80073]" />
                </div>

                <div className="flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                      <Lock size={20} />
                    </div>
                    <div>
                      <h4 className="font-black text-gray-900 uppercase text-xs tracking-widest">Transaction Guard</h4>
                      <p className="text-sm text-gray-500 font-medium">Confirm every hedge with MFA.</p>
                    </div>
                  </div>
                  <Switch className="data-[state=checked]:bg-[#d80073]" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-white rounded-[32px] overflow-hidden">
              <CardHeader className="p-8 pb-4">
                <CardTitle className="text-2xl font-black text-gray-900">Active Sessions</CardTitle>
                <CardDescription className="font-medium">Devices currently logged into your account.</CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="flex items-center gap-3">
                    <Smartphone size={20} className="text-gray-400" />
                    <div>
                      <div className="font-bold text-sm text-gray-900">iPhone 15 Pro</div>
                      <div className="text-[10px] text-gray-500 uppercase tracking-widest font-black">Nairobi, Kenya • Current</div>
                    </div>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-gray-100 opacity-60">
                  <div className="flex items-center gap-3">
                    <Globe size={20} className="text-gray-400" />
                    <div>
                      <div className="font-bold text-sm text-gray-900">MacBook Pro M2</div>
                      <div className="text-[10px] text-gray-500 uppercase tracking-widest font-black">Mombasa, Kenya • 2 days ago</div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-rose-500 hover:text-rose-600 hover:bg-rose-50 font-bold text-[10px] uppercase tracking-widest">Revoke</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ── Advanced Tab ── */}
        <TabsContent value="advanced" className="space-y-6 outline-none">
          <Card className="border-none shadow-sm bg-white rounded-[32px] overflow-hidden">
            <CardHeader className="p-8 pb-4">
              <CardTitle className="text-2xl font-black text-gray-900 flex items-center gap-3">
                <Brain className="text-[#d80073]" /> AI Strategy Configuration
              </CardTitle>
              <CardDescription className="font-medium">Fine-tune how the MicroHedger AI assists your decisions.</CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-10">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-xs font-black uppercase tracking-widest text-gray-400">Confidence Threshold</Label>
                    <p className="text-sm text-gray-500 font-medium">Only show strategies with confidence higher than {aiPreferences.confidenceThreshold}%.</p>
                  </div>
                  <div className="w-32">
                    <Select value={aiPreferences.confidenceThreshold} onValueChange={(v) => setAiPreferences({...aiPreferences, confidenceThreshold: v})}>
                      <SelectTrigger className="rounded-xl border-gray-100 bg-gray-50 font-black">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-gray-100 shadow-xl">
                        <SelectItem value="75" className="font-bold">75%+</SelectItem>
                        <SelectItem value="80" className="font-bold">80%+</SelectItem>
                        <SelectItem value="85" className="font-bold">85%+</SelectItem>
                        <SelectItem value="90" className="font-bold">90%+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center justify-between group">
                  <div className="space-y-0.5">
                    <Label className="text-xs font-black uppercase tracking-widest text-gray-400">Auto-Analyze Markets</Label>
                    <p className="text-sm text-gray-500 font-medium">Continuously scan Injective markets for hedging opportunities.</p>
                  </div>
                  <Switch 
                    checked={aiPreferences.autoAnalyze} 
                    onCheckedChange={(v) => setAiPreferences({...aiPreferences, autoAnalyze: v})}
                    className="data-[state=checked]:bg-[#d80073]" 
                  />
                </div>

                <div className="flex items-center justify-between group pt-6 border-t border-gray-100">
                  <div className="space-y-0.5">
                    <Label className="text-xs font-black uppercase tracking-widest text-gray-400">Gas Strategy</Label>
                    <p className="text-sm text-gray-500 font-medium">Optimize for speed or cost when executing hedges.</p>
                  </div>
                  <div className="w-48 flex bg-gray-100 p-1 rounded-xl">
                    {["Economy", "Balanced", "Instant"].map((strat) => (
                      <button 
                        key={strat}
                        className={`flex-1 py-2 text-[10px] font-black uppercase tracking-tighter rounded-lg transition-all ${
                          strat === "Balanced" ? "bg-white text-[#d80073] shadow-sm" : "text-gray-400 hover:text-gray-600"
                        }`}
                      >
                        {strat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between group pt-6 border-t border-gray-100">
                  <div className="space-y-0.5">
                    <Label className="text-xs font-black uppercase tracking-widest text-gray-400">Default Payout Asset</Label>
                    <p className="text-sm text-gray-500 font-medium">Primary stablecoin for settlement payouts.</p>
                  </div>
                  <div className="w-32">
                    <Select defaultValue="USDT">
                      <SelectTrigger className="rounded-xl border-gray-100 bg-gray-50 font-black">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-gray-100 shadow-xl">
                        <SelectItem value="USDT" className="font-bold">USDT (inEVM)</SelectItem>
                        <SelectItem value="USDC" className="font-bold">USDC (inEVM)</SelectItem>
                        <SelectItem value="INJ" className="font-bold">INJ (Native)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100">
                <div className="bg-[#fce4ec] rounded-[24px] p-6 flex items-start gap-4">
                  <Info className="text-[#d80073] shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h5 className="font-black text-[#d80073] text-xs uppercase tracking-widest">Developer Mode</h5>
                    <p className="text-[#d80073] text-sm font-medium leading-relaxed opacity-80">
                      Enabling developer mode allows you to see raw protocol data, custom RPC endpoints, and advanced gas configuration. Use with caution.
                    </p>
                    <Button variant="link" className="p-0 h-auto text-[#d80073] font-black text-xs uppercase tracking-widest mt-2">Enable Debug Mode</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Footer Info */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-10 border-t border-gray-100 text-gray-400">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-[10px] font-black uppercase tracking-widest">Protocol Version 2.4.0-Stable</span>
        </div>
        <div className="flex items-center gap-6">
          <a href="#" className="text-[10px] font-black uppercase tracking-widest hover:text-[#d80073] transition-colors">Documentation</a>
          <a href="#" className="text-[10px] font-black uppercase tracking-widest hover:text-[#d80073] transition-colors">Privacy Policy</a>
          <a href="#" className="text-[10px] font-black uppercase tracking-widest hover:text-[#d80073] transition-colors">Terms of Service</a>
        </div>
      </div>
    </div>
  );
}
