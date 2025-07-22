"use client";

import React from "react";
import { FaArrowRight } from "react-icons/fa6";
import { FeatureCardProps } from "@/types";

export const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  color,
  linkText = "Xem thêm",
  linkHref = "#",
}) => {
  // Lấy màu dựa trên prop color
  const getColorClasses = () => {
    switch (color) {
      case "purple":
        return {
          bg: "bg-purple-500/20",
          text: "text-purple-400 hover:text-purple-300",
          shadow: "hover:shadow-purple-500/5",
          gradient: "from-purple-600/5",
        };
      case "pink":
        return {
          bg: "bg-pink-500/20",
          text: "text-pink-400 hover:text-pink-300",
          shadow: "hover:shadow-pink-500/5",
          gradient: "from-pink-600/5",
        };
      case "orange":
        return {
          bg: "bg-orange-500/20",
          text: "text-orange-400 hover:text-orange-300",
          shadow: "hover:shadow-orange-500/5",
          gradient: "from-orange-600/5",
        };
      default:
        return {
          bg: "bg-blue-500/20",
          text: "text-blue-400 hover:text-blue-300",
          shadow: "hover:shadow-blue-500/5",
          gradient: "from-blue-600/5",
        };
    }
  };

  const colors = getColorClasses();

  return (
    <div className="feature-card group opacity-0 translate-y-8 transition-all duration-700 perspective">
      <div className="relative h-full transform-style-3d hover:rotate-y-10 hover:rotate-x-10 transition-transform duration-700">
        <div className={`bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 sm:p-8 md:p-10 h-full ${colors.shadow} transition-all duration-500 transform-style-3d`}>
          <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 mb-5 sm:mb-6 md:mb-8 relative">
            <div className={`absolute inset-0 ${colors.bg} rounded-2xl rotate-6 group-hover:rotate-12 transition-transform duration-500 delay-100`}></div>
            <div className="absolute inset-0 bg-black rounded-2xl flex items-center justify-center">
              {icon}
            </div>
          </div>
          <h3 className={`text-xl sm:text-2xl font-medium mb-3 sm:mb-4 group-hover:${colors.text.split(' ')[0]} transition-colors duration-300`}>
            {title}
          </h3>
          <p className="text-white/60 leading-relaxed text-base sm:text-lg">
            {description}
          </p>

          <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-white/5">
            <a
              href={linkHref}
              className={`group inline-flex items-center ${colors.text}`}
            >
              <span className="text-sm sm:text-base">{linkText}</span>
              <FaArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" />
            </a>
          </div>
        </div>

        {/* 3D effect elements */}
        <div className="absolute inset-0 rounded-2xl border border-white/5 transform translate-z-20 pointer-events-none"></div>
        <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${colors.gradient} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-z-10 pointer-events-none`}></div>
      </div>
    </div>
  );
};

export default FeatureCard;
