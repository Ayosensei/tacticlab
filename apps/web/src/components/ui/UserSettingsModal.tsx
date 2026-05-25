"use client";

import { X, User, Bell, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

export type ModalTab = "profile" | "notifications" | "settings";

interface UserSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: ModalTab;
  onTabChange: (tab: ModalTab) => void;
}

export function UserSettingsModal({ isOpen, onClose, activeTab, onTabChange }: UserSettingsModalProps) {
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

              {/* Integrations */}
              <div className="pt-6 border-t border-white/5">
                <h4 className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-4">Connections</h4>
                
                <div className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-[#12141a]">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded bg-[#171a21] border border-white/10 flex items-center justify-center">
                      <div className="w-4 h-4 rounded-full border-2 border-white/50 relative">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-white/50 rounded-full" />
                      </div>
                    </div>
                    <div>
                      <h5 className="text-sm font-bold text-white">Steam / Football Manager</h5>
                      <p className="text-xs text-white/40">Connect to seamlessly import tactics directly from the game.</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 rounded-lg bg-indigo-500/10 text-indigo-400 text-[10px] font-bold uppercase tracking-widest hover:bg-indigo-500/20 transition-colors">
                    Connect
                  </button>
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
            <div>
              <h3 className="text-xl font-black text-white mb-2">Notifications</h3>
              <p className="text-sm text-white/50">Activity feed and notification preferences.</p>
              {/* Placeholder for Sub-task 3 */}
            </div>
          )}
          {activeTab === 'settings' && (
            <div>
              <h3 className="text-xl font-black text-white mb-2">Settings</h3>
              <p className="text-sm text-white/50">App behavior and UI preferences.</p>
              {/* Placeholder for Sub-task 4 */}
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
