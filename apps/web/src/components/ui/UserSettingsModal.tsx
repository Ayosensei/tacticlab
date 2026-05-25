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
            <div>
              <h3 className="text-xl font-black text-white mb-2">Profile</h3>
              <p className="text-sm text-white/50">Manage your public profile and connected accounts.</p>
              {/* Placeholder for Sub-task 2 */}
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
