"use client";

import { Search, Calendar, Tag, Landmark, ArrowUpDown, RotateCcw } from "lucide-react";

interface FilterToolbarProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  dateRange: string;
  setDateRange: (val: string) => void;
  category: string;
  setCategory: (val: string) => void;
  account: string;
  setAccount: (val: string) => void;
  sortBy: string;
  setSortBy: (val: string) => void;
  onClearFilters: () => void;
}

export default function FilterToolbar({
  searchQuery,
  setSearchQuery,
  dateRange,
  setDateRange,
  category,
  setCategory,
  account,
  setAccount,
  sortBy,
  setSortBy,
  onClearFilters,
}: FilterToolbarProps) {
  return (
    <div className="p-4 bg-white/70 backdrop-blur-md border border-[#F6B7CF]/15 rounded-[24px] shadow-[0_12px_40px_rgba(0,0,0,0.03)] flex flex-col md:flex-row flex-wrap items-center gap-3 w-full relative z-20">
      
      {/* Search Input */}
      <div className="flex items-center gap-2 bg-zinc-50 border border-[#F6B7CF]/10 px-3.5 py-2 rounded-full w-full md:w-[220px]">
        <Search className="w-4 h-4 text-zinc-400 shrink-0" />
        <input
          type="text"
          placeholder="Search transactions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full text-xs text-[#18181B] bg-transparent outline-none placeholder-zinc-400"
        />
      </div>

      {/* Grid container for filters to align beautifully */}
      <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto flex-1">
        
        {/* Date Range Dropdown */}
        <div className="flex items-center gap-1.5 bg-zinc-50/50 border border-[#F6B7CF]/10 px-3.5 py-2 rounded-full text-xs">
          <Calendar className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="font-semibold text-zinc-700 bg-transparent border-none outline-none cursor-pointer text-xs"
          >
            <option value="All">All Time</option>
            <option value="Today">Today</option>
            <option value="This Week">This Week</option>
            <option value="This Month">This Month</option>
            <option value="This Year">This Year</option>
          </select>
        </div>

        {/* Category Dropdown */}
        <div className="flex items-center gap-1.5 bg-zinc-50/50 border border-[#F6B7CF]/10 px-3.5 py-2 rounded-full text-xs">
          <Tag className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="font-semibold text-zinc-700 bg-transparent border-none outline-none cursor-pointer text-xs"
          >
            <option value="All">All Categories</option>
            <option value="Food">Food</option>
            <option value="Bills">Bills</option>
            <option value="Travel">Travel</option>
            <option value="Shopping">Shopping</option>
            <option value="Health">Health</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Income">Income</option>
          </select>
        </div>

        {/* Account Dropdown */}
        <div className="flex items-center gap-1.5 bg-zinc-50/50 border border-[#F6B7CF]/10 px-3.5 py-2 rounded-full text-xs">
          <Landmark className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
          <select
            value={account}
            onChange={(e) => setAccount(e.target.value)}
            className="font-semibold text-zinc-700 bg-transparent border-none outline-none cursor-pointer text-xs"
          >
            <option value="All">All Accounts</option>
            <option value="ICICI">ICICI</option>
            <option value="HDFC">HDFC</option>
            <option value="Axis">Axis</option>
            <option value="SBI">SBI</option>
          </select>
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-1.5 bg-zinc-50/50 border border-[#F6B7CF]/10 px-3.5 py-2 rounded-full text-xs">
          <ArrowUpDown className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="font-semibold text-zinc-700 bg-transparent border-none outline-none cursor-pointer text-xs"
          >
            <option value="Newest">Newest</option>
            <option value="Oldest">Oldest</option>
            <option value="Highest">Highest</option>
            <option value="Lowest">Lowest</option>
          </select>
        </div>

      </div>

      {/* Clear Filters Button */}
      {(searchQuery || dateRange !== "All" || category !== "All" || account !== "All" || sortBy !== "Newest") && (
        <button
          onClick={onClearFilters}
          className="text-xs font-semibold py-2 px-3.5 bg-[#FFF4F8] border border-[#F6B7CF]/20 text-[#D46A96] hover:bg-[#FFF4F8]/70 rounded-full flex items-center gap-1.5 transition-colors cursor-pointer w-full md:w-auto justify-center"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Clear Filters</span>
        </button>
      )}

    </div>
  );
}
