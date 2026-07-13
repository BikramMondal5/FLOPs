import Image from "next/image";
import { CpuArchitecture } from "./CpuArchitecture";
import { DottedMapCard } from "./DottedMapCard";

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
      </div>
    </section>
  );
}
