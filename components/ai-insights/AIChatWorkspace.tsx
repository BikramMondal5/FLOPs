"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Brain, ArrowUpRight, Mic, Paperclip, Send, User } from "lucide-react";

interface Message {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: string;
}

export default function AIChatWorkspace() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "msg1",
      sender: "assistant",
      text: "Hi Bikram 👋 I'm FLOPs AI. Select a query prompt below or ask me any custom questions about your budgets, savings strategies, or subscription sweeps.",
      timestamp: "12:00 PM",
    },
  ]);
  const [inputVal, setInputVal] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    
    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: "user",
      text,
      timestamp: "Just now",
    };
    
    setMessages((prev) => [...prev, userMsg]);
    setInputVal("");
    setIsTyping(true);

    // Mock streaming AI response
    setTimeout(() => {
      setIsTyping(false);
      
      let reply = "I've analyzed your financial logs. Your monthly savings rate is 12% higher than average, but shopping has exceeded planned thresholds by ₹2,400. Consider sweeping ₹5,000 to your Emergency Fund.";
      if (text.toLowerCase().includes("budget")) {
        reply = "Looking at your Budget Planner categories: Food (₹18,200 spent) is healthy, but Bills (₹24,500 spent) is near its limit. Consolidating your subscriptions could save you ₹1,200/mo.";
      } else if (text.toLowerCase().includes("spending") || text.toLowerCase().includes("expense")) {
        reply = "Your highest transaction this month was MacBook Purchase (₹1,32,000). Excluding that, your average daily spend sits at ₹2,430. We predict your month-end balance will settle at ₹1,28,450.";
      }

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: "assistant",
        text: reply,
        timestamp: "Just now",
      };
      setMessages((prev) => [...prev, aiMsg]);
    }, 1500);
  };

  const prompts = [
    "Analyze Spending",
    "Weekly Summary",
    "Monthly Report",
    "Optimize Budget",
    "Savings Tips",
  ];

  return (
    <div className="p-6 bg-white border border-[#F6B7CF]/15 rounded-[24px] shadow-[0_12px_40px_rgba(0,0,0,0.03)] min-h-[520px] max-h-[650px] relative overflow-hidden flex flex-col justify-between w-full">
      {/* Background radial soft pink glows */}
      <div className="absolute top-[-50px] right-[-50px] w-40 h-40 rounded-full bg-[#F6B7CF]/5 blur-2xl pointer-events-none" />

      {/* Messages timeline pane */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-4 pr-1 mb-4">
        {messages.map((m) => {
          const isAI = m.sender === "assistant";
          return (
            <div
              key={m.id}
              className={`flex gap-3 max-w-[85%] ${isAI ? "self-start" : "self-end flex-row-reverse"}`}
            >
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${
                isAI ? "bg-[#FFF4F8] border-[#F6B7CF]/20 text-[#D46A96]" : "bg-zinc-100 border-zinc-200 text-zinc-600"
              }`}>
                {isAI ? <Brain className="w-4.5 h-4.5" /> : <User className="w-4.5 h-4.5" />}
              </div>

              {/* Balloon */}
              <div className={`p-4 rounded-[22px] text-[12.5px] leading-relaxed shadow-[0_2px_12px_rgba(0,0,0,0.01)] ${
                isAI ? "bg-zinc-50 border border-zinc-100 text-zinc-700 rounded-tl-sm" : "bg-[#18181B] text-white rounded-tr-sm"
              }`}>
                <span>{m.text}</span>
                <span className={`text-[9px] block mt-1.5 text-right ${isAI ? "text-zinc-400" : "text-zinc-500"}`}>
                  {m.timestamp}
                </span>
              </div>
            </div>
          );
        })}

        {/* Typing indicator */}
        <AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              className="flex gap-3 self-start"
            >
              <div className="w-8 h-8 rounded-full bg-[#FFF4F8] border border-[#F6B7CF]/20 text-[#D46A96] flex items-center justify-center shrink-0">
                <Brain className="w-4.5 h-4.5 animate-pulse" />
              </div>
              <div className="p-3 bg-zinc-50 border border-zinc-100 rounded-[22px] rounded-tl-sm flex gap-1 items-center justify-center h-9">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D46A96] animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#D46A96] animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#D46A96] animate-bounce" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={scrollRef} />
      </div>

      {/* Prompt Suggestion Chips */}
      <div className="flex flex-wrap gap-2 mb-3.5 shrink-0 z-10">
        {prompts.map((p) => (
          <button
            key={p}
            onClick={() => handleSend(p)}
            className="text-[10px] font-bold py-1.5 px-3 bg-[#FFF4F8] border border-[#F6B7CF]/15 text-[#D46A96] hover:bg-[#FFF4F8]/70 rounded-full flex items-center gap-1 transition-all cursor-pointer shadow-sm hover:scale-102"
          >
            <Sparkles className="w-3 h-3 text-[#D46A96]" />
            <span>{p}</span>
          </button>
        ))}
      </div>

      {/* Input panel bar */}
      <div className="border-t border-[#F6B7CF]/10 pt-4 bg-white shrink-0 z-10 flex gap-2 items-center">
        <button
          onClick={() => alert("Statement attachments triggered.")}
          className="w-9 h-9 rounded-full bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-500 hover:text-[#18181B] transition-colors cursor-pointer shrink-0"
        >
          <Paperclip className="w-4.5 h-4.5" />
        </button>
        <button
          onClick={() => alert("Mock Voice inputs listening...")}
          className="w-9 h-9 rounded-full bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-500 hover:text-[#18181B] transition-colors cursor-pointer shrink-0"
        >
          <Mic className="w-4.5 h-4.5" />
        </button>

        <input
          type="text"
          placeholder="Ask FLOPs AI about your finances..."
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend(inputVal);
          }}
          className="flex-1 text-xs text-[#18181B] bg-zinc-50 border border-[#F6B7CF]/15 rounded-full px-4.5 py-3 outline-none focus:border-[#F6B7CF]/40 transition-colors placeholder-zinc-400"
        />

        <button
          onClick={() => handleSend(inputVal)}
          className="w-9 h-9 rounded-full bg-[#18181B] text-white flex items-center justify-center hover:bg-zinc-800 transition-colors cursor-pointer shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
