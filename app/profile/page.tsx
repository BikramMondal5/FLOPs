"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import Navbar from "@/components/common/Navbar";
import {
  Menu,
  X,
  Brain,
  User,
  Settings,
  Shield,
  Bell,
  Palette,
  Eye,
  History,
} from "lucide-react";

import Sidebar from "@/components/dashboard/Sidebar";
import ProfileHero from "@/components/profile/ProfileHero";
import AccountOverview from "@/components/profile/AccountOverview";
import PersonalInformation from "@/components/profile/PersonalInformation";
import FinancialPreferences from "@/components/profile/FinancialPreferences";
import ConnectedAccountsSummary from "@/components/profile/ConnectedAccountsSummary";
import Achievements from "@/components/profile/Achievements";
import SecuritySettings from "@/components/profile/SecuritySettings";
import NotificationPreferences from "@/components/profile/NotificationPreferences";
import AppearanceSettings from "@/components/profile/AppearanceSettings";
import PrivacySettings from "@/components/profile/PrivacySettings";
import ActivityTimeline from "@/components/profile/ActivityTimeline";
import GlobalBrainAssistant from "@/components/dashboard/GlobalBrainAssistant";

type SettingTab = "Personal" | "Financial" | "Security" | "Notifications" | "Appearance" | "Privacy" | "Activity";

