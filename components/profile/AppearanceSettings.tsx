"use client";

import { Paintbrush } from "lucide-react";
import { useState } from "react";

export default function AppearanceSettings() {
  const [theme, setTheme] = useState<"Light" | "Dark" | "System">("Light");
  const [accent, setAccent] = useState("Default Pink");

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
            {["Light", "Dark (Soon)", "System"].map((t) => {
              const active = t === "Light" && theme === "Light";
              return (
                <button
                  key={t}
                  disabled={t.includes("Soon")}
                  onClick={() => setTheme("Light")}
                  className={`flex-grow text-[11px] font-semibold py-2 rounded-lg transition-all cursor-pointer ${
                    active ? "bg-[#D46A96] text-white shadow-sm" : "text-[#6B7280] hover:text-[#18181B] opacity-80"
                  }`}
                >
                  {t}
                </button>
              );
            })}
          </div>
        </div>

        {/* Accent Color picker */}
        <div className="flex flex-col gap-1.5 mt-1">
          <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">Brand Accent Scheme</label>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setAccent("Default Pink")}
              className={`flex-1 text-[11px] font-semibold py-2.5 px-3 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                accent === "Default Pink"
                  ? "border-[#F6B7CF] bg-[#FFF4F8] text-[#D46A96]"
                  : "border-zinc-200 bg-white text-zinc-600"
              }`}
            >
              <span>Default Pink</span>
              <span className="w-3.5 h-3.5 rounded-full bg-[#F6B7CF] border border-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
