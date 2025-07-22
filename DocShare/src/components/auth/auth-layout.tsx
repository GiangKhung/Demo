"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { AuthLayoutProps } from "@/types/auth";

export function AuthLayout({ 
  children, 
  title, 
  subtitle, 
  variant = "login" 
}: AuthLayoutProps) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <div className={`${variant}-page-wrapper min-h-screen bg-black text-white overflow-hidden flex flex-col`}>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12 mt-6 sm:mt-10">
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: loaded ? 1 : 0, y: loaded ? 0 : 20 }}
            transition={{
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1],
              staggerChildren: 0.1,
            }}
            className="space-y-8 sm:space-y-12"
          >
            <div className="text-center">
              <motion.h1
                className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 sm:mb-3 bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/90"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: 0.2,
                }}
              >
                {title}
              </motion.h1>
              <motion.p
                className="text-white/60 text-sm sm:text-base"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  duration: 0.6,
                  delay: 0.3,
                }}
              >
                {subtitle}
              </motion.p>
            </div>

            {children}
          </motion.div>
        </div>
      </main>

      {/* Custom styles */}
      <style jsx>{`
        .field-wrapper.focused label,
        .input-field:not(:placeholder-shown) + label {
          transform: translateY(-20px) scale(0.8);
          color: rgba(255, 255, 255, 0.8);
        }
      `}</style>
    </div>
  );
}
