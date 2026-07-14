"use client";

import { motion } from "framer-motion";
import { Copy } from "lucide-react";

interface Template {
  name: string;
  desc: string;
  icon: string;
  total: number;
}

interface BudgetTemplatesProps {
  onApply: (total: number) => void;
}

export default function BudgetTemplates({ onApply }: BudgetTemplatesProps) {
  const templates: Template[] = [
    { name: "Student Budget", desc: "For textbook supplies and daily hostel living.", icon: "🎓", total: 15000 },
    { name: "Family Budget", desc: "For home provisions, children bills and assets.", icon: "🏡", total: 120000 },
    { name: "Minimalist Plan", desc: "Calm framework focusing on base essentials.", icon: "🧘", total: 45000 },
    { name: "Travel Budget", desc: "For flight logs, transit and luggage specs.", icon: "✈️", total: 95000 },
  ];

  return (
    <div className="p-6 bg-white border border-[#F6B7CF]/15 rounded-[24px] shadow-[0_12px_40px_rgba(0,0,0,0.03)] flex flex-col justify-between relative overflow-hidden h-full">
      <div className="mb-5">
        <h3 className="text-base font-semibold text-[#18181B] m-0">Quick Budget Templates</h3>
        <p className="text-[11px] text-[#6B7280] mt-0.5 m-0">Pre-built frameworks matching your lifestyle</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {templates.map((temp) => (
          <div
            key={temp.name}
            className="p-4 bg-zinc-50/50 border border-[#F6B7CF]/8 rounded-[20px] hover:border-[#F6B7CF]/20 transition-all duration-300 flex flex-col justify-between gap-3 group"
          >
            <div className="flex gap-2.5 items-start">
              <span className="text-xl leading-none">{temp.icon}</span>
              <div>
                <h4 className="text-[12px] font-bold text-[#18181B] m-0 leading-normal">{temp.name}</h4>
                <p className="text-[10px] text-[#6B7280] mt-0.5 m-0 leading-normal">{temp.desc}</p>
              </div>
            </div>

            <div className="flex justify-between items-center mt-1 pt-2 border-t border-zinc-100">
              <span className="text-[11px] font-bold text-zinc-700">₹{temp.total.toLocaleString()}</span>
              <button
                onClick={() => onApply(temp.total)}
                className="text-[9px] font-bold py-1 px-2.5 bg-white border border-[#F6B7CF]/30 text-[#D46A96] hover:bg-[#FFF4F8] rounded-full flex items-center gap-1 transition-all cursor-pointer"
              >
                <Copy className="w-2.5 h-2.5" />
                <span>Apply Plan</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