export default function ProfilePage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<SettingTab>("Personal");
  const [aiOpen, setAiOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState({ x: -9999, y: -9999, active: false });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMouse({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true,
    });
  };

  const handleMouseLeave = () => {
    setMouse({ x: -9999, y: -9999, active: false });
  };

  // Stagger configurations
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  } as const;

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120, damping: 14 } },
  } as const;

  // Tabs metadata
  const tabsList: { id: SettingTab; label: string; icon: any }[] = [
    { id: "Personal", label: "Personal Info", icon: User },
    { id: "Financial", label: "Financial Info", icon: Settings },
    { id: "Security", label: "Security Settings", icon: Shield },
    { id: "Notifications", label: "Notifications", icon: Bell },
    { id: "Appearance", label: "Appearance", icon: Palette },
    { id: "Privacy", label: "Privacy", icon: Eye },
    { id: "Activity", label: "Account Activity", icon: History },
  ];

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="min-h-screen relative overflow-hidden flex flex-col"
      style={{
        backgroundColor: "#FCFCFD",
        backgroundImage: `
          linear-gradient(to right, rgba(246, 183, 207, 0.04) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(246, 183, 207, 0.04) 1px, transparent 1px)
        `,
        backgroundSize: "32px 32px",
        // @ts-ignore
        "--cx": `${mouse.x}px`,
        // @ts-ignore
        "--cy": `${mouse.y}px`,
      }}
    >
      {/* Masked Cursor Glow */}
      {mouse.active && (
        <div
          className="absolute inset-0 pointer-events-none z-[1] transition-opacity duration-300"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(246, 183, 207, 0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(246, 183, 207, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: "32px 32px",
            WebkitMaskImage: "radial-gradient(circle 240px at var(--cx) var(--cy), #000 0%, #000 40%, transparent 100%)",
            maskImage: "radial-gradient(circle 240px at var(--cx) var(--cy), #000 0%, #000 40%, transparent 100%)",
          }}
        />
      )}

      {/* Background radial soft pink glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full pointer-events-none z-0 bg-radial from-[#F6B7CF]/10 to-transparent filter blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[55vw] h-[55vw] rounded-full pointer-events-none z-0 bg-radial from-[#F9DCE7]/15 to-transparent filter blur-[140px]" />

      <Navbar
        userInfo={{
          name: session?.user?.name,
          email: session?.user?.email,
          image: session?.user?.image,
        }}
      />

      {/* Main Grid Layout Container with top padding for fixed navbar */}
      <div className="flex-1 w-full max-w-[1600px] mx-auto px-8 pb-12 pt-28 relative z-10 flex flex-col lg:flex-row gap-6 md:gap-8">
        
        {/* Desktop Sidebar (Left) - Sticky! */}
        <div className="hidden lg:block z-20 sticky top-[88px] w-[280px] h-[calc(100vh-120px)] shrink-0">
          <Sidebar />
        </div>

        {/* Mobile Drawer Navigation */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden bg-black/10 backdrop-blur-sm">
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="h-full w-[280px]"
            >
              <Sidebar onCloseMobile={() => setMobileMenuOpen(false)} />
            </motion.div>
            <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
          </div>
        )}

        {/* Main Workspace Column */}
        <div className="flex-grow flex flex-col gap-6 z-10 min-w-0">
          {/* Header section with actions */}
          <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* Mobile Drawer Trigger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden w-10 h-10 bg-white border border-[#F6B7CF]/15 rounded-xl flex items-center justify-center text-[#18181B] shadow-sm hover:bg-[#FFF4F8] transition-colors"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              <div>
                <h1
                  className="text-4xl md:text-5xl font-normal text-[#18181B] m-0 tracking-tight leading-none"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Profile
                </h1>
                <p className="text-[13px] text-[#6B7280] mt-1.5 m-0 max-w-[420px]">
                  Manage your account, personalize your experience, and keep your information secure.
                </p>
              </div>
            </div>

            {/* Actions Panel */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => alert("Changes discarded.")}
                className="text-xs font-semibold py-2 px-3 bg-white border border-[#F6B7CF]/30 text-[#D46A96] hover:bg-[#FFF4F8] rounded-full transition-colors cursor-pointer"
              >
                <span>Edit Profile</span>
              </button>
              <button
                onClick={() => alert("All modifications saved successfully.")}
                className="text-xs font-semibold py-2.5 px-4 bg-[#18181B] text-white hover:bg-zinc-800 rounded-full transition-colors cursor-pointer"
              >
                <span>Save Changes</span>
              </button>
            </div>
          </header>

          <motion.main
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="flex flex-col gap-8"
          >
            {/* Identity Hero */}
            <motion.div variants={itemVariants}>
              <ProfileHero />
            </motion.div>

            {/* Metrics overview snapshot KPIs */}
            <motion.div variants={itemVariants}>
              <AccountOverview />
            </motion.div>

            {/* Horizontal segmented tab switcher */}
            <motion.div variants={itemVariants} className="w-full">
              <div className="flex flex-wrap gap-2 p-1.5 bg-[#FFF4F8] border border-[#F6B7CF]/15 rounded-[24px] shadow-sm">
                {tabsList.map((tb) => {
                  const TabIcon = tb.icon;
                  const active = activeTab === tb.id;
                  return (
                    <button
                      key={tb.id}
                      onClick={() => setActiveTab(tb.id)}
                      className={`flex-grow flex items-center justify-center gap-2 text-xs font-semibold py-2.5 px-4 rounded-xl transition-all cursor-pointer ${
                        active
                          ? "bg-[#D46A96] text-white shadow-[0_4px_12px_rgba(212,106,150,0.15)]"
                          : "text-[#6B7280] hover:text-[#18181B] hover:bg-white/40"
                      }`}
                    >
                      <TabIcon className="w-4 h-4 shrink-0" />
                      <span>{tb.label}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>

            {/* Tab Body layout switcher */}
            <motion.div variants={itemVariants} className="w-full min-h-[300px]">
              <AnimatePresence mode="wait">
                {activeTab === "Personal" && (
                  <motion.div
                    key="PersonalTab"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <PersonalInformation />
                  </motion.div>
                )}

                {activeTab === "Financial" && (
                  <motion.div
                    key="FinancialTab"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8"
                  >
                    <FinancialPreferences />
                    <ConnectedAccountsSummary />
                  </motion.div>
                )}

                {activeTab === "Security" && (
                  <motion.div
                    key="SecurityTab"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <SecuritySettings />
                  </motion.div>
                )}

                {activeTab === "Notifications" && (
                  <motion.div
                    key="NotificationsTab"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <NotificationPreferences />
                  </motion.div>
                )}

                {activeTab === "Appearance" && (
                  <motion.div
                    key="AppearanceTab"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <AppearanceSettings />
                  </motion.div>
                )}

                {activeTab === "Privacy" && (
                  <motion.div
                    key="PrivacyTab"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <PrivacySettings />
                  </motion.div>
                )}

                {activeTab === "Activity" && (
                  <motion.div
                    key="ActivityTab"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8"
                  >
                    <Achievements />
                    <ActivityTimeline />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

          </motion.main>
        </div>
      </div>

      {/* Reusable Global AI Brain Assistant Drawer */}
      <AnimatePresence>
        {aiOpen && (
          <GlobalBrainAssistant
            isOpen={aiOpen}
            onClose={() => setAiOpen(false)}
            currentPageName="Overview"
            onSelectSuggestion={(sug) => alert(`AI Analysis Triggered: "${sug}"`)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
