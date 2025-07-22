"use client";

import React from "react";
import { SocialLinkProps } from "@/types";

export const SocialLinks: React.FC<{ links: SocialLinkProps[] }> = ({ links }) => {
  return (
    <div className="flex space-x-3 sm:space-x-4 mt-6 sm:mt-8">
      {links.map((link, index) => (
        <a
          key={index}
          href={link.href}
          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-white transition-colors duration-300"
        >
          <span className="w-3.5 h-3.5 sm:w-4 sm:h-4">
            {link.icon}
          </span>
        </a>
      ))}
    </div>
  );
};

export default SocialLinks;
