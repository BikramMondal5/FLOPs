import Image from "next/image";
import { CpuArchitecture } from "./CpuArchitecture";
import { DottedMapCard } from "./DottedMapCard";

export default function FeatureCards() {
  return (
    <section id="features" className="w-full relative z-10 pt-10 pb-16 px-6 xl:px-0 mx-auto" style={{ maxWidth: "1200px" }}>
      <div className="flex flex-col items-center text-center">
        {/* Tag / Pill Badge */}
        <div
          className="inline-flex items-center rounded-full border border-[#F6B7CF] bg-[#FFF4F8] text-[#D46A96]"
          style={{
            fontFamily: "var(--font-body)",
            height: "40px",
            padding: "10px 18px",
            fontSize: "12px",
            fontWeight: 600,
            lineHeight: "16px",
            gap: "8px",
            marginBottom: "20px",
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="flex-shrink-0"
          >
            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275Z" />
          </svg>
          <span>AI-Powered Financial Intelligence</span>
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
          Key Features
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
          Discover the intelligent tools that help you track spending, plan smarter, protect your data, and make confident financial decisions—all from one unified platform.
        </p>
      </div>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 w-full">
          {/* Row 1 (3 cards) */}
          <div className="md:col-span-2 flex flex-col p-8 rounded-3xl bg-white shadow-sm border border-black/5 hover:-translate-y-1 hover:shadow-md transition-all duration-300 min-h-[380px] overflow-hidden justify-between">
            <div className="relative w-full h-56 mb-2 rounded-2xl overflow-hidden">
              <Image
                src="/card1.png"
                alt="Unified Financial Dashboard"
                fill
                priority={true}
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
            <div>
              <h3 className="font-semibold text-xl text-ink mb-2">Unified Financial Dashboard</h3>
              <p className="text-ink-soft text-[16px] leading-relaxed">
                Everything you need to manage your finances in one place.
              </p>
            </div>
          </div>
          <div className="md:col-span-2 flex flex-col p-8 rounded-3xl bg-white shadow-sm border border-black/5 hover:-translate-y-1 hover:shadow-md transition-all duration-300 min-h-[380px] overflow-hidden justify-between">
            <div className="relative w-full h-56 mb-2 rounded-2xl overflow-hidden">
              <Image
                src="/Card2.png"
                alt="Cross-Device Experience"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
            <div>
              <h3 className="font-semibold text-xl text-ink mb-2">Cross-Device Experience</h3>
              <p className="text-ink-soft text-[16px] leading-relaxed">
                Access your financial dashboard seamlessly across every device.
              </p>
            </div>
          </div>
          <div className="md:col-span-2 flex flex-col p-8 rounded-3xl bg-white shadow-sm border border-black/5 hover:-translate-y-1 hover:shadow-md transition-all duration-300 min-h-[380px] overflow-hidden justify-between">
            <div className="relative w-full h-56 mb-2 rounded-2xl overflow-hidden flex items-center justify-center bg-transparent">
              <CpuArchitecture className="w-full h-full text-zinc-300" imageUrl="/cards3.png" />
            </div>
            <div>
              <h3 className="font-semibold text-xl text-ink mb-2">Explainable AI Insights</h3>
              <p className="text-ink-soft text-[16px] leading-relaxed">
                Every recommendation comes with a clear explanation.
              </p>
            </div>
          </div>

          {/* Row 2 (2 cards) */}
          <div className="md:col-span-3 flex flex-col p-8 rounded-3xl bg-white shadow-sm border border-black/5 hover:-translate-y-1 hover:shadow-md transition-all duration-300 min-h-[380px] overflow-hidden justify-between">
            <div className="relative w-full h-64 mb-0 rounded-2xl overflow-hidden">
              <Image
                src="/card4.png"
                alt="Secure by Default"
                fill
                priority={true}
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
            <div>
              <h3 className="font-semibold text-xl text-ink mb-2">Secure by Default</h3>
              <p className="text-ink-soft text-[16px] leading-relaxed">
                Bank-grade encryption keeps your financial data private.
              </p>
            </div>
          </div>
          <div className="md:col-span-3 flex flex-col p-8 rounded-3xl bg-white shadow-sm border border-black/5 hover:-translate-y-1 hover:shadow-md transition-all duration-300 min-h-[380px] overflow-hidden justify-between">
            <div className="relative w-full h-56 mb-2 rounded-2xl overflow-hidden bg-transparent">
              <DottedMapCard />
            </div>
            <div>
              <h3 className="font-semibold text-xl text-ink mb-2">Connected Financial View</h3>
              <p className="text-ink-soft text-[16px] leading-relaxed">
                Bring all your accounts together in one unified dashboard.
              </p>
            </div>
          </div>
        </div>
    </section>
  );
}
