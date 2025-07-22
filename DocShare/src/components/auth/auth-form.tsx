"use client";
import { motion } from "framer-motion";
import { AuthFormProps } from "@/types/auth";

export function AuthForm({ children, onSubmit }: AuthFormProps) {
  return (
    <motion.form
      onSubmit={onSubmit}
      className="space-y-6 sm:space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: 0.6,
        delay: 0.4,
      }}
    >
      {children}
    </motion.form>
  );
}
