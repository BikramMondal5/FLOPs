"use client";

import { ShieldAlert, ChevronRight, ToggleLeft, ToggleRight } from "lucide-react";
import { useState, useEffect } from "react";
import type { FullProfileDTO } from "@/features/profile/dto/profile.dto";

interface PrivacySettingsProps {
  profile: FullProfileDTO;
  onUpdate: (updates: any) => Promise<void>;
}

export default function PrivacySettings({ profile, onUpdate }: PrivacySettingsProps) {
  const { preferences } = profile;
  const [analyticsEnabled, setAnalyticsEnabled] = useState(preferences.privacy.analyticsEnabled);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    setAnalyticsEnabled(preferences.privacy.analyticsEnabled);
  }, [preferences.privacy.analyticsEnabled]);

  const toggleAnalytics = async () => {
    const newValue = !analyticsEnabled;
    setAnalyticsEnabled(newValue);
    
    setIsUpdating(true);
    try {
      await onUpdate({
        privacy: {
          analyticsEnabled: newValue,
        },
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleExportData = () => {
    alert("Your data export will be generated and sent to your email.");
  };

  const handleDeleteAccount = () => {
    const confirmed = confirm(
      "⚠️ WARNING: This action is permanent and cannot be undone.\n\nAre you absolutely sure you want to delete your account? All your data, transactions, goals, and preferences will be permanently removed."
    );
    if (confirmed) {
      const doubleConfirm = confirm("This is your final confirmation. Type 'DELETE' to proceed.\n\nClick OK to continue with account deletion.");
      if (doubleConfirm) {
        alert("Account deletion initiated. You will receive a confirmation email shortly.");
      }
    }
  };

  return (
    <div className="p-6 bg-white border border-[#F6B7CF]/15 rounded-[24px] shadow-[0_12px_40px_rgba(0,0,0,0.03)] h-full flex flex-col justify-between">
      <div className="mb-5 shrink-0">
        <h3 className="text-base font-semibold text-[#18181B] m-0">Privacy & Audits</h3>
        <p className="text-[11px] text-[#6B7280] mt-0.5 m-0">Download sync profiles or remove accounts</p>
      </div>

      <div className="flex-grow flex flex-col gap-3">
        {/* Toggle analytics sharing */}
        <div className="flex justify-between items-center text-xs pb-3 border-b border-zinc-100">
          <div>
            <span className="font-semibold text-zinc-700 block">Share Anonymous Analytics</span>
            <span className="text-[10px] text-zinc-400">Help improve sweep optimization models</span>
          </div>
          <button onClick={toggleAnalytics} className="cursor-pointer" disabled={isUpdating}>
            {analyticsEnabled ? <ToggleRight className="w-9 h-9 text-[#D46A96]" /> : <ToggleLeft className="w-9 h-9 text-zinc-300" />}
          </button>
        </div>

        {/* Action triggers */}
        <button
          onClick={handleExportData}
          className="w-full flex items-center justify-between p-3.5 bg-zinc-50/50 border border-zinc-100 hover:border-[#F6B7CF]/20 rounded-xl transition-all text-left cursor-pointer"
        >
          <div>
            <span className="text-[12.5px] font-semibold text-[#18181B] block">Download My Data</span>
            <span className="text-[9.5px] text-[#6B7280]">Export accounts JSON log data structure</span>
          </div>
          <ChevronRight className="w-4 h-4 text-zinc-400" />
        </button>

        <button
          onClick={handleDeleteAccount}
          className="w-full flex items-center justify-between p-3.5 bg-rose-50/50 border border-rose-100 hover:border-rose-200 rounded-xl transition-all text-left cursor-pointer"
        >
          <div>
            <span className="text-[12.5px] font-bold text-rose-600 block">Delete Account</span>
            <span className="text-[9.5px] text-rose-400">Permanently erase your identity files</span>
          </div>
          <ChevronRight className="w-4 h-4 text-rose-400" />
        </button>
      </div>
    </div>
  );
}
