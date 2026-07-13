"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Landmark, Wallet, Receipt, Target, Sparkles, PiggyBank, TrendingUp, BarChart3, ChartSpline } from "lucide-react";

export default function AgentEconomySection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, amount: 0.15 });

  // Mouse hover state for grid mask illumination
  const [mouse, setMouse] = useState({ x: -9999, y: -9999, active: false });
  const [activeStep, setActiveStep] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMouse({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true,
    });
  };

  const handleMouseLeave = () => {
    setMouse({ x: -9999, y: -9999, active: false });
  };

  // Pulse animation cycle for the timeline workflow at the bottom
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      ref={containerRef}
      className="w-full py-20 px-6 sm:px-8 relative overflow-hidden"
      style={{
        backgroundColor: "var(--bg-tint)",
        backgroundImage: `
          linear-gradient(to right, rgba(246, 183, 207, 0.08) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(246, 183, 207, 0.08) 1px, transparent 1px)
        `,
        backgroundSize: "36px 36px",
      }}
    >
      {/* Blurred pink gradients */}
      <div className="absolute top-[10%] left-[-5%] w-[45vw] h-[45vw] rounded-full pointer-events-none z-0 bg-radial from-[#F6B7CF]/18 to-transparent filter blur-[100px]" />
      <div className="absolute bottom-[5%] right-[-5%] w-[50vw] h-[50vw] rounded-full pointer-events-none z-0 bg-radial from-[#F9DCE7]/28 to-transparent filter blur-[120px]" />

      <div className="max-w-[1200px] mx-auto relative z-10">
        
        {/* Header section matching FLOPs style */}
        <div className="flex flex-col items-center text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-[#F6B7CF] bg-[#FFF4F8] text-[#D46A96]"
            style={{
              fontFamily: "var(--font-body)",
              height: "40px",
              padding: "10px 18px",
              fontSize: "12px",
              fontWeight: 600,
              lineHeight: "16px",
              marginBottom: "20px",
            }}
          >
            <Sparkles className="w-[14px] h-[14px] text-[#D46A96]" />
            <span>How It Works</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="font-normal m-0 tracking-tight text-[#18181B] leading-[1.1]"
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(32px, 5.5vw, 72px)",
              letterSpacing: "-0.03em",
              marginBottom: "24px",
            }}
          >
            How AI Helps You Make Better Financial Decisions
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.28 }}
            className="font-normal mx-auto m-0 text-zinc-500"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "18px",
              lineHeight: "28px",
              letterSpacing: "-0.01em",
              color: "#6B7280",
              maxWidth: "760px",
            }}
          >
            FLOPs securely analyzes your financial data, generates personalized insights, and helps you build healthier financial habits—all in just a few simple steps.
          </motion.p>
        </div>

        {/* Masked cursor illumination layer bounds */}
        <div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative w-full overflow-x-auto pb-6 scrollbar-hide"
          style={{
            // @ts-ignore
            "--cx": `${mouse.x}px`,
            // @ts-ignore
            "--cy": `${mouse.y}px`,
          }}
        >
          {/* Hover-energized grid (masked by cursor) */}
          {mouse.active && (
            <div
              className="absolute inset-0 pointer-events-none z-[1] transition-opacity duration-300"
              style={{
                backgroundImage: `
                  linear-gradient(to right, rgba(246, 183, 207, 0.24) 1px, transparent 1px),
                  linear-gradient(to bottom, rgba(246, 183, 207, 0.24) 1px, transparent 1px)
                `,
                backgroundSize: "36px 36px",
                WebkitMaskImage: "radial-gradient(circle 180px at var(--cx) var(--cy), #000 0%, #000 40%, transparent 100%)",
                maskImage: "radial-gradient(circle 180px at var(--cx) var(--cy), #000 0%, #000 40%, transparent 100%)",
              }}
            />
          )}

          {/* Interactive Flow Grid Graph */}
          <div className="flex items-center justify-between relative w-[980px] h-[400px] mx-auto z-10">
            
            {/* SVG flows animation layer */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" width="980" height="400">
              <defs>
                <linearGradient id="flowLeft" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="rgba(246, 183, 207, 0.15)"></stop>
                  <stop offset="100%" stopColor="#F6B7CF"></stop>
                </linearGradient>
                <linearGradient id="flowRight" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#F6B7CF"></stop>
                  <stop offset="100%" stopColor="rgba(246, 183, 207, 0.15)"></stop>
                </linearGradient>
              </defs>
              
              {/* Left connections (Input cards -> AI Core Anchors) */}
              <path className="fill-none stroke-[#F6B7CF] stroke-[2] opacity-85" strokeLinecap="round" strokeLinejoin="round" d="M 230 74 C 330 74, 340 170, 442.7 170"></path>
              <path className="fill-none stroke-[#F6B7CF] stroke-[2] opacity-85" strokeLinecap="round" strokeLinejoin="round" d="M 230 158 C 330 158, 340 190, 434.9 190"></path>
              <path className="fill-none stroke-[#F6B7CF] stroke-[2] opacity-85" strokeLinecap="round" strokeLinejoin="round" d="M 230 242 C 330 242, 340 210, 434.9 210"></path>
              <path className="fill-none stroke-[#F6B7CF] stroke-[2] opacity-85" strokeLinecap="round" strokeLinejoin="round" d="M 230 326 C 330 326, 340 230, 442.7 230"></path>

              {/* Right connections (AI Core Anchors -> Outputs cards) */}
              <path className="fill-none stroke-[#F6B7CF] stroke-[2] opacity-85" strokeLinecap="round" strokeLinejoin="round" d="M 537.3 170 C 640 170, 650 74, 750 74"></path>
              <path className="fill-none stroke-[#F6B7CF] stroke-[2] opacity-85" strokeLinecap="round" strokeLinejoin="round" d="M 545.1 190 C 640 190, 650 158, 750 158"></path>
              <path className="fill-none stroke-[#F6B7CF] stroke-[2] opacity-85" strokeLinecap="round" strokeLinejoin="round" d="M 545.1 210 C 640 210, 650 242, 750 242"></path>
              <path className="fill-none stroke-[#F6B7CF] stroke-[2] opacity-85" strokeLinecap="round" strokeLinejoin="round" d="M 537.3 230 C 640 230, 650 326, 750 326"></path>

              {/* Glowing Anchor Dots on AI Core */}
              <g fill="#F6B7CF" filter="drop-shadow(0 0 6px #F6B7CF)">
                {/* Left side dots */}
                <circle cx="442.7" cy="170" r="2.5" />
                <circle cx="434.9" cy="190" r="2.5" />
                <circle cx="434.9" cy="210" r="2.5" />
                <circle cx="442.7" cy="230" r="2.5" />
                {/* Right side dots */}
                <circle cx="537.3" cy="170" r="2.5" />
                <circle cx="545.1" cy="190" r="2.5" />
                <circle cx="545.1" cy="210" r="2.5" />
                <circle cx="537.3" cy="230" r="2.5" />
              </g>

              {/* Flowing animated particles */}
              <g>
                {/* Left flowing particles */}
                <circle r="3.5" fill="#D46A96" filter="drop-shadow(0 0 5px #F6B7CF)">
                  <animateMotion dur="2.8s" repeatCount="indefinite" path="M 230 74 C 330 74, 340 170, 442.7 170" />
                </circle>
                <circle r="3.5" fill="#D46A96" filter="drop-shadow(0 0 5px #F6B7CF)">
                  <animateMotion dur="2.8s" begin="0.4s" repeatCount="indefinite" path="M 230 158 C 330 158, 340 190, 434.9 190" />
                </circle>
                <circle r="3.5" fill="#D46A96" filter="drop-shadow(0 0 5px #F6B7CF)">
                  <animateMotion dur="2.8s" begin="0.8s" repeatCount="indefinite" path="M 230 242 C 330 242, 340 210, 434.9 210" />
                </circle>
                <circle r="3.5" fill="#D46A96" filter="drop-shadow(0 0 5px #F6B7CF)">
                  <animateMotion dur="2.8s" begin="1.2s" repeatCount="indefinite" path="M 230 326 C 330 326, 340 230, 442.7 230" />
                </circle>

                {/* Right flowing particles */}
                <circle r="3.5" fill="#D46A96" filter="drop-shadow(0 0 5px #F6B7CF)">
                  <animateMotion dur="2.8s" begin="1.4s" repeatCount="indefinite" path="M 537.3 170 C 640 170, 650 74, 750 74" />
                </circle>
                <circle r="3.5" fill="#D46A96" filter="drop-shadow(0 0 5px #F6B7CF)">
                  <animateMotion dur="2.8s" begin="1.8s" repeatCount="indefinite" path="M 545.1 190 C 640 190, 650 158, 750 158" />
                </circle>
                <circle r="3.5" fill="#D46A96" filter="drop-shadow(0 0 5px #F6B7CF)">
                  <animateMotion dur="2.8s" begin="2.2s" repeatCount="indefinite" path="M 545.1 210 C 640 210, 650 242, 750 242" />
                </circle>
                <circle r="3.5" fill="#D46A96" filter="drop-shadow(0 0 5px #F6B7CF)">
                  <animateMotion dur="2.8s" begin="2.6s" repeatCount="indefinite" path="M 537.3 230 C 640 230, 650 326, 750 326" />
                </circle>
              </g>
            </svg>

            {/* Left Column: FINANCIAL INPUT */}
            <div className="flex flex-col gap-5 w-[230px] h-full justify-center relative">
              <div className="text-[11px] font-bold text-zinc-400 tracking-[0.1em] uppercase absolute top-2 w-full text-center">
                Financial Input
              </div>
              
              {/* Node 1 */}
              <div className="group flex items-center gap-3 p-3.5 bg-white border border-[#F6B7CF]/18 rounded-2xl shadow-[0_4px_12px_rgba(246,183,207,0.04)] hover:shadow-[0_12px_24px_rgba(246,183,207,0.12)] hover:-translate-y-1 transition-all duration-300 z-10 w-full">
                <div className="w-[34px] h-[34px] bg-[#FFF4F8] rounded-xl flex items-center justify-center flex-shrink-0 text-[#D46A96]">
                  <Landmark className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[#18181B] leading-tight">Bank Accounts</h4>
                  <p className="text-[10px] text-zinc-400 mt-0.5 leading-snug">Connect accounts securely.</p>
                </div>
              </div>

              {/* Node 2 */}
              <div className="group flex items-center gap-3 p-3.5 bg-white border border-[#F6B7CF]/18 rounded-2xl shadow-[0_4px_12px_rgba(246,183,207,0.04)] hover:shadow-[0_12px_24px_rgba(246,183,207,0.12)] hover:-translate-y-1 transition-all duration-300 z-10 w-full">
                <div className="w-[34px] h-[34px] bg-[#FFF4F8] rounded-xl flex items-center justify-center flex-shrink-0 text-[#D46A96]">
                  <Wallet className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[#18181B] leading-tight">Income Sources</h4>
                  <p className="text-[10px] text-zinc-400 mt-0.5 leading-snug">Track recurring income.</p>
                </div>
              </div>

              {/* Node 3 */}
              <div className="group flex items-center gap-3 p-3.5 bg-white border border-[#F6B7CF]/18 rounded-2xl shadow-[0_4px_12px_rgba(246,183,207,0.04)] hover:shadow-[0_12px_24px_rgba(246,183,207,0.12)] hover:-translate-y-1 transition-all duration-300 z-10 w-full">
                <div className="w-[34px] h-[34px] bg-[#FFF4F8] rounded-xl flex items-center justify-center flex-shrink-0 text-[#D46A96]">
                  <Receipt className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[#18181B] leading-tight">Monthly Expenses</h4>
                  <p className="text-[10px] text-zinc-400 mt-0.5 leading-snug">Categorize spending automatically.</p>
                </div>
              </div>

              {/* Node 4 */}
              <div className="group flex items-center gap-3 p-3.5 bg-white border border-[#F6B7CF]/18 rounded-2xl shadow-[0_4px_12px_rgba(246,183,207,0.04)] hover:shadow-[0_12px_24px_rgba(246,183,207,0.12)] hover:-translate-y-1 transition-all duration-300 z-10 w-full">
                <div className="w-[34px] h-[34px] bg-[#FFF4F8] rounded-xl flex items-center justify-center flex-shrink-0 text-[#D46A96]">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[#18181B] leading-tight">Financial Goals</h4>
                  <p className="text-[10px] text-zinc-400 mt-0.5 leading-snug">Define savings & investments.</p>
                </div>
              </div>
            </div>

            {/* Center Component: AI Core Node */}
            <div className="flex flex-col items-center justify-center z-10 h-full w-[240px]">
              
              {/* Dynamic status popups above Core */}
              <div className="h-10 relative w-full text-center">
                <div className="absolute top-0 left-0 right-0 animate-popup">
                  <span className="text-[12px] font-mono font-semibold text-zinc-700 bg-white border border-[#F6B7CF]/30 px-3 py-1 rounded-full shadow-sm">
                    Analyzing Financial Patterns
                  </span>
                  <span className="block text-[10px] font-medium text-[#E88AB3] mt-1.5">
                    ✓ AI Insights Generated
                  </span>
                </div>
              </div>

              {/* Glassmorphism Orbit Circle Node */}
              <div className="relative w-28 h-28 my-6 flex items-center justify-center rounded-full border border-white/60 bg-white/40 backdrop-blur-md shadow-[0_15px_40px_rgba(246,183,207,0.22)]">
                {/* Slow rotating dash orbits */}
                <div className="absolute inset-0 rounded-full border border-dashed border-[#F6B7CF]/60 animate-[spin_12s_linear_infinite]" />
                
                {/* Inner glowing core */}
                <div className="absolute w-20 h-20 rounded-full bg-radial from-[#FFF4F8] to-[#F9DCE7]/30 flex items-center justify-center">
                  <Sparkles className="w-9 h-9 text-[#D46A96] animate-[pulse_3s_ease-in-out_infinite]" />
                </div>
              </div>

              <h3 className="text-sm font-bold text-[#18181B] m-0">AI Analysis Engine</h3>
              <p className="text-[11px] text-zinc-400 mt-1 m-0">Analyzing Your Financial Data</p>
            </div>

            {/* Right Column: PERSONALIZED RESULTS */}
            <div className="flex flex-col gap-5 w-[230px] h-full justify-center relative">
              <div className="text-[11px] font-bold text-zinc-400 tracking-[0.1em] uppercase absolute top-2 w-full text-center">
                Personalized Results
              </div>

              {/* Node 1 */}
              <div className="group flex items-center gap-3 p-3.5 bg-white border border-[#F6B7CF]/18 rounded-2xl shadow-[0_4px_12px_rgba(246,183,207,0.04)] hover:shadow-[0_12px_24px_rgba(246,183,207,0.12)] hover:-translate-y-1 transition-all duration-300 z-10 w-full">
                <div className="w-[34px] h-[34px] bg-[#FFF4F8] rounded-xl flex items-center justify-center flex-shrink-0 text-[#D46A96]">
                  <PiggyBank className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[#18181B] leading-tight">Smart Budget</h4>
                  <p className="text-[10px] text-zinc-400 mt-0.5 leading-snug">AI creates personalized budgets.</p>
                </div>
              </div>

              {/* Node 2 */}
              <div className="group flex items-center gap-3 p-3.5 bg-white border border-[#F6B7CF]/18 rounded-2xl shadow-[0_4px_12px_rgba(246,183,207,0.04)] hover:shadow-[0_12px_24px_rgba(246,183,207,0.12)] hover:-translate-y-1 transition-all duration-300 z-10 w-full">
                <div className="w-[34px] h-[34px] bg-[#FFF4F8] rounded-xl flex items-center justify-center flex-shrink-0 text-[#D46A96]">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[#18181B] leading-tight">Savings Plan</h4>
                  <p className="text-[10px] text-zinc-400 mt-0.5 leading-snug">Optimize monthly savings plan.</p>
                </div>
              </div>

              {/* Node 3 */}
              <div className="group flex items-center gap-3 p-3.5 bg-white border border-[#F6B7CF]/18 rounded-2xl shadow-[0_4px_12px_rgba(246,183,207,0.04)] hover:shadow-[0_12px_24px_rgba(246,183,207,0.12)] hover:-translate-y-1 transition-all duration-300 z-10 w-full">
                <div className="w-[34px] h-[34px] bg-[#FFF4F8] rounded-xl flex items-center justify-center flex-shrink-0 text-[#D46A96]">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[#18181B] leading-tight">Spending Insights</h4>
                  <p className="text-[10px] text-zinc-400 mt-0.5 leading-snug">Identify unnecessary costs.</p>
                </div>
              </div>

              {/* Node 4 */}
              <div className="group flex items-center gap-3 p-3.5 bg-white border border-[#F6B7CF]/18 rounded-2xl shadow-[0_4px_12px_rgba(246,183,207,0.04)] hover:shadow-[0_12px_24px_rgba(246,183,207,0.12)] hover:-translate-y-1 transition-all duration-300 z-10 w-full">
                <div className="w-[34px] h-[34px] bg-[#FFF4F8] rounded-xl flex items-center justify-center flex-shrink-0 text-[#D46A96]">
                  <ChartSpline className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[#18181B] leading-tight">Financial Forecast</h4>
                  <p className="text-[10px] text-zinc-400 mt-0.5 leading-snug">Predict future financial trends.</p>
                </div>
              </div>
            </div>

          </div>
        </div>

        </div>

      <style jsx global>{`
        @keyframes popup-reveal {
          0%, 40% { opacity: 0; transform: translateY(5px); }
          50% { opacity: 1; transform: translateY(0); }
          90% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-10px); }
        }
        .animate-popup {
          animation: popup-reveal 3.5s ease-out infinite;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}
