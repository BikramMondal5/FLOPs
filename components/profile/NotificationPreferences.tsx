"use client";

import { Bell, ToggleLeft, ToggleRight } from "lucide-react";
import { useState } from "react";

export default function NotificationPreferences() {
  const [prefs, setPrefs] = useState({
    budgetAlerts: true,
    goalReminders: true,
    monthlyReports: true,
    aiRecommendations: false,
    securityAlerts: true,
  });

  const toggle = (key: keyof typeof prefs) => {
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="p-6 bg-white border border-[#F6B7CF]/15 rounded-[24px] shadow-[0_12px_40px_rgba(0,0,0,0.03)] h-full flex flex-col justify-between">
      <div className="mb-5 shrink-0">
        <h3 className="text-base font-semibold text-[#18181B] m-0">Notification Settings</h3>
        <p className="text-[11px] text-[#6B7280] mt-0.5 m-0">Configure alerts for sweep goals and summaries</p>
      </div>

      <div className="flex-grow flex flex-col gap-4">
        {/* Toggle budget alerts */}
        <div className="flex justify-between items-center text-xs pb-2 border-b border-zinc-50">
          <div>
            <span className="font-semibold text-zinc-700 block">Budget Threshold Alerts</span>
            <span className="text-[10px] text-zinc-400">Get notified when categories exceed 85% limits</span>
          </div>
          <button onClick={() => toggle("budgetAlerts")} className="cursor-pointer">
            {prefs.budgetAlerts ? <ToggleRight className="w-9 h-9 text-[#D46A96]" /> : <ToggleLeft className="w-9 h-9 text-zinc-300" />}
          </button>
        </div>

        {/* Toggle goal reminders */}
        <div className="flex justify-between items-center text-xs pb-2 border-b border-zinc-50">
          <div>
            <span className="font-semibold text-zinc-700 block">Goal Savings Reminders</span>
            <span className="text-[10px] text-zinc-400">Weekly targets progress timeline checkpoints</span>
          </div>
          <button onClick={() => toggle("goalReminders")} className="cursor-pointer">
            {prefs.goalReminders ? <ToggleRight className="w-9 h-9 text-[#D46A96]" /> : <ToggleLeft className="w-9 h-9 text-zinc-300" />}
          </button>
        </div>

        {/* Toggle monthly reports */}
        <div className="flex justify-between items-center text-xs pb-2 border-b border-zinc-50">
          <div>
            <span className="font-semibold text-zinc-700 block">Monthly Financial Reports</span>
            <span className="text-[10px] text-zinc-400">Receive detailed PDF digest on month-end close</span>
          </div>
          <button onClick={() => toggle("monthlyReports")} className="cursor-pointer">
            {prefs.monthlyReports ? <ToggleRight className="w-9 h-9 text-[#D46A96]" /> : <ToggleLeft className="w-9 h-9 text-zinc-300" />}
          </button>
        </div>

        {/* Toggle AI Recommendations */}
        <div className="flex justify-between items-center text-xs pb-2 border-b border-zinc-50">
          <div>
            <span className="font-semibold text-zinc-700 block">AI Intelligence Prompts</span>
            <span className="text-[10px] text-zinc-400">Notify me about subscription leaks instantly</span>
          </div>
          <button onClick={() => toggle("aiRecommendations")} className="cursor-pointer">
            {prefs.aiRecommendations ? <ToggleRight className="w-9 h-9 text-[#D46A96]" /> : <ToggleLeft className="w-9 h-9 text-zinc-300" />}
          </button>
        </div>

        {/* Toggle security alerts */}
        <div className="flex justify-between items-center text-xs">
          <div>
            <span className="font-semibold text-zinc-700 block">Security Log Alerts</span>
            <span className="text-[10px] text-zinc-400">Notify on active device logins and 2FA sweeps</span>
          </div>
          <button onClick={() => toggle("securityAlerts")} className="cursor-pointer">
            {prefs.securityAlerts ? <ToggleRight className="w-9 h-9 text-[#D46A96]" /> : <ToggleLeft className="w-9 h-9 text-zinc-300" />}
          </button>
        </div>
      </div>
    </div>
  );
}
