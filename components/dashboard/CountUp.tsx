"use client";

import { useEffect, useState } from "react";

interface CountUpProps {
  end: number;
  duration?: number; // duration in ms
  prefix?: string;
  suffix?: string;
  decimals?: number;
  formatter?: (val: number) => string;
}

export default function CountUp({
  end,
  duration = 1500,
  prefix = "",
  suffix = "",
  decimals = 0,
  formatter,
}: CountUpProps) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const currentVal = progress * end;
      setValue(currentVal);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [end, duration]);

  const displayValue = formatter
    ? formatter(value)
    : value.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      });

  return (
    <span>
      {prefix}
      {displayValue}
      {suffix}
    </span>
  );
}
