"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Star, User, Quote, MessageSquare, Send, Upload, Image as ImageIcon, ShieldCheck } from "lucide-react";

// Predefined avatar options
const predefinedAvatars = [
  "https://i.pravatar.cc/150?img=1",
  "https://i.pravatar.cc/150?img=2",
  "https://i.pravatar.cc/150?img=3",
  "https://i.pravatar.cc/150?img=5",
  "https://i.pravatar.cc/150?img=7",
  "https://i.pravatar.cc/150?u=ananya",
  "https://i.pravatar.cc/150?img=9",
  "https://i.pravatar.cc/150?img=12",
];

const defaultTestimonials = [
  {
    name: "Alex R.",
    country: "Graduate Student",
    type: "Student",
    avatar: "https://i.pravatar.cc/150?img=11",
    feedback: "FLOPs made budgeting feel effortless. The AI recommendations were simple, practical, and easy to follow.",
    rating: 5,
  },
  {
    name: "Sarah L.",
    country: "Marketing Professional",
    type: "Professional",
    avatar: "https://i.pravatar.cc/150?img=5",
    feedback: "I finally understand where my money goes each month. The explainable AI insights make every recommendation easy to trust.",
    rating: 5,
  },
  {
    name: "Daniel K.",
    country: "Software Engineer",
    type: "Engineer",
    avatar: "https://i.pravatar.cc/150?img=3",
    feedback: "Having all my accounts and financial goals in one dashboard has completely changed how I manage my finances.",
    rating: 5,
  },
  {
    name: "Priya M.",
    country: "Product Designer",
    type: "Designer",
    avatar: "https://i.pravatar.cc/150?img=9",
    feedback: "The personalized savings suggestions helped me stay consistent without feeling overwhelmed.",
    rating: 5,
  },
  {
    name: "Ethan C.",
    country: "Business Analyst",
    type: "Analyst",
    avatar: "https://i.pravatar.cc/150?img=8",
    feedback: "Unlike other finance apps, FLOPs explains every recommendation instead of expecting me to trust a black box.",
    rating: 5,
  },
  {
    name: "Maya T.",
    country: "Freelance Consultant",
    type: "Consultant",
    avatar: "https://i.pravatar.cc/150?img=7",
    feedback: "The clean interface and intelligent planning tools make financial management surprisingly enjoyable.",
    rating: 5,
  },
  {
    name: "Jordan W.",
    country: "Small Business Owner",
    type: "Business Owner",
    avatar: "https://i.pravatar.cc/150?img=12",
    feedback: "Secure, transparent, and genuinely useful. FLOPs feels like having a personal financial coach available anytime.",
    rating: 5,
  },
];

const avatars = [
  {
    imageUrl: "https://avatars.githubusercontent.com/u/16860528",
    profileUrl: "https://github.com/dillionverma",
  },
  {
    imageUrl: "https://avatars.githubusercontent.com/u/20110627",
    profileUrl: "https://github.com/tomonarifeehan",
  },
  {
    imageUrl: "https://avatars.githubusercontent.com/u/106103625",
    profileUrl: "https://github.com/BankkRoll",
  },
  {
    imageUrl: "https://avatars.githubusercontent.com/u/59228569",
    profileUrl: "https://github.com/safethecode",
  },
  {
    imageUrl: "https://avatars.githubusercontent.com/u/59442788",
    profileUrl: "https://github.com/sanjay-mali",
  },
  {
    imageUrl: "https://avatars.githubusercontent.com/u/89768406",
    profileUrl: "https://github.com/itsarghyadas",
  },
];

function cn(...classes: Array<string | undefined | null | false>) {
  return classes.filter(Boolean).join(" ");
}

