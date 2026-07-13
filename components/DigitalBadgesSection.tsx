"use client";

import * as React from "react";
import { animate, motion, useMotionValue } from "framer-motion";
import { useCallback, useEffect, useRef } from "react";
import useMeasure from "react-use-measure";

type BadgeItem = {
  id: string;
  name: string;
  image: string;
  variant?: "default" | "md" | "lg";
};

function cn(...classes: Array<string | undefined | null | false>) {
  return classes.filter(Boolean).join(" ");
}

type InfiniteSliderProps = {
  children: React.ReactNode;
  gap?: number;
  duration?: number;
  direction?: "horizontal" | "vertical";
  reverse?: boolean;
  className?: string;
  pauseOnHover?: boolean;
};

function InfiniteSlider({
  children,
  gap = 16,
  duration = 25,
  direction = "horizontal",
  reverse = false,
  className,
  pauseOnHover = false,
}: InfiniteSliderProps) {
  const [ref, { width, height }] = useMeasure();
  const translation = useMotionValue(0);
  const controlsRef = useRef<ReturnType<typeof animate> | null>(null);
  const isPausedRef = useRef(false);

  const getRange = useCallback(() => {
    const size = direction === "horizontal" ? width : height;
    const contentSize = size + gap;
    const from = reverse ? -contentSize / 2 : 0;
    const to = reverse ? 0 : -contentSize / 2;
    return { from, to };
  }, [direction, width, height, gap, reverse]);

  const loopFrom = useCallback(() => {
    const { from, to } = getRange();
    controlsRef.current?.stop();
    translation.set(from);
    controlsRef.current = animate(translation, [from, to], {
      ease: "linear",
      duration,
      repeat: Infinity,
      repeatType: "loop",
      repeatDelay: 0,
    });
  }, [getRange, translation, duration]);

  const resumeFromCurrent = useCallback(() => {
    const { from, to } = getRange();
    const current = translation.get();
    const totalDistance = Math.abs(to - from);
    const remaining = Math.abs(to - current);

    if (remaining < 2) {
      loopFrom();
      return;
    }

    const partialDuration = duration * (remaining / totalDistance);
    controlsRef.current?.stop();
    controlsRef.current = animate(translation, to, {
      ease: "linear",
      duration: partialDuration,
      onComplete: () => {
        if (!isPausedRef.current) loopFrom();
      },
    });
  }, [getRange, translation, duration, loopFrom]);

  useEffect(() => {
    if (width === 0 && height === 0) return;
    loopFrom();
    return () => controlsRef.current?.stop();
  }, [loopFrom, width, height]);

  const handleHoverStart = pauseOnHover
    ? () => {
        isPausedRef.current = true;
        controlsRef.current?.stop();
      }
    : undefined;

  const handleHoverEnd = pauseOnHover
    ? () => {
        isPausedRef.current = false;
        resumeFromCurrent();
      }
    : undefined;

  return (
    <div className={cn("overflow-visible", className)}>
      <motion.div
        ref={ref}
        className="flex w-max py-4"
        style={{
          ...(direction === "horizontal" ? { x: translation } : { y: translation }),
          gap: `${gap}px`,
          flexDirection: direction === "horizontal" ? "row" : "column",
        }}
        onHoverStart={handleHoverStart}
        onHoverEnd={handleHoverEnd}
      >
        {children}
        {children}
      </motion.div>
    </div>
  );
}

