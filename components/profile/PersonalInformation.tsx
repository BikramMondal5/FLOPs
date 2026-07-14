"use client";

import { useState } from "react";
import { User, Mail, Phone, Calendar, Map, Briefcase, DollarSign, Languages, Sparkles } from "lucide-react";

export default function PersonalInformation() {
  const [formData, setFormData] = useState({
    fullName: "Bikram Mondal",
    email: "bikram.mondal@flops.io",
    phone: "+91 98765 43210",
    dob: "1998-04-20",
    country: "India",
    city: "Kolkata",
    occupation: "Software Architect",
    currency: "INR (₹)",
    language: "English",
  });

  const handleSave = () => {
    alert("Profile changes saved successfully!");
  };

  const handleCancel = () => {
    alert("Resetting fields...");
  };

  return (
    <div className="p-6 bg-white border border-[#F6B7CF]/15 rounded-[24px] shadow-[0_12px_40px_rgba(0,0,0,0.03)] flex flex-col justify-between">
      <div className="flex justify-between items-center mb-5 shrink-0">
        <div>
          <h3 className="text-base font-semibold text-[#18181B] m-0">Personal Information</h3>
          <p className="text-[11px] text-[#6B7280] mt-0.5 m-0">Manage your identity and residency configurations</p>
        </div>
        <User className="w-4.5 h-4.5 text-[#D46A96]" />
      </div>

      {/* Editable Fields layout */}
      <div className="flex flex-col gap-4 flex-grow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">Full Name</label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="text-xs text-[#18181B] bg-white border border-[#F6B7CF]/15 rounded-xl px-3.5 py-3 outline-none focus:border-[#F6B7CF]/40 transition-colors"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">Email Address</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="text-xs text-[#18181B] bg-white border border-[#F6B7CF]/15 rounded-xl px-3.5 py-3 outline-none focus:border-[#F6B7CF]/40 transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">Phone Number</label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="text-xs text-[#18181B] bg-white border border-[#F6B7CF]/15 rounded-xl px-3.5 py-3 outline-none focus:border-[#F6B7CF]/40 transition-colors"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">Date of Birth</label>
            <input
              type="date"
              value={formData.dob}
              onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
              className="text-xs text-[#18181B] bg-white border border-[#F6B7CF]/15 rounded-xl px-3.5 py-3 outline-none focus:border-[#F6B7CF]/40 transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">Country</label>
            <input
              type="text"
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              className="text-xs text-[#18181B] bg-white border border-[#F6B7CF]/15 rounded-xl px-3.5 py-3 outline-none focus:border-[#F6B7CF]/40 transition-colors"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">City</label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className="text-xs text-[#18181B] bg-white border border-[#F6B7CF]/15 rounded-xl px-3.5 py-3 outline-none focus:border-[#F6B7CF]/40 transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">Occupation</label>
            <input
              type="text"
              value={formData.occupation}
              onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
              className="text-xs text-[#18181B] bg-white border border-[#F6B7CF]/15 rounded-xl px-3.5 py-3 outline-none focus:border-[#F6B7CF]/40 transition-colors"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">Preferred Currency</label>
            <input
              type="text"
              value={formData.currency}
              onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
              className="text-xs text-[#18181B] bg-white border border-[#F6B7CF]/15 rounded-xl px-3.5 py-3 outline-none focus:border-[#F6B7CF]/40 transition-colors"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">Language</label>
            <input
              type="text"
              value={formData.language}
              onChange={(e) => setFormData({ ...formData, language: e.target.value })}
              className="text-xs text-[#18181B] bg-white border border-[#F6B7CF]/15 rounded-xl px-3.5 py-3 outline-none focus:border-[#F6B7CF]/40 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Button layout */}
      <div className="flex justify-end gap-2.5 mt-5 border-t border-zinc-100 pt-4 shrink-0">
        <button
          onClick={handleCancel}
          className="text-xs font-semibold py-2.5 px-4 border border-[#F6B7CF]/30 text-[#D46A96] hover:bg-[#FFF4F8] rounded-full transition-colors cursor-pointer"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="text-xs font-semibold py-2.5 px-5 bg-[#18181B] text-white hover:bg-zinc-800 rounded-full transition-colors cursor-pointer"
        >
          Save Changes
        </button>
      </div>

    </div>
  );
}
