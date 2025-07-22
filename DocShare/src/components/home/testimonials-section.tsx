"use client";

import { useEffect } from "react";
import { motion, useInView, useAnimation } from "framer-motion";
import TestimonialCard from "./testimonial-card";

interface TestimonialsSectionProps {
  testimonialsRef: React.RefObject<HTMLElement>;
}

const testimonials = [
  {
    content:
      "DocShare đã giúp tôi chia sẻ tài liệu với đồng nghiệp một cách dễ dàng và an toàn. Tôi không còn phải lo lắng về việc gửi email với tệp đính kèm lớn.",
    author: {
      name: "Nguyễn Văn A",
      role: "Giám đốc dự án",
      avatar: "/avatars/avatar-1.png",
    },
    rating: 5,
  },
  {
    content:
      "Tính năng quản lý phiên bản tài liệu thật sự hữu ích. Tôi có thể theo dõi mọi thay đổi và khôi phục phiên bản cũ khi cần thiết.",
    author: {
      name: "Trần Thị B",
      role: "Nhà thiết kế",
      avatar: "/avatars/avatar-2.png",
    },
    rating: 4,
  },
  {
    content:
      "Giao diện người dùng trực quan và dễ sử dụng. Tôi đã giới thiệu DocShare cho toàn bộ nhóm của mình và họ đều yêu thích nó.",
    author: {
      name: "Lê Văn C",
      role: "Quản lý sản phẩm",
      avatar: "/avatars/avatar-3.png",
    },
    rating: 5,
  },
];

export default function TestimonialsSection({ testimonialsRef }: TestimonialsSectionProps) {
  const controls = useAnimation();
  const isInView = useInView(testimonialsRef, { once: true, amount: 0.3 });

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
    hidden: { y: 50, opacity: 0 },
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
      ref={testimonialsRef}
      className="py-16 sm:py-20 md:py-24 lg:py-32 relative overflow-hidden"
    >
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-zinc-950"></div>
        <div className="absolute top-0 left-0 w-full h-full opacity-5 bg-[radial-gradient(#ffffff_1px,transparent_1px)] bg-[size:20px_20px]"></div>
        <div className="absolute top-1/4 left-1/4 w-64 sm:w-80 md:w-96 h-64 sm:h-80 md:h-96 bg-purple-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 sm:w-80 md:w-96 h-64 sm:h-80 md:h-96 bg-blue-500/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12 sm:mb-16 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
              Người dùng nói gì về chúng tôi
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto text-base sm:text-lg px-4 sm:px-0">
              Khám phá trải nghiệm của những người đã sử dụng DocShare để chia sẻ và quản lý tài liệu của họ.
            </p>
          </motion.div>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div key={index} variants={itemVariants} className="h-full">
              <TestimonialCard
                content={testimonial.content}
                author={testimonial.author}
                rating={testimonial.rating}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Additional decorative elements */}
        <div className="mt-12 sm:mt-16 md:mt-20 flex justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="flex items-center space-x-2"
          >
            <span className="block w-2 h-2 rounded-full bg-blue-500"></span>
            <span className="block w-3 h-3 rounded-full bg-purple-500"></span>
            <span className="block w-2 h-2 rounded-full bg-blue-500"></span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