export const defaultDigitalBadges: BadgeItem[] = [
  {
    id: "badge1",
    name: "50 Days Badge",
    image: "/My-Digital-Batches/50_Days_Badge.png",
  },
  {
    id: "badge2",
    name: "5th May 2026",
    image: "/My-Digital-Batches/5th-May-2026.png",
  },
  {
    id: "badge3",
    name: "6th June 2026",
    image: "/My-Digital-Batches/6th-june-2026.png",
  },
  {
    id: "badge4",
    name: "ECSoC CA Copper Tier",
    image: "/My-Digital-Batches/ECSoC-CA-copper-tier.png",
  },
  {
    id: "badge5",
    name: "ECSoC CA",
    image: "/My-Digital-Batches/ECSoC-CA.png",
  },
  {
    id: "badge6",
    name: "ECSoC Contributor",
    image: "/My-Digital-Batches/ECSoC-Contributor.png",
  },
  {
    id: "badge7",
    name: "ECSoC Nobita",
    image: "/My-Digital-Batches/ECSoC-Nobita.png",
  },
  {
    id: "badge8",
    name: "AWS Badge Grand Finale",
    image: "/My-Digital-Batches/AWS_Badge_grand_finale.png",
    variant: "lg",
  },
  {
    id: "badge9",
    name: "AWS Prototype Dev Phase",
    image: "/My-Digital-Batches/AWS_Prototype_Dev_Phase.png",
    variant: "lg",
  },
  {
    id: "gssoc1",
    name: "GSSOC Week One",
    image: "/GSSOC-Badges/gssoc-badge-week_one.png",
    variant: "md",
  },
  {
    id: "gssoc2",
    name: "GSSOC Role Contributor",
    image: "/GSSOC-Badges/gssoc-badge-role_contributor.png",
    variant: "md",
  },
  {
    id: "gssoc3",
    name: "GSSOC Rising Star",
    image: "/GSSOC-Badges/gssoc-badge-rising_star.png",
    variant: "md",
  },
  {
    id: "gssoc4",
    name: "GSSOC Profile Complete",
    image: "/GSSOC-Badges/gssoc-badge-profile_complete.png",
    variant: "md",
  },
  {
    id: "gssoc5",
    name: "GSSOC Power Contributor",
    image: "/GSSOC-Badges/gssoc-badge-power_contributor.png",
    variant: "md",
  },
  {
    id: "gssoc6",
    name: "GSSOC Point Scorer",
    image: "/GSSOC-Badges/gssoc-badge-point_scorer.png",
    variant: "md",
  },
  {
    id: "gssoc7",
    name: "GSSOC Getting Started",
    image: "/GSSOC-Badges/gssoc-badge-getting_started.png",
    variant: "md",
  },
  {
    id: "gssoc8",
    name: "GSSOC First Steps",
    image: "/GSSOC-Badges/gssoc-badge-first_steps.png",
    variant: "md",
  },
  {
    id: "gssoc9",
    name: "GSSOC Bounty Master",
    image: "/GSSOC-Badges/gssoc-badge-bounty_master.png",
    variant: "md",
  },
  {
    id: "gssoc10",
    name: "GSSOC Bounty Hunter",
    image: "/GSSOC-Badges/gssoc-badge-bounty_hunter.png",
    variant: "md",
  },
];

export function DigitalBadgesSection({
  heading = "OUR TRUSTED PARTNERS",
  badges = defaultDigitalBadges,
  speed = 30,
}: {
  heading?: string;
  badges?: BadgeItem[];
  speed?: number;
}) {
  return (
    <section className="relative z-10 w-full overflow-x-hidden overflow-y-visible bg-transparent py-1">
      <div className="container mx-auto mb-2 px-4">
        <h2 className="text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-ink-soft opacity-60">
          {heading}
        </h2>
      </div>

      <div className="relative w-full overflow-x-hidden overflow-y-visible py-1">

        <InfiniteSlider gap={32} duration={speed} pauseOnHover className="overflow-visible py-1">
          {badges.map((badge) => (
            <div key={badge.id} className="group flex items-center py-1 transition-all duration-300 ease-out">
              <div
                className={cn(
                  "relative flex items-center justify-center opacity-70 transition-all duration-300 ease-out group-hover:scale-110 group-hover:opacity-100 group-hover:drop-shadow-[0_0_12px_rgba(246,183,207,0.4)]",
                  badge.variant === "lg"
                    ? "h-14 w-14 md:h-16 md:w-16"
                    : badge.variant === "md"
                      ? "h-11 w-11 md:h-13 md:w-13"
                      : "h-10 w-10 md:h-12 md:w-12"
                )}
              >
                <img src={badge.image} alt={badge.name} className="h-full w-full object-contain" />
              </div>
            </div>
          ))}
        </InfiniteSlider>
      </div>
    </section>
  );
}

export default DigitalBadgesSection;
