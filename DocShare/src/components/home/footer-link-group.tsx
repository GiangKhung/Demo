"use client";

import React from "react";
import { FooterLinkGroupProps } from "@/types";

export const FooterLinkGroup: React.FC<FooterLinkGroupProps> = ({ title, links }) => {
  return (
    <div>
      <h3 className="text-xs sm:text-sm uppercase tracking-widest mb-4 sm:mb-6 font-medium">{title}</h3>
      <ul className="space-y-2 sm:space-y-4">
        {links.map((link, index) => (
          <li key={index}>
            <a
              href={link.href}
              className="text-white/60 hover:text-white transition-colors duration-300 text-sm sm:text-base"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FooterLinkGroup;
