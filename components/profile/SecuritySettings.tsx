"use client";

import { ShieldAlert, Key, ToggleLeft, ToggleRight, Laptop, Smartphone } from "lucide-react";
import { useState } from "react";

export default function SecuritySettings() {
  const [tfa, setTfa] = useState(true);

  return (
    <div className="p-6 bg-white border border-[#F6B7CF]/15 rounded-[24px] shadow-[0_12px_40px_rgba(0,0,0,0.03)] flex flex-col justify-between">
      <div className="mb-5 shrink-0">
        <h3 className="text-base font-semibold text-[#18181B] m-0">Security Settings</h3>
        <p className="text-[11px] text-[#6B7280] mt-0.5 m-0">Secure your identity credentials and sync tokens</p>
      </div>

      <div className="flex-grow flex flex-col gap-4">
        {/* Verification metrics status */}
        <div className="flex justify-between items-center text-xs pb-3 border-b border-zinc-100">
          <span className="text-[#6B7280]">Email Verification Status</span>
          <span className="font-bold text-emerald-600">Verified</span>
        </div>
        <div className="flex justify-between items-center text-xs pb-3 border-b border-zinc-100">
          <span className="text-[#6B7280]">Phone Verification Status</span>
          <span className="font-bold text-emerald-600">Verified</span>
        </div>

        {/* 2FA toggler */}
        <div className="flex justify-between items-center text-xs pb-3 border-b border-zinc-100">
          <div>
            <span className="font-semibold text-zinc-700 block">Two-Factor Authentication (2FA)</span>
            <span className="text-[10px] text-zinc-400">Secure sweeps requiring verification codes</span>
          </div>
          <button onClick={() => setTfa(!tfa)} className="cursor-pointer">
            {tfa ? (
              <ToggleRight className="w-9 h-9 text-[#D46A96]" />
            ) : (
              <ToggleLeft className="w-9 h-9 text-zinc-300" />
            )}
          </button>
        </div>

        {/* Active devices log */}
        <div className="mt-2">
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide block mb-3">Active Device Sessions</span>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-500 shrink-0">
                <Laptop className="w-4.5 h-4.5" />
              </div>
              <div>
                <span className="text-[12px] font-semibold text-[#18181B] block">Windows 11 PC • Kolkata, India</span>
                <span className="text-[9.5px] text-[#6B7280]">Chrome Browser • Current session</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-500 shrink-0">
                <Smartphone className="w-4.5 h-4.5" />
              </div>
              <div>
                <span className="text-[12px] font-semibold text-[#18181B] block">Apple iPhone 15 Pro</span>
                <span className="text-[9.5px] text-[#6B7280]">FLOPs iOS App • Active 3 hours ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Security triggers */}
      <div className="flex justify-end gap-2 mt-5 pt-4 border-t border-zinc-100 shrink-0">
        <button
          onClick={() => alert("Password reset link sent to your email.")}
          className="text-xs font-semibold py-2.5 px-4 border border-[#F6B7CF]/30 text-[#D46A96] hover:bg-[#FFF4F8] rounded-full cursor-pointer"
        >
          Change Password
        </button>
        <button
          onClick={() => alert("2FA setup configuration generated (Mock).")}
          className="text-xs font-semibold py-2.5 px-4 bg-[#18181B] text-white hover:bg-zinc-800 rounded-full cursor-pointer"
        >
          Manage Devices
        </button>
      </div>

    </div>
  );
}
