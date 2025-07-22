"use client";

import React from "react";
import StatItem from "./stat-item";

export const StatsSection: React.FC<{ statsRef: React.RefObject<HTMLElement> }> = ({ statsRef }) => {
  return (
    <section ref={statsRef} className="py-16 sm:py-20 md:py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-blue-950/10 to-black/0"></div>
      <div className="container mx-auto px-4 sm:px-6 md:px-8 relative">
        <div className="max-w-screen-xl mx-auto">
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
              Số liệu ấn tượng
            </h2>
            <div className="w-16 sm:w-20 md:w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-4 sm:mt-6"></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 sm:gap-x-8 md:gap-x-12 gap-y-10 sm:gap-y-12 md:gap-y-16">
            <StatItem
              value="20+"
              label="Tài liệu"
              color="blue"
              target="10000"
              suffix="+"
            />

            <StatItem
              value="5+"
              label="Thành viên"
              color="purple"
              target="5000"
              suffix="+"
            />

            <StatItem
              value="3+"
              label="Lĩnh vực"
              color="pink"
              target="200"
              suffix="+"
            />

            <StatItem
              value="5+"
              label="Đánh giá"
              color="orange"
              target="4.8"
              suffix=" / 5"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
