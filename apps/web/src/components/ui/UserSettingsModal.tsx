"use client";

import { X, User, Bell, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

export type ModalTab = "profile" | "notifications" | "settings";

interface UserSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: ModalTab;
  onTabChange: (tab: ModalTab) => void;
}

export function UserSettingsModal({ isOpen, onClose, activeTab, onTabChange }: UserSettingsModalProps) {
  // Local state for UI prototyping
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [compactView, setCompactView] = useState(false);
  const [autoRun, setAutoRun] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-4xl h-[80vh] min-h-[600px] bg-[#0d0f14] border border-white/10 rounded-2xl shadow-2xl flex overflow-hidden animate-in fade-in zoom-in duration-200">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-white/50 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Sidebar Navigation */}
        <div className="w-64 bg-[#0a0c10] border-r border-white/5 p-6 flex flex-col">
          <h2 className="text-sm font-black text-emerald-400 tracking-widest uppercase mb-8">Preferences</h2>

          <nav className="flex flex-col gap-2">
            <TabButton
              icon={User}
              label="Profile"
              isActive={activeTab === 'profile'}
              onClick={() => onTabChange('profile')}
            />
            <TabButton
              icon={Bell}
              label="Notifications"
              isActive={activeTab === 'notifications'}
              onClick={() => onTabChange('notifications')}
            />
            <TabButton
              icon={Settings}
              label="Settings"
              isActive={activeTab === 'settings'}
              onClick={() => onTabChange('settings')}
            />
          </nav>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-8 overflow-y-auto bg-gradient-to-br from-[#0d0f14] to-[#12141a]">
          {activeTab === 'profile' && (
            <div className="flex flex-col gap-8 animate-fade-in pb-8">
              <div>
                <h3 className="text-xl font-black text-white mb-2">Profile</h3>
                <p className="text-sm text-white/50">Manage your public profile and connected accounts.</p>
              </div>

              <div className="flex items-start gap-8">
                {/* Avatar Section */}
                <div className="flex flex-col items-center gap-4">
                  <div className="relative w-24 h-24 rounded-full bg-[#12141a] border border-white/10 flex items-center justify-center overflow-hidden group cursor-pointer hover:border-emerald-500/50 transition-colors">
                    <User className="w-10 h-10 text-white/20 group-hover:scale-110 transition-transform" />
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-[10px] font-bold text-white uppercase tracking-widest">Upload</span>
                    </div>
                  </div>
                  <button className="text-[10px] font-bold text-white/50 hover:text-rose-400 uppercase tracking-widest transition-colors">
                    Remove
                  </button>
                </div>

                {/* Form Fields */}
                <div className="flex-1 flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Username</label>
                    <input type="text" defaultValue="saturnsurfer" className="bg-[#12141a] border border-white/10 rounded-lg px-4 py-2.5 text-sm font-medium text-white focus:outline-none focus:border-emerald-500/50 transition-colors" />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Email Address</label>
                    <input type="email" defaultValue="hello@tacticlab.app" className="bg-[#12141a] border border-white/10 rounded-lg px-4 py-2.5 text-sm font-medium text-white focus:outline-none focus:border-emerald-500/50 transition-colors" />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Bio</label>
                    <textarea rows={3} placeholder="Tell the community about your tactical philosophy..." className="bg-[#12141a] border border-white/10 rounded-lg px-4 py-2.5 text-sm font-medium text-white focus:outline-none focus:border-emerald-500/50 transition-colors resize-none"></textarea>
                  </div>
                </div>
              </div>



              {/* Save Button */}
              <div className="flex justify-end pt-4">
                <button className="px-6 py-2.5 rounded-lg bg-emerald-500 text-[#0a0c10] text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-400 transition-colors">
                  Save Profile
                </button>
              </div>
            </div>
          )}
          {activeTab === 'notifications' && (
            <div className="flex flex-col gap-8 animate-fade-in pb-8">
              <div>
                <h3 className="text-xl font-black text-white mb-2">Notifications</h3>
                <p className="text-sm text-white/50">Activity feed and notification preferences.</p>
              </div>

              {/* Preferences */}
              <div className="flex flex-col gap-4">
                <h4 className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Preferences</h4>

                <div className="bg-[#12141a] border border-white/5 rounded-xl overflow-hidden">
                  <div className="flex items-center justify-between p-4 border-b border-white/5">
                    <div>
                      <h5 className="text-sm font-bold text-white mb-0.5">Tactical Analysis Alerts</h5>
                      <p className="text-[10px] text-white/40">Get notified when AI finishes analyzing your tactic.</p>
                    </div>
                    <div className="w-10 h-5 rounded-full bg-emerald-500 relative cursor-pointer transition-colors">
                      <div className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-[#0a0c10] shadow transition-transform" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border-b border-white/5">
                    <div>
                      <h5 className="text-sm font-bold text-white mb-0.5">Community Comments</h5>
                      <p className="text-[10px] text-white/40">Receive updates when someone comments on your published tactics.</p>
                    </div>
                    <div className="w-10 h-5 rounded-full bg-white/10 relative cursor-pointer transition-colors">
                      <div className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white/50 shadow transition-transform" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4">
                    <div>
                      <h5 className="text-sm font-bold text-white mb-0.5">System Updates</h5>
                      <p className="text-[10px] text-white/40">News about new engine versions and features.</p>
                    </div>
                    <div className="w-10 h-5 rounded-full bg-emerald-500 relative cursor-pointer transition-colors">
                      <div className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-[#0a0c10] shadow transition-transform" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Activity Feed */}
              <div className="flex flex-col gap-4 pt-4 border-t border-white/5">
                <h4 className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Recent Activity</h4>

                <div className="flex flex-col gap-3">
                  <div className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/10 flex gap-4 items-start">
                    <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0">
                      <Bell className="w-4 h-4 text-indigo-400" />
                    </div>
                    <div>
                      <p className="text-sm text-white font-medium leading-relaxed">
                        <span className="font-bold">v2.1 Kinetic Engine</span> is now live! Check out the new pitch visualizations.
                      </p>
                      <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mt-2 block">2 hours ago</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex gap-4 items-start opacity-70">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                      <Settings className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-sm text-white font-medium leading-relaxed">
                        Your tactic <span className="font-bold text-emerald-400">Gegenpress 4-2-3-1</span> was successfully exported.
                      </p>
                      <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-2 block">Yesterday</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex gap-4 items-start opacity-70">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                      <User className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-sm text-white font-medium leading-relaxed">
                        Welcome to TacticLab! Your profile has been created.
                      </p>
                      <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-2 block">3 days ago</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}
          {activeTab === 'settings' && (
            <div className="flex flex-col gap-8 animate-fade-in pb-8">
              <div>
                <h3 className="text-xl font-black text-white mb-2">Settings</h3>
                <p className="text-sm text-white/50">App behavior and UI preferences.</p>
              </div>

              {/* Appearance */}
              <div className="flex flex-col gap-4">
                <h4 className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Appearance</h4>

                <div className="bg-[#12141a] border border-white/5 rounded-xl overflow-hidden p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="text-sm font-bold text-white mb-0.5">Theme</h5>
                      <p className="text-[10px] text-white/40">Switch between light and dark mode.</p>
                    </div>

                    {/* Theme Switch */}
                    <div className="flex items-center bg-[#0a0c10] border border-white/5 rounded-lg p-1">
                      <button
                        onClick={() => setTheme('dark')}
                        className={cn("px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-widest transition-all", theme === 'dark' ? "bg-[#1a1d25] text-white shadow-sm" : "text-muted-foreground hover:text-white")}
                      >
                        Dark
                      </button>
                      <button
                        onClick={() => setTheme('light')}
                        className={cn("px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-widest transition-all", theme === 'light' ? "bg-white text-black shadow-sm" : "text-muted-foreground hover:text-white")}
                      >
                        Light
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-[#12141a] border border-white/5 rounded-xl overflow-hidden p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="text-sm font-bold text-white mb-0.5">Compact View</h5>
                      <p className="text-[10px] text-white/40">Reduce padding to fit more information on screen.</p>
                    </div>
                    <div onClick={() => setCompactView(!compactView)} className={cn("w-10 h-5 rounded-full relative cursor-pointer transition-colors", compactView ? "bg-emerald-500" : "bg-white/10")}>
                      <div className={cn("absolute top-0.5 w-4 h-4 rounded-full shadow transition-all", compactView ? "right-0.5 bg-[#0a0c10]" : "left-0.5 bg-white/50")} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Engine Preferences */}
              <div className="flex flex-col gap-4 pt-4 border-t border-white/5">
                <h4 className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Tactical Engine</h4>

                <div className="bg-[#12141a] border border-white/5 rounded-xl overflow-hidden p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="text-sm font-bold text-white mb-0.5">Auto-Run Analysis</h5>
                      <p className="text-[10px] text-white/40">Automatically recalculate tactical analysis when a player is moved or a role is changed.</p>
                    </div>
                    <div onClick={() => setAutoRun(!autoRun)} className={cn("w-10 h-5 rounded-full relative cursor-pointer transition-colors", autoRun ? "bg-emerald-500" : "bg-white/10")}>
                      <div className={cn("absolute top-0.5 w-4 h-4 rounded-full shadow transition-all", autoRun ? "right-0.5 bg-[#0a0c10]" : "left-0.5 bg-white/50")} />
                    </div>
                  </div>
                </div>

                <div className="bg-[#12141a] border border-white/5 rounded-xl overflow-hidden p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="text-sm font-bold text-white mb-0.5">Default Export Format</h5>
                      <p className="text-[10px] text-white/40">Choose the format used when clicking Export Tactic.</p>
                    </div>

                    <select className="bg-[#0a0c10] border border-white/10 rounded-lg px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white focus:outline-none focus:border-emerald-500/50">
                      <option>.JSON (TacticLab)</option>
                      <option>.FMF (Football Manager)</option>
                      <option>Image (PNG)</option>
                    </select>
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
}

function TabButton({ icon: Icon, label, isActive, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200",
        isActive
          ? "bg-emerald-500/10 text-emerald-400 font-bold"
          : "text-muted-foreground hover:bg-white/5 hover:text-white font-medium"
      )}
    >
      <Icon className={cn("w-4 h-4", isActive ? "text-emerald-400" : "opacity-70")} />
      <span className="text-xs uppercase tracking-widest">{label}</span>
    </button>
  );
}
