"use client";

import { useEffect } from "react";
import { motion, useInView, useAnimation } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { RocketIcon, LightningBoltIcon } from "@radix-ui/react-icons";

interface CTASectionProps {
  ctaRef: React.RefObject<HTMLElement>;
}

export default function CTASection({ ctaRef }: CTASectionProps) {
  const controls = useAnimation();
  const isInView = useInView(ctaRef, { once: true, amount: 0.3 });

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [controls, isInView]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <section
      ref={ctaRef}
      className="py-16 sm:py-20 md:py-24 lg:py-32 relative overflow-hidden"
    >
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-zinc-900 to-purple-900/20"></div>
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center opacity-5"></div>
        
        {/* Animated gradient orbs */}
        <div className="absolute -top-20 sm:-top-40 -left-20 sm:-left-40 w-64 sm:w-80 md:w-96 h-64 sm:h-80 md:h-96 bg-blue-600/10 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute -bottom-20 sm:-bottom-40 -right-20 sm:-right-40 w-64 sm:w-80 md:w-96 h-64 sm:h-80 md:h-96 bg-purple-600/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-4xl mx-auto bg-zinc-900/60 backdrop-blur-lg rounded-2xl border border-zinc-800 p-6 sm:p-8 md:p-12 shadow-2xl">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={controls}
            className="text-center"
          >
            <motion.div variants={itemVariants} className="flex justify-center mb-6 sm:mb-8">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                <RocketIcon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
            </motion.div>
            
            <motion.h2
              variants={itemVariants}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500"
            >
              Sẵn sàng bắt đầu chia sẻ tài liệu một cách hiệu quả?
            </motion.h2>
            
            <motion.p
              variants={itemVariants}
              className="text-zinc-400 mb-6 sm:mb-8 md:mb-10 text-base sm:text-lg md:text-xl px-2"
            >
              Đăng ký miễn phí ngay hôm nay và khám phá cách DocShare có thể cải thiện quy trình làm việc của bạn.
            </motion.p>
            
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center"
            >
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg rounded-full shadow-lg shadow-blue-700/20 hover:shadow-blue-700/40 transition-all duration-300"
              >
                <Link href="/register" className="flex items-center gap-2">
                  <LightningBoltIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Đăng ký miễn phí</span>
                </Link>
              </Button>
              
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-zinc-700 hover:bg-zinc-800 h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg rounded-full"
              >
                <Link href="/about">
                  Tìm hiểu thêm
                </Link>
              </Button>
            </motion.div>
            
            <motion.p
              variants={itemVariants}
              className="text-zinc-500 mt-6 sm:mt-8 text-xs sm:text-sm"
            >
              Không cần thẻ tín dụng. Không có cam kết. Hủy bất cứ lúc nào.
            </motion.p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
