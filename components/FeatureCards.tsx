import Image from "next/image";
import { CpuArchitecture } from "./CpuArchitecture";

export default function FeatureCards() {
  return (
    <section className="w-full relative z-10 py-16 px-6 xl:px-0 mx-auto" style={{ maxWidth: "1200px" }}>
      <div className="flex flex-col mb-12">
        <div className="flex flex-col lg:flex-row lg:items-baseline gap-2 lg:gap-4 mb-8">
          <h2 className="text-3xl md:text-4xl font-serif text-ink m-0">Explore Features</h2>
          <p className="text-lg md:text-xl text-ink-soft m-0">
            Smarter budgets and AI-powered recommendations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 w-full">
          {/* Row 1 (3 cards) */}
          <div className="md:col-span-2 flex flex-col p-8 rounded-3xl bg-white shadow-sm border border-black/5 hover:-translate-y-1 hover:shadow-md transition-all duration-300 min-h-[380px] overflow-hidden justify-between">
            <div className="relative w-full h-56 mb-2 rounded-2xl overflow-hidden">
              <Image
                src="/cards1.png"
                alt="Unified Financial Dashboard"
                fill
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
                src="/Cards2.png"
                alt="Personalized Financial Planning"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
            <div>
              <h3 className="font-semibold text-xl text-ink mb-2">Personalized Financial Planning</h3>
              <p className="text-ink-soft text-[16px] leading-relaxed">
                AI-crafted strategies tailored to your financial goals.
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
          <div className="md:col-span-3 flex flex-col p-8 rounded-3xl bg-white shadow-sm border border-black/5 hover:-translate-y-1 hover:shadow-md transition-all duration-300 min-h-[300px]">
            <h3 className="font-semibold text-xl text-ink mb-3">Bank-level Security</h3>
            <p className="text-ink-soft text-[16px] leading-relaxed">
              We use 256-bit encryption to keep your data safe and private.
            </p>
          </div>
          <div className="md:col-span-3 flex flex-col p-8 rounded-3xl bg-white shadow-sm border border-black/5 hover:-translate-y-1 hover:shadow-md transition-all duration-300 min-h-[300px]">
            <h3 className="font-semibold text-xl text-ink mb-3">One Dashboard</h3>
            <p className="text-ink-soft text-[16px] leading-relaxed">
              Connect all your accounts to see your net worth in real-time.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
