"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function CtaSection() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, amount: 0.18 });

  const handleGetStarted = () => {
    if (status === "authenticated") {
      router.push("/overview");
    } else {
      router.push("/auth/login");
    }
  };

  // Spotlight mouse track state
  const [mouse, setMouse] = useState({ x: -9999, y: -9999, active: false });
  const [pulses, setPulses] = useState<{ id: number; left: number; top: number; scale: number }[]>([]);

  // Smooth cursor follow variables
  const [curMouse, setCurMouse] = useState({ x: -9999, y: -9999 });

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMouse({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true,
    });
  };

  const handlePointerLeave = () => {
    setMouse((prev) => ({ ...prev, active: false }));
  };

  // Smooth follow interpolation loop
  useEffect(() => {
    if (!mouse.active) return;
    let frameId: number;

    const updateFollow = () => {
      setCurMouse((prev) => {
        const dx = mouse.x - prev.x;
        const dy = mouse.y - prev.y;
        if (Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1) {
          return mouse;
        }
        return {
          x: prev.x + dx * 0.18,
          y: prev.y + dy * 0.18,
        };
      });
      frameId = requestAnimationFrame(updateFollow);
    };

    frameId = requestAnimationFrame(updateFollow);
    return () => cancelAnimationFrame(frameId);
  }, [mouse]);

  // Ambient pulse dots spawning at grid intersections
  useEffect(() => {
    const spawnPulse = () => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const cell = 40; // matches grid sizing
      const cols = Math.floor(rect.width / cell);
      const rows = Math.floor(rect.height / cell);
      if (cols < 2 || rows < 2) return;

      const count = 2 + Math.floor(Math.random() * 3);
      const newPulses: { id: number; left: number; top: number; scale: number }[] = [];
      const usedKeys = new Set<string>();

      for (let i = 0; i < count; i++) {
        let cx = 0, cy = 0, key = "", tries = 0;
        do {
          cx = Math.floor(Math.random() * (cols - 1)) + 1;
          cy = Math.floor(Math.random() * (rows - 1)) + 1;
          key = `${cx}-${cy}`;
          tries++;
        } while (usedKeys.has(key) && tries < 10);
        usedKeys.add(key);

        newPulses.push({
          id: Math.random(),
          left: cx * cell - 2,
          top: cy * cell - 2,
          scale: 0.8 + Math.random() * 0.7,
        });
      }

      setPulses((prev) => [...prev, ...newPulses]);

      // Remove after animation completes
      setTimeout(() => {
        setPulses((prev) => prev.filter((p) => !newPulses.find((np) => np.id === p.id)));
      }, 2600);
    };

    const timer = setTimeout(spawnPulse, 1400);
    const interval = setInterval(spawnPulse, 2600 + Math.random() * 1200);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  return (
    <section className="w-full py-10 px-6 sm:px-8">
      <div
        ref={cardRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        className="cta w-full relative overflow-hidden py-12 sm:py-16 lg:py-18 transition-all duration-300 mx-auto"
        style={{
          maxWidth: "1120px",
          minHeight: "480px",
          // custom properties for grid masks
          // @ts-ignore
          "--cx": `${curMouse.x}px`,
          // @ts-ignore
          "--cy": `${curMouse.y}px`,
          isolation: "isolate",
        }}
      >
        {/* Soft pink outer glow halo using before style */}
        <div className="absolute inset-[-40px] rounded-[inherit] pointer-events-none z-[-1] filter blur-[40px] bg-radial from-[#F6B7CF]/28 to-transparent" />

        {/* Background lighting layers */}
        <div className="absolute inset-0 pointer-events-none z-0 filter blur-[20px] bg-light-gradients bg-radial-glows" />

        {/* Grid base layer */}
        <div className="absolute inset-0 pointer-events-none z-[1] bg-grid-lines bg-[size:40px_40px] opacity-100" />
        
        {/* Grid soft glow (illuminated glass feel) */}
        <div className="absolute inset-0 pointer-events-none z-[1] bg-grid-glow bg-[size:40px_40px] filter blur-[4px] opacity-60" />

        {/* Hover-energized grid (masked by cursor) */}
        <div
          className="absolute inset-0 pointer-events-none z-[2] bg-grid-hover bg-[size:40px_40px] transition-opacity duration-300"
          style={{
            opacity: mouse.active ? 1 : 0,
            WebkitMaskImage: "radial-gradient(circle 180px at var(--cx) var(--cy), #000 0%, #000 40%, transparent 100%)",
            maskImage: "radial-gradient(circle 180px at var(--cx) var(--cy), #000 0%, #000 40%, transparent 100%)",
          }}
        />

        {/* Hover glow (blurred bright grid) */}
        <div
          className="absolute inset-0 pointer-events-none z-[2] bg-grid-hover bg-[size:40px_40px] filter blur-[6px] transition-opacity duration-300"
          style={{
            opacity: mouse.active ? 0.9 : 0,
            WebkitMaskImage: "radial-gradient(circle 180px at var(--cx) var(--cy), #000 0%, transparent 100%)",
            maskImage: "radial-gradient(circle 180px at var(--cx) var(--cy), #000 0%, transparent 100%)",
          }}
        />

        {/* Intersection dots */}
        <div
          className="absolute inset-0 pointer-events-none z-[2] bg-grid-dots bg-[size:40px_40px] transition-opacity duration-300"
          style={{
            opacity: mouse.active ? 1 : 0,
            WebkitMaskImage: "radial-gradient(circle 180px at var(--cx) var(--cy), #000 0%, #000 30%, transparent 100%)",
            maskImage: "radial-gradient(circle 180px at var(--cx) var(--cy), #000 0%, #000 30%, transparent 100%)",
          }}
        />

        {/* Cursor light spotlight */}
        <div
          className="absolute w-[360px] h-[360px] rounded-full pointer-events-none z-[2] transition-opacity duration-[400ms] ease-out bg-radial from-[#F6B7CF]/10 to-transparent filter blur-[120px]"
          style={{
            opacity: mouse.active ? 1 : 0,
            transform: `translate3d(${curMouse.x - 180}px, ${curMouse.y - 180}px, 0)`,
          }}
        />

        {/* Ambient pulse dots */}
        <div className="absolute inset-0 pointer-events-none z-[2]">
          {pulses.map((p) => (
            <div
              key={p.id}
              className="pulse-dot absolute w-1 h-1 rounded-full bg-[#F6B7CF]/90 shadow-[0_0_8px_2px_rgba(246,183,207,0.6),0_0_16px_4px_rgba(246,183,207,0.3)] animate-pulse-dot"
              style={{
                left: `${p.left}px`,
                top: `${p.top}px`,
                transform: `scale(${p.scale})`,
              }}
            />
          ))}
        </div>

        {/* Floating background sparkles */}
        <div className="sparkle absolute pointer-events-none z-[2] opacity-[0.10] text-[#E88AB3] animate-float-1" style={{ top: "12%", left: "8%" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0l1.6 9.4L23 11l-9.4 1.6L12 24l-1.6-11.4L1 11l9.4-1.6z"/></svg>
        </div>
        <div className="sparkle absolute pointer-events-none z-[2] opacity-[0.10] text-[#E88AB3] animate-float-2" style={{ top: "22%", right: "10%" }}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0l1.6 9.4L23 11l-9.4 1.6L12 24l-1.6-11.4L1 11l9.4-1.6z"/></svg>
        </div>
        <div className="sparkle absolute pointer-events-none z-[2] opacity-[0.10] text-[#E88AB3] animate-float-3" style={{ bottom: "18%", left: "14%" }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0l1.6 9.4L23 11l-9.4 1.6L12 24l-1.6-11.4L1 11l9.4-1.6z"/></svg>
        </div>
        <div className="sparkle absolute pointer-events-none z-[2] opacity-[0.10] text-[#E88AB3] animate-float-1" style={{ bottom: "26%", right: "16%" }}>
          <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0l1.6 9.4L23 11l-9.4 1.6L12 24l-1.6-11.4L1 11l9.4-1.6z"/></svg>
        </div>
        <div className="sparkle absolute pointer-events-none z-[2] opacity-[0.10] text-[#E88AB3] animate-float-2" style={{ top: "46%", left: "4%" }}>
          <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0l1.6 9.4L23 11l-9.4 1.6L12 24l-1.6-11.4L1 11l9.4-1.6z"/></svg>
        </div>
        <div className="sparkle absolute pointer-events-none z-[2] opacity-[0.10] text-[#E88AB3] animate-float-3" style={{ top: "60%", right: "6%" }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0l1.6 9.4L23 11l-9.4 1.6L12 24l-1.6-11.4L1 11l9.4-1.6z"/></svg>
        </div>

        {/* Content Wrapper */}
        <div className="relative z-10 flex flex-col items-center text-center mx-auto max-w-[760px] px-4">
          
          {/* Tag Pill */}
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
            className="inline-flex items-center gap-2 rounded-full border border-[#E88AB3]/25 px-4 py-1.5 backdrop-blur-[6px] text-[#b35e8c]"
            style={{
              fontFamily: "var(--font-body)",
              background: "linear-gradient(180deg, rgba(246,183,207,0.16), rgba(246,183,207,0.08))",
              fontSize: "12.5px",
              fontWeight: 600,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              height: "42px",
              marginBottom: "20px",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#E88AB3]">
              <path d="M12 3l1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2L12 3z"/>
            </svg>
            <span>Start Your Financial Journey</span>
          </motion.div>

          {/* Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 22 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.22 }}
            className="font-normal m-0 tracking-tight text-[#2a1622] leading-[1.05]"
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(42px, 7vw, 72px)",
              letterSpacing: "-0.03em",
            }}
          >
            Ready to Take Control<br className="hidden sm:block" />
            of Your <span className="text-[#E88AB3] relative z-10 italic">
              Finances
              <span className="absolute left-[-2px] right-[-2px] bottom-[2px] h-[10px] bg-gradient-to-r from-[#E88AB3]/28 to-[#E88AB3]/05 rounded-[4px] z-[-1]" />
            </span>?
          </motion.h2>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 22 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.36 }}
            className="font-normal mx-auto mt-4 mb-0 text-[#6b5868]"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "clamp(15px, 1.4vw, 17.5px)",
              lineHeight: "1.6",
              maxWidth: "620px",
            }}
          >
            Join FLOPs today and let AI help you budget smarter, save consistently, and build healthier financial habits with confidence.
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mt-6"
          >
            <button
              onClick={handleGetStarted}
              className="inline-flex items-center justify-center gap-2 h-14 px-8 rounded-full bg-[#18181B] text-white hover:bg-black font-semibold text-base transition-all duration-300 hover:-translate-y-0.5 shadow-[0_6px_18px_rgba(24,24,27,0.15)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.2)] cursor-pointer"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Get Started
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </button>
            <button
              className="inline-flex items-center justify-center h-14 px-8 rounded-full bg-[#F6B7CF] text-[#18181B] hover:bg-[#F3A9C5] font-semibold text-base transition-all duration-300 border border-[#E88AB3]/35 hover:-translate-y-0.5 hover:shadow-[0_12px_36px_rgba(232,138,179,0.35)] cursor-pointer"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Watch Demo
            </button>
          </motion.div>

          {/* Trust indicator */}
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.78 }}
            className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mt-8"
            style={{ fontFamily: "var(--font-body)" }}
          >
            <div className="flex -space-x-3">
              <img className="w-[38px] height-[38px] rounded-full object-cover border-2 border-white shadow-[0_2px_8px_rgba(180,90,130,0.18)]" src="https://i.pravatar.cc/80?img=5" alt="User" />
              <img className="w-[38px] height-[38px] rounded-full object-cover border-2 border-white shadow-[0_2px_8px_rgba(180,90,130,0.18)]" src="https://i.pravatar.cc/80?img=32" alt="User" />
              <img className="w-[38px] height-[38px] rounded-full object-cover border-2 border-white shadow-[0_2px_8px_rgba(180,90,130,0.18)]" src="https://i.pravatar.cc/80?img=47" alt="User" />
              <img className="w-[38px] height-[38px] rounded-full object-cover border-2 border-white shadow-[0_2px_8px_rgba(180,90,130,0.18)]" src="https://i.pravatar.cc/80?img=15" alt="User" />
              <img className="w-[38px] height-[38px] rounded-full object-cover border-2 border-white shadow-[0_2px_8px_rgba(180,90,130,0.18)]" src="https://i.pravatar.cc/80?img=68" alt="User" />
            </div>
            <div className="text-left">
              <p className="text-[13.5px] text-[#6b5868] mt-0.5 font-medium m-0">
                Trusted by <span className="text-[#2a1622] font-semibold">12,000+ users</span> building healthier financial habits.
              </p>
            </div>
          </motion.div>

        </div>
      </div>

      <style jsx>{`
        .cta {
          border-radius: 36px;
          background: #ffffff;
          box-shadow:
            0 1px 0 rgba(255,255,255,0.9) inset,
            0 30px 80px -30px rgba(232,138,179,0.35),
            0 10px 40px -20px rgba(232,138,179,0.25),
            0 0 0 1px rgba(246,183,207,0.18);
        }
        
        /* Grid layers */
        .bg-light {
          background:
            radial-gradient(60% 50% at 50% 0%, rgba(246,183,207,0.22), transparent 70%),
            radial-gradient(55% 55% at 50% 50%, rgba(249,214,226,0.32), transparent 75%),
            radial-gradient(50% 50% at 100% 100%, rgba(255,245,248,0.45), transparent 70%);
        }
        .bg-grid-lines {
          background-image:
            linear-gradient(to right, rgba(246,183,207,0.22) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(246,183,207,0.18) 1px, transparent 1px);
        }
        .bg-grid-glow {
          background-image:
            linear-gradient(to right, rgba(246,183,207,0.30) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(246,183,207,0.30) 1px, transparent 1px);
        }
        .bg-grid-hover {
          background-image:
            linear-gradient(to right, rgba(246,183,207,0.45) 1.2px, transparent 1.2px),
            linear-gradient(to bottom, rgba(246,183,207,0.45) 1.2px, transparent 1.2px);
        }
        .bg-grid-dots {
          background-image: radial-gradient(circle at 0px 0px, rgba(246,183,207,0.75) 1.2px, transparent 2px);
        }

        /* Spawning intersection pulses */
        @keyframes pulse {
          0%   { opacity: 0; transform: scale(0.6); }
          20%  { opacity: 0.9; transform: scale(1); }
          100% { opacity: 0; transform: scale(1.8); }
        }
        .animate-pulse-dot {
          animation: pulse 2.4s ease-out forwards;
        }

        /* Floating sparkles animations */
        @keyframes float1 {
          0%, 100% { transform: translate(0,0) rotate(0deg); }
          50% { transform: translate(8px,-14px) rotate(20deg); }
        }
        @keyframes float2 {
          0%, 100% { transform: translate(0,0) rotate(0deg); }
          50% { transform: translate(-10px,-18px) rotate(-15deg); }
        }
        @keyframes float3 {
          0%, 100% { transform: translate(0,0) rotate(0deg); }
          50% { transform: translate(6px,12px) rotate(25deg); }
        }
        .animate-float-1 { animation: float1 14s ease-in-out infinite; }
        .animate-float-2 { animation: float2 18s ease-in-out infinite; }
        .animate-float-3 { animation: float3 16s ease-in-out infinite; }
      `}</style>
    </section>
  );
}
