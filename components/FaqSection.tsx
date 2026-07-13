"use client";

import { useState } from "react";
import { HelpCircle, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type FaqItem = {
  question: string;
  answer: string;
};

const faqItems: FaqItem[] = [
  {
    question: "What is FLOPs?",
    answer: "FLOPs (Financial Lifestyle Optimization Suite) is an AI-powered platform that helps you manage spending, plan budgets, track financial goals, and receive personalized recommendations.",
  },
  {
    question: "How does FLOPs personalize financial recommendations?",
    answer: "FLOPs analyzes your spending habits, savings patterns, and financial goals to generate tailored insights that help you make smarter financial decisions.",
  },
  {
    question: "Is my financial data secure?",
    answer: "Yes. FLOPs follows privacy-first principles with bank-grade encryption and secure authentication to protect your financial information.",
  },
  {
    question: "Can I connect multiple bank accounts?",
    answer: "Yes. FLOPs is designed to provide a unified financial dashboard by securely connecting multiple accounts in one place.",
  },
  {
    question: "How does the AI explain its recommendations?",
    answer: "Every recommendation includes a clear explanation so you understand why a suggestion is made before taking action.",
  },
  {
    question: "Can I track my savings goals?",
    answer: "Absolutely. Create personalized goals, monitor your progress, and receive AI-powered suggestions to stay on track.",
  },
  {
    question: "Is FLOPs suitable for beginners?",
    answer: "Yes. FLOPs is built for everyone—from students and young professionals to experienced users—making personal finance simple and easy to understand.",
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Split items into 2 columns for desktop layout
  const leftColItems = faqItems.filter((_, i) => i % 2 === 0);
  const rightColItems = faqItems.filter((_, i) => i % 2 !== 0);

  return (
    <section id="faq" className="relative w-full relative z-10 pt-10 pb-20 px-6 xl:px-0 mx-auto" style={{ maxWidth: "1200px" }}>
      {/* Header - matching Key Features style exactly */}
      <div className="flex flex-col items-center text-center">
        {/* Tag / Pill Badge */}
        <div
          className="inline-flex items-center rounded-full border border-[#F6B7CF] bg-[#FFF4F8] text-[#D46A96]"
          style={{
            fontFamily: "var(--font-body)",
            height: "40px",
            padding: "0 18px",
            fontSize: "12px",
            fontWeight: 600,
            lineHeight: "16px",
            gap: "8px",
            marginBottom: "20px",
          }}
        >
          <HelpCircle className="w-[14px] h-[14px] text-[#D46A96]" />
          <span>Frequently Asked Questions</span>
        </div>

        {/* Heading */}
        <h2
          className="font-normal m-0 animate-fade-in"
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "60px",
            fontWeight: 400,
            lineHeight: "60px",
            letterSpacing: "-0.03em",
            color: "#18181B",
            marginBottom: "24px",
          }}
        >
          Frequently Asked Questions
        </h2>

        {/* Sub-heading */}
        <p
          className="font-normal mx-auto m-0"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "18px",
            fontWeight: 400,
            lineHeight: "28px",
            letterSpacing: "-0.01em",
            color: "#6B7280",
            maxWidth: "680px",
            marginTop: "0px",
            marginBottom: "56px",
          }}
        >
          Everything you need to know about FLOPs, your AI-powered financial companion.
        </p>
      </div>

      {/* Two column FAQ layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full items-start">
        {/* Left Column */}
        <div className="flex flex-col gap-6">
          {leftColItems.map((item, idx) => {
            const actualIndex = idx * 2;
            const isOpen = openIndex === actualIndex;
            return (
              <FaqCard
                key={actualIndex}
                item={item}
                isOpen={isOpen}
                onToggle={() => toggleFaq(actualIndex)}
              />
            );
          })}
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-6">
          {rightColItems.map((item, idx) => {
            const actualIndex = idx * 2 + 1;
            const isOpen = openIndex === actualIndex;
            return (
              <FaqCard
                key={actualIndex}
                item={item}
                isOpen={isOpen}
                onToggle={() => toggleFaq(actualIndex)}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

function FaqCard({ item, isOpen, onToggle }: { item: FaqItem; isOpen: boolean; onToggle: () => void }) {
  return (
    <motion.div
      layout
      className="bg-white border border-[#F2F2F2] rounded-[20px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer overflow-hidden"
      onClick={onToggle}
    >
      <div className="flex justify-between items-center gap-4">
        <h4 className="text-lg font-semibold text-zinc-900 tracking-tight leading-snug">
          {item.question}
        </h4>
        <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-zinc-50 border border-zinc-100">
          <motion.div
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <Plus className="w-5 h-5 text-[#D46A96]" />
          </motion.div>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="pt-4 text-base text-[#6B7280] leading-relaxed m-0">
              {item.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