function AvatarCircles({ numPeople, avatarUrls }: { numPeople: number; avatarUrls: { imageUrl: string; profileUrl: string }[] }) {
  return (
    <div className="flex items-center justify-center -space-x-3">
      {avatarUrls.map((avatar, idx) => (
        <a
          key={idx}
          href={avatar.profileUrl}
          target="_blank"
          rel="noreferrer"
          className="h-10 w-10 rounded-full border-2 border-white overflow-hidden hover:z-10 transition-transform hover:scale-110"
        >
          <img src={avatar.imageUrl} alt="" className="h-full w-full object-cover" />
        </a>
      ))}
      {numPeople && (
        <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-black text-xs font-semibold text-white">
          +{numPeople}
        </div>
      )}
    </div>
  );
}

export default function TestimonialCarousel() {
  const [testimonials, setTestimonials] = useState(defaultTestimonials);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    occupation: "",
    primaryUse: "",
    frequency: "",
    feedback: "",
    rating: 5,
    favoriteFeature: "",
    allowPublic: false,
    avatar: null as string | null,
  });

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await fetch("/api/testimonials");
        if (response.ok) {
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const data = await response.json();
            if (data.success && data.data.length > 0) {
              setTestimonials(data.data);
            }
          }
        }
      } catch (error) {
        // Fall back silently to default local testimonials
      }
    };
    fetchTestimonials();
  }, []);

  const row1Testimonials = testimonials.filter((_, i) => i % 2 === 0);
  const row2Testimonials = testimonials.filter((_, i) => i % 2 !== 0);

  const row1All = [...row1Testimonials, ...row1Testimonials];
  const row2All = [...row2Testimonials, ...row2Testimonials];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        if (data.success) {
          setStatusMessage({
            type: "success",
            message: "Thank you! Your feedback helps us build a smarter financial experience for everyone.",
          });
          setFormData({
            name: "",
            occupation: "",
            primaryUse: "",
            frequency: "",
            feedback: "",
            rating: 5,
            favoriteFeature: "",
            allowPublic: false,
            avatar: null,
          });
          setSelectedAvatar(null);
          setCustomImage(null);

          const refreshResponse = await fetch("/api/testimonials");
          const refreshContentType = refreshResponse.headers.get("content-type");
          if (refreshResponse.ok && refreshContentType && refreshContentType.includes("application/json")) {
            const refreshData = await refreshResponse.json();
            if (refreshData.success) {
              setTestimonials(refreshData.data);
            }
          }

          setTimeout(() => {
            setIsModalOpen(false);
            setStatusMessage(null);
          }, 2000);
        } else {
          setStatusMessage({ type: "error", message: data.error || "Failed to submit" });
        }
      } else {
        throw new Error("Response was not JSON");
      }
    } catch (error) {
      console.error("Error submitting testimonial:", error);
      // Fallback add on client side for demo
      const newTestimonial = {
        name: formData.name || "Anonymous",
        country: formData.occupation || "User",
        type: formData.primaryUse || "Feedback",
        avatar: formData.avatar || `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 12 + 1)}`,
        feedback: formData.feedback,
        rating: formData.rating,
      };
      if (formData.allowPublic) {
        setTestimonials((prev) => [newTestimonial, ...prev]);
      }
      setStatusMessage({ type: "success", message: "Thank you! Your feedback helps us build a smarter financial experience for everyone." });
      setTimeout(() => {
        setIsModalOpen(false);
        setStatusMessage(null);
      }, 2000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="testimonials" className="relative w-full relative z-10 pt-10 pb-16 px-6 xl:px-0 mx-auto" style={{ maxWidth: "1200px" }}>
      {/* Header - matching Key Features style exactly */}
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
          <ShieldCheck className="w-[14px] h-[14px] text-[#D46A96]" />
          <span>Trusted by Early Users</span>
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
          Trusted by People Who Value Smarter Finances
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
          Discover how users are simplifying their financial lives with AI-powered insights, personalized planning, and secure financial guidance.
        </p>

        {/* Avatars Circles */}
        <div className="flex flex-col items-center gap-4 mb-12">
          <AvatarCircles numPeople={30} avatarUrls={avatars} />
        </div>
      </div>

      {/* Sliding testmonials marquee (2 rows) */}
      <div className="relative overflow-hidden w-full py-4 mb-8 flex flex-col gap-6">
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[var(--bg-tint)] to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[var(--bg-tint)] to-transparent z-10" />

        {/* Row 1: Sliding Left */}
        <div className="flex animate-marquee hover:pause-marquee" style={{ width: "max-content" }}>
          {row1All.map((testimonial, index) => (
            <div key={`row1-${index}`} className="px-4 flex-shrink-0" style={{ width: "450px" }}>
              <TestimonialCard testimonial={testimonial} />
            </div>
          ))}
        </div>

        {/* Row 2: Sliding Right */}
        <div className="flex animate-marquee-reverse hover:pause-marquee" style={{ width: "max-content" }}>
          {row2All.map((testimonial, index) => (
            <div key={`row2-${index}`} className="px-4 flex-shrink-0" style={{ width: "450px" }}>
              <TestimonialCard testimonial={testimonial} />
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center mt-6">
        <button
          onClick={() => setIsModalOpen(true)}
          className="h-14 px-8 rounded-full bg-[#F6B7CF] text-[#18181B] hover:bg-[#F6B7CF]/90 font-semibold text-base transition-all duration-300 shadow-sm border border-[#F6B7CF] hover:-translate-y-0.5"
          style={{ fontFamily: "var(--font-body)" }}
        >
          Share Your Experience
        </button>
      </div>

      {/* Lightweight Custom Modal */}
      {isModalOpen && mounted && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="relative w-full max-w-[550px] max-h-[85vh] bg-white border border-black/5 rounded-3xl p-8 shadow-xl overflow-hidden flex flex-col animate-scale-up text-left">
            <button
              onClick={() => {
                setIsModalOpen(false);
                setStatusMessage(null);
              }}
              className="absolute top-6 right-6 text-zinc-400 hover:text-zinc-600 font-semibold text-lg"
            >
              ✕
            </button>

            <div className="flex flex-col gap-1 mb-6 pr-6">
              <h3 className="text-2xl font-bold text-zinc-900 flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-[#D46A96]" />
                Share Your FLOPs Experience
              </h3>
              <p className="text-zinc-500 text-sm">
                Tell us how FLOPs helped you manage your finances. Your feedback helps us improve the platform and deliver a better financial experience.
              </p>
            </div>

            <div className="overflow-y-auto flex-1 pr-1 space-y-4">
              {statusMessage && (
                <div
                  className={`p-4 rounded-xl border ${
                    statusMessage.type === "success"
                      ? "bg-[#FFF4F8] border-[#F6B7CF] text-[#D46A96]"
                      : "bg-red-50 border-red-200 text-red-600"
                  } flex items-center gap-3`}
                >
                  <p className="font-medium text-sm">{statusMessage.message}</p>
                </div>
              )}

              {!statusMessage && (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-zinc-700">
                      Overall Experience <span className="text-[#D46A96]">*</span>
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setFormData({ ...formData, rating: star })}
                          className="transition-transform hover:scale-110"
                        >
                          <Star
                            className={`h-8 w-8 cursor-pointer ${
                              star <= formData.rating
                                ? "fill-[#F6B7CF] text-[#F6B7CF]"
                                : "fill-none text-zinc-300 hover:text-zinc-400"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-zinc-700">
                      Profile Image <span className="text-[#D46A96]">*</span>
                    </label>

                    <div className="flex items-center gap-4">
                      <div className="relative w-16 h-16 rounded-2xl border border-zinc-200 bg-zinc-50 overflow-hidden flex items-center justify-center">
                        {customImage || selectedAvatar ? (
                          <img src={customImage || selectedAvatar || ""} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon className="w-6 h-6 text-zinc-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-zinc-500 mb-2">Choose from avatars or upload your own</p>
                        <div className="flex gap-2">
                          <label className="cursor-pointer">
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onloadend = () => {
                                    const base64String = reader.result as string;
                                    setCustomImage(base64String);
                                    setFormData({ ...formData, avatar: base64String });
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                            />
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#FFF4F8] border border-[#F6B7CF] hover:bg-[#FFF4F8]/85 transition-colors text-[#D46A96] text-xs font-semibold">
                              <Upload className="w-3.5 h-3.5" />
                              Upload Image
                            </div>
                          </label>
                          {customImage && (
                            <button
                              type="button"
                              onClick={() => {
                                setCustomImage(null);
                                setFormData({ ...formData, avatar: selectedAvatar });
                              }}
                              className="px-3 py-1.5 text-xs rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 text-red-500 font-semibold"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {!customImage && (
                      <div>
                        <p className="text-[10px] text-zinc-400 uppercase tracking-wider mb-2">Or choose an avatar:</p>
                        <div className="grid grid-cols-8 gap-2">
                          {predefinedAvatars.map((avatar, index) => (
                            <button
                              key={index}
                              type="button"
                              onClick={() => {
                                setSelectedAvatar(avatar);
                                setFormData({ ...formData, avatar });
                              }}
                              className={`w-10 h-10 rounded-xl overflow-hidden border-2 transition-all hover:scale-110 ${
                                selectedAvatar === avatar ? "border-[#F6B7CF] ring-2 ring-[#F6B7CF]/20" : "border-zinc-200 hover:border-zinc-300"
                              }`}
                            >
                              <img src={avatar} alt={`Avatar ${index + 1}`} className="w-full h-full object-cover" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="name" className="text-xs font-semibold text-zinc-700">
                      Your Name <span className="text-[#D46A96]">*</span>
                    </label>
                    <input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:border-[#F6B7CF] text-sm"
                    />
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="occupation" className="text-xs font-semibold text-zinc-700">
                      Occupation <span className="text-[#D46A96]">*</span>
                    </label>
                    <select
                      id="occupation"
                      value={formData.occupation}
                      onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                      required
                      className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-800 focus:outline-none focus:border-[#F6B7CF] text-sm"
                    >
                      <option value="">Select your occupation</option>
                      <option value="Student">Student</option>
                      <option value="Working Professional">Working Professional</option>
                      <option value="Freelancer">Freelancer</option>
                      <option value="Business Owner">Business Owner</option>
                      <option value="Content Creator">Content Creator</option>
                      <option value="Retired">Retired</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="primaryUse" className="text-xs font-semibold text-zinc-700">
                      Primary Use <span className="text-[#D46A96]">*</span>
                    </label>
                    <select
                      id="primaryUse"
                      value={formData.primaryUse}
                      onChange={(e) => setFormData({ ...formData, primaryUse: e.target.value })}
                      required
                      className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-800 focus:outline-none focus:border-[#F6B7CF] text-sm"
                    >
                      <option value="">Select primary use case</option>
                      <option value="Budget Planning">Budget Planning</option>
                      <option value="Expense Tracking">Expense Tracking</option>
                      <option value="Savings Goals">Savings Goals</option>
                      <option value="AI Financial Insights">AI Financial Insights</option>
                      <option value="Investment Tracking">Investment Tracking</option>
                      <option value="Overall Financial Management">Overall Financial Management</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="frequency" className="text-xs font-semibold text-zinc-700">
                      How often do you use FLOPs? <span className="text-[#D46A96]">*</span>
                    </label>
                    <select
                      id="frequency"
                      value={formData.frequency}
                      onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                      required
                      className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-800 focus:outline-none focus:border-[#F6B7CF] text-sm"
                    >
                      <option value="">Select frequency</option>
                      <option value="Daily">Daily</option>
                      <option value="Weekly">Weekly</option>
                      <option value="Monthly">Monthly</option>
                      <option value="Occasionally">Occasionally</option>
                      <option value="This is my first time">This is my first time</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="favoriteFeature" className="text-xs font-semibold text-zinc-700">
                      Favorite Feature <span className="text-zinc-400 font-normal">(Optional)</span>
                    </label>
                    <select
                      id="favoriteFeature"
                      value={formData.favoriteFeature}
                      onChange={(e) => setFormData({ ...formData, favoriteFeature: e.target.value })}
                      className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-800 focus:outline-none focus:border-[#F6B7CF] text-sm"
                    >
                      <option value="">Select a feature</option>
                      <option value="Unified Dashboard">Unified Dashboard</option>
                      <option value="AI Insights">AI Insights</option>
                      <option value="Financial Planning">Financial Planning</option>
                      <option value="Goal Tracking">Goal Tracking</option>
                      <option value="Security">Security</option>
                      <option value="Cross-device Experience">Cross-device Experience</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="feedback" className="text-xs font-semibold text-zinc-700">
                      Share Your Experience <span className="text-[#D46A96]">*</span>
                    </label>
                    <textarea
                      id="feedback"
                      placeholder="Tell us what you liked, what could be improved, or how FLOPs has helped you manage your finances."
                      value={formData.feedback}
                      onChange={(e) => setFormData({ ...formData, feedback: e.target.value })}
                      required
                      rows={3}
                      className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:border-[#F6B7CF] text-sm resize-none"
                    />
                  </div>

                  <div className="flex items-center gap-2 py-1">
                    <input
                      id="allowPublic"
                      type="checkbox"
                      checked={formData.allowPublic}
                      onChange={(e) => setFormData({ ...formData, allowPublic: e.target.checked })}
                      className="w-4 h-4 rounded border-zinc-300 text-[#D46A96] focus:ring-[#F6B7CF]"
                    />
                    <label htmlFor="allowPublic" className="text-xs font-medium text-zinc-600 cursor-pointer">
                      I agree to let FLOPs display my feedback publicly.
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-12 rounded-full bg-[#F6B7CF] text-[#18181B] hover:bg-[#F6B7CF]/90 font-semibold text-base flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Feedback"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}

      <style jsx global>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        @keyframes marquee-reverse {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0);
          }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
        .animate-marquee-reverse {
          animation: marquee-reverse 30s linear infinite;
        }
        .animate-marquee-reverse:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}

function TestimonialCard({ testimonial }: { testimonial: any }) {
  return (
    <div
      className="relative group transition-all duration-500 h-full border border-black/5 bg-white shadow-sm hover:shadow-md hover:-translate-y-1 rounded-3xl overflow-hidden backdrop-blur-sm text-left flex flex-col justify-between"
      style={{ minHeight: "280px" }}
    >
      <div className="absolute top-0 right-0 p-6 text-zinc-100 group-hover:text-[#F6B7CF]/10 transition-colors">
        <Quote className="w-12 h-12 rotate-180" />
      </div>

      <div className="p-8 flex flex-col h-full relative z-10 justify-between flex-grow">
        <div>
          <div className="flex items-center space-x-4 mb-6">
            {testimonial.avatar ? (
              <div className="relative">
                <img
                  src={testimonial.avatar || "/placeholder.svg"}
                  alt={testimonial.name}
                  className="w-14 h-14 rounded-2xl border border-black/5 object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#F6B7CF] rounded-full border-2 border-white" />
              </div>
            ) : (
              <div className="w-14 h-14 rounded-2xl bg-[#FFF4F8] flex items-center justify-center border border-[#F6B7CF]/20">
                <User className="w-7 h-7 text-[#D46A96]" />
              </div>
            )}
            <div>
              <h4 className="font-bold text-zinc-900 text-lg tracking-tight">{testimonial.name}</h4>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#D46A96]">{testimonial.country}</p>
            </div>
          </div>

          <p className="text-zinc-600 text-base leading-relaxed text-pretty flex-grow mb-6 group-hover:text-zinc-900 transition-colors italic">
            &quot;{testimonial.feedback}&quot;
          </p>
        </div>

        <div className="flex justify-between items-center mt-auto pt-6 border-t border-zinc-100">
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-4 w-4 ${star <= (testimonial.rating || 5) ? "fill-[#F6B7CF] text-[#F6B7CF]" : "fill-none text-zinc-200"
                  }`}
              />
            ))}
          </div>
          <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full bg-zinc-50 text-zinc-500 border border-zinc-200 group-hover:border-[#F6B7CF]/30 group-hover:text-[#D46A96] transition-all">
            {testimonial.type}
          </span>
        </div>
      </div>
    </div>
  );
}
