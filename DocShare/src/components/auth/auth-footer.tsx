"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { AuthFooterProps } from "@/types/auth";

export function AuthFooter({ question, linkText, linkHref }: AuthFooterProps) {
  return (
    <motion.div
      className="text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: 0.6,
        delay: 0.5,
      }}
    >
      <p className="text-white/60 text-sm">
        {question}{" "}
        <Link
          href={linkHref}
          className="text-blue-400 hover:text-blue-300 transition-colors duration-300 font-medium"
        >
          {linkText}
        </Link>
      </p>
    </motion.div>
  );
}
