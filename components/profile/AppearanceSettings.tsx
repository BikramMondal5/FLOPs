"use client";

import { Paintbrush } from "lucide-react";
import { useState, useEffect } from "react";
import type { FullProfileDTO } from "@/features/profile/dto/profile.dto";

interface AppearanceSettingsProps {
  profile: FullProfileDTO;
  onUpdate: (updates: any) => Promise<void>;
}

export default function AppearanceSettings({ profile, onUpdate }: AppearanceSettingsProps) {
  const { preferences } = profile;
  const [theme, setTheme] = useState(preferences.appearance.theme);
  const [accent, setAccent] = useState(preferences.appearance.accentColor);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    setTheme(preferences.appearance.theme);
    setAccent(preferences.appearance.accentColor);
  }, [preferences.appearance]);

  const handleThemeChange = async (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme);
    setIsUpdating(true);
    try {
      await onUpdate({
        appearance: {
          theme: newTheme,
          accentColor: accent,
        },
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="p-6 bg-white border border-[#F6B7CF]/15 rounded-[24px] shadow-[0_12px_40px_rgba(0,0,0,0.03)] h-full flex flex-col justify-between">
      <div className="mb-5 shrink-0">
        <h3 className="text-base font-semibold text-[#18181B] m-0">Theme & Appearance</h3>
        <p className="text-[11px] text-[#6B7280] mt-0.5 m-0">Configure dashboard layout variables</p>
      </div>

      <div className="flex-grow flex flex-col gap-4">
        {/* Theme presets switcher */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">Interface Theme Mode</label>
          <div className="flex gap-1 bg-[#FFF4F8] p-1 rounded-xl border border-[#F6B7CF]/10">
            <button
              onClick={() => handleThemeChange("light")}
              disabled={isUpdating}
              className={`flex-grow text-[11px] font-semibold py-2 rounded-lg transition-all cursor-pointer ${
                theme === "light" ? "bg-[#D46A96] text-white shadow-sm" : "text-[#6B7280] hover:text-[#18181B]"
              }`}
            >
              Light
            </button>
            <button
              disabled
              className="flex-grow text-[11px] font-semibold py-2 rounded-lg transition-all cursor-not-allowed text-[#6B7280] opacity-50"
            >
              Dark (Soon)
            </button>
            <button
              onClick={() => handleThemeChange("system")}
              disabled={isUpdating}
              className={`flex-grow text-[11px] font-semibold py-2 rounded-lg transition-all cursor-pointer ${
                theme === "system" ? "bg-[#D46A96] text-white shadow-sm" : "text-[#6B7280] hover:text-[#18181B]"
              }`}
            >
              System
            </button>
          </div>
        </div>

        {/* Accent Color picker */}
        <div className="flex flex-col gap-1.5 mt-1">
          <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">Brand Accent Scheme</label>
          <div className="flex items-center gap-2">
            <div className="flex-1 text-[11px] font-semibold py-2.5 px-3 rounded-xl border border-[#F6B7CF] bg-[#FFF4F8] text-[#D46A96] flex items-center justify-between">
              <span>Default Pink</span>
              <span className="w-3.5 h-3.5 rounded-full bg-[#F6B7CF] border border-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
