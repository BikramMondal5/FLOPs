import Image from "next/image";
import Link from "next/link";
// import DigitalBadgesSection from "./DigitalBadgesSection";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/features", label: "Features" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/ai-insights", label: "AI Insights" },
  { href: "/security", label: "Security" },
  { href: "/dashboard", label: "Dashboard" },
];

export default function HeroSection() {
  return (
    <div
      className="grain-overlay relative min-h-screen flex flex-col overflow-hidden"
      style={{ background: "var(--bg-tint)" }}
    >
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero-bg-v2.png"
          alt=""
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(234,240,242,0.55) 0%, transparent 50%, rgba(20,24,27,0.15) 100%)",
          }}
        />
      </div>

      {/* Nav */}
      <nav
        className="relative z-20 mx-auto flex w-full items-center justify-between px-6 xl:px-0"
        style={{ maxWidth: "1200px", height: "72px" }}
      >
        <Link href="/" className="flex items-center gap-2 no-underline z-10 relative">
          <Image
            src="/logo.png"
            alt="FLOPs logo"
            width={32}
            height={32}
            className="h-8 w-8 rounded-full object-contain"
            priority
          />
          <span
            className="font-medium"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "18px",
              color: "var(--ink)",
              letterSpacing: "-0.01em",
            }}
          >
            FLOPs
          </span>
        </Link>

        {/* Center Desktop nav */}
        <div className="absolute inset-0 hidden md:flex items-center justify-center pointer-events-none">
          <div className="flex items-center gap-8 pointer-events-auto">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="no-underline transition-opacity duration-150"
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "15px",
                  color: "var(--ink)",
                  opacity: 0.8,
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center z-10 relative">
          <div className="flex items-center">
            {/* Desktop CTA */}
            <div className="hidden md:flex items-center">
              <Link
                href="/plan"
                className="no-underline cta-lift"
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "15px",
                  fontWeight: 500,
                  color: "white",
                  background: "var(--ink)",
                  borderRadius: "999px",
                  padding: "10px 24px",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
                }}
              >
                Get Started
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button className="md:hidden flex items-center justify-center p-2 rounded-md ml-4">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Content */}
      <section
        className="relative z-10 mx-auto flex w-full flex-col items-center text-center animate-hero px-6 xl:px-0 flex-1 justify-start"
        style={{
          maxWidth: "1200px",
          paddingTop: "10vh",
          paddingBottom: "14vh",
        }}
      >
        {/* Pill badge */}
        <div
          style={{
            background: "var(--surface)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            border: "1px solid rgba(0,0,0,0.06)",
            borderRadius: "999px",
            padding: "8px 20px",
            fontSize: "12px",
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--ink-soft)",
            fontFamily: "var(--font-body)",
            marginBottom: "24px",
          }}
        >
          SMARTER MONEY. BETTER DECISIONS.
        </div>

        {/* Heading */}
        <h1
          style={{
            fontFamily: "var(--font-heading)",
            fontWeight: 400,
            fontSize: "clamp(3rem, 6.5vw, 5.5rem)",
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            color: "var(--ink)",
            marginBottom: "28px",
            maxWidth: "900px",
          }}
        >
          Master your money.
          <br />
          Not your stress.
        </h1>

        {/* Description */}
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "18px",
            lineHeight: 1.6,
            color: "var(--ink-soft)",
            fontWeight: 400,
            maxWidth: "800px",
            textWrap: "balance",
            marginBottom: "40px",
          }}
        >
          FLOPs transforms your financial data into personalized insights, smarter budgets, and AI-powered recommendations—helping you spend wisely, save consistently, and achieve your goals with confidence.
        </p>

        {/* CTA Buttons */}
        <div className="flex items-center justify-center gap-4 flex-col sm:flex-row w-full sm:w-auto mt-2">
          <Link
            href="/plan"
            className="no-underline cta-lift"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "16px",
              fontWeight: 500,
              color: "white",
              background: "var(--ink)",
              borderRadius: "999px",
              padding: "16px 32px",
              boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            Get Started
          </Link>

          <Link
            href="/patterns"
            className="group flex items-center justify-center gap-2 no-underline rounded-full font-semibold transition-all duration-300 ease-in-out hover:-translate-y-0.5"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "16px",
              color: "var(--ink)",
              backgroundColor: "#F6B7CF",
              border: "3px dotted #D46A96",
              padding: "14px 32px",
              boxShadow: "0 4px 16px rgba(246, 183, 207, 0.4)",
            }}
          >
            Explore Features
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-transform duration-300 ease-in-out group-hover:translate-x-1"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Trusted By / Digital Badges Section
      <div className="w-full mt-auto">
        <DigitalBadgesSection />
      </div> */}
    </div>
  );
}
