"use client";

import { motion } from "framer-motion";
import { Camera, CheckCircle2, ShieldAlert, Sparkles, MapPin, Globe } from "lucide-react";
import { useState } from "react";

export default function ProfileHero() {
  const [avatar, setAvatar] = useState("/avatar.png");

  const handleUpload = () => {
    alert("Select Image file dialog triggered (Mock).");
  };

  return (
    <div className="p-6 bg-white border border-[#F6B7CF]/15 rounded-[24px] shadow-[0_12px_40px_rgba(0,0,0,0.03)] flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden w-full">
      {/* Background Glow */}
      <div className="absolute top-[-50px] left-[-50px] w-40 h-40 rounded-full bg-[#F6B7CF]/5 blur-2xl pointer-events-none" />

      {/* Profile photo upload & credentials details */}
      <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left z-10">
        
        {/* Avatar block */}
        <div className="relative group shrink-0">
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="w-[100px] h-[100px] rounded-full overflow-hidden border-2 border-[#F6B7CF]/30 bg-[#FFF4F8] flex items-center justify-center text-4xl shadow-sm cursor-pointer"
            onClick={handleUpload}
          >
            👤
          </motion.div>
          <button
            onClick={handleUpload}
            className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#18181B] border border-white flex items-center justify-center text-white hover:bg-zinc-800 transition-colors shadow-md cursor-pointer"
          >
            <Camera className="w-4 h-4" />
          </button>
        </div>

        {/* Credentials */}
        <div className="flex flex-col gap-1.5">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h2 className="text-xl font-bold text-[#18181B] m-0 leading-none">Bikram Mondal</h2>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FFF4F8] text-[#D46A96] border border-[#F6B7CF]/20 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-[#D46A96]" />
              <span>Verified Account</span>
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-500" />
              <span>Health Score: 92</span>
            </span>
          </div>

          <span className="text-xs text-zinc-500 leading-none mt-0.5 block">bikram.mondal@flops.io</span>
          
          <div className="flex flex-wrap justify-center sm:justify-start items-center gap-3 text-xs text-[#6B7280] font-medium mt-1">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-zinc-400" />
              <span>Kolkata, India</span>
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#F6B7CF]/40" />
            <span className="flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-zinc-400" />
              <span>GMT +5:30</span>
            </span>
          </div>
        </div>

      </div>

      {/* Join stamp metadata */}
      <div className="text-center sm:text-right shrink-0 border-t md:border-t-0 md:border-l border-[#F6B7CF]/10 pt-4 md:pt-0 md:pl-6 z-10 w-full md:w-auto">
        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Membership</span>
        <div className="text-base font-bold text-[#18181B] mt-1">Joined January 2026</div>
        <span className="text-[10px] text-[#6B7280] block mt-0.5">Active Premium Subscriber</span>
      </div>

    </div>
  );
}
