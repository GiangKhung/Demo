"use client";

import { useEffect } from "react";
import { motion, useInView, useAnimation } from "framer-motion";
import { 
  UploadIcon, 
  Share1Icon, 
  LockClosedIcon, 
  UpdateIcon 
} from "@radix-ui/react-icons";

interface HowItWorksSectionProps {
  howItWorksRef: React.RefObject<HTMLElement>;
}

const steps = [
  {
    icon: <UploadIcon className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8" />,
    title: "Tải lên",
    description: "Tải lên tài liệu của bạn với vài cú nhấp chuột. Hỗ trợ nhiều định dạng tệp khác nhau.",
    color: "from-blue-500 to-blue-600",
  },
  {
    icon: <Share1Icon className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8" />,
    title: "Chia sẻ",
    description: "Chia sẻ tài liệu với đồng nghiệp, bạn bè hoặc khách hàng thông qua liên kết bảo mật.",
    color: "from-purple-500 to-purple-600",
  },
  {
    icon: <LockClosedIcon className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8" />,
    title: "Bảo mật",
    description: "Kiểm soát ai có thể xem, chỉnh sửa hoặc tải xuống tài liệu của bạn với các quyền chi tiết.",
    color: "from-indigo-500 to-indigo-600",
  },
  {
    icon: <UpdateIcon className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8" />,
    title: "Cập nhật",
    description: "Quản lý phiên bản tài liệu và theo dõi mọi thay đổi một cách dễ dàng.",
    color: "from-cyan-500 to-cyan-600",
  },
];

export default function HowItWorksSection({ howItWorksRef }: HowItWorksSectionProps) {
  const controls = useAnimation();
  const isInView = useInView(howItWorksRef, { once: true, amount: 0.2 });

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
      ref={howItWorksRef}
      className="py-16 sm:py-20 md:py-24 lg:py-32 bg-zinc-950 relative"
    >
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern opacity-5"></div>
        <div className="absolute -top-20 sm:-top-40 -left-20 sm:-left-40 w-60 sm:w-80 h-60 sm:h-80 bg-blue-500/10 rounded-full blur-[100px]"></div>
        <div className="absolute -bottom-20 sm:-bottom-40 -right-20 sm:-right-40 w-60 sm:w-80 h-60 sm:h-80 bg-purple-500/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12 sm:mb-16 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
              Cách hoạt động
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto text-base sm:text-lg px-2 sm:px-0">
              DocShare giúp bạn chia sẻ và quản lý tài liệu một cách đơn giản, an toàn và hiệu quả.
            </p>
          </motion.div>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-10"
        >
          {steps.map((step, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-xl p-6 sm:p-8 hover:border-zinc-700 hover:shadow-lg hover:shadow-blue-900/5 transition-all duration-300 h-full flex flex-col"
            >
              <div className={`w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-2xl bg-gradient-to-r ${step.color} flex items-center justify-center mb-6 sm:mb-8 mx-auto shadow-lg`}>
                {step.icon}
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-center">{step.title}</h3>
              <p className="text-zinc-400 text-center text-sm sm:text-base md:text-lg">{step.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
