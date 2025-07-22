"use client";

import React from "react";
import { StatItemProps } from "@/types";

export const StatItem: React.FC<StatItemProps> = ({
  value,
  label,
  color,
  target,
  suffix,
}) => {
  // Lấy màu dựa trên prop color
  const getColorClasses = () => {
    switch (color) {
      case "blue":
        return {
          text: "text-blue-400",
          bg: "from-blue-500/20 to-blue-600/0",
        };
      case "purple":
        return {
          text: "text-purple-400",
          bg: "from-purple-500/20 to-purple-600/0",
        };
      case "pink":
        return {
          text: "text-pink-400",
          bg: "from-pink-500/20 to-pink-600/0",
        };
      case "orange":
        return {
          text: "text-orange-400",
          bg: "from-orange-500/20 to-orange-600/0",
        };
      default:
        return {
          text: "text-blue-400",
          bg: "from-blue-500/20 to-blue-600/0",
        };
    }
  };

  const colors = getColorClasses();

  return (
    <div className="stat-item opacity-0 scale-90 transition-all duration-700 text-center group">
      <div className="relative">
        <div className={`absolute -inset-2 sm:-inset-3 md:-inset-4 rounded-xl bg-gradient-to-br ${colors.bg} opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-700`}></div>
        <div className="relative">
          <span
            className={`counter-animation text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold ${colors.text} tabular-nums`}
            data-target={target}
            data-suffix={suffix}
          >
            {value}
          </span>
          <div className="text-white/60 text-xs sm:text-sm uppercase tracking-widest mt-2 sm:mt-3 md:mt-4 font-medium">
            {label}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatItem;
