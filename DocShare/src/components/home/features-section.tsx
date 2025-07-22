"use client";

import React from "react";
import FeatureCard from "./feature-card";
import { RiUserSettingsLine, RiFileUploadLine, RiSearchLine } from "react-icons/ri";

export const FeaturesSection: React.FC<{ featuresRef: React.RefObject<HTMLElement> }> = ({ featuresRef }) => {
  return (
    <section id="features" ref={featuresRef} className="py-16 sm:py-20 md:py-32 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(25,65,201,0.15),transparent_70%)] z-0"></div>

      {/* Parallax elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="parallax-element absolute -top-20 -left-20 w-60 sm:w-80 h-60 sm:h-80 rounded-full bg-blue-600/10 blur-3xl"
          data-parallax-speed="-0.2"
        ></div>
        <div
          className="parallax-element absolute top-1/3 -right-20 w-72 sm:w-96 h-72 sm:h-96 rounded-full bg-purple-600/10 blur-3xl"
          data-parallax-speed="0.3"
        ></div>
        <div
          className="parallax-element absolute bottom-0 left-1/4 w-48 sm:w-64 h-48 sm:h-64 rounded-full bg-pink-600/10 blur-3xl"
          data-parallax-speed="-0.1"
        ></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12 sm:mb-16 md:mb-24">
          <h2 className="inline-block text-xs sm:text-sm uppercase tracking-[0.2em] text-white/50 mb-2 sm:mb-4">
            Tính năng nổi bật
          </h2>
          <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/80 leading-tight max-w-5xl mx-auto">
            Khai phá tiềm năng học tập
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-12 lg:gap-16">
          <FeatureCard
            icon={<RiUserSettingsLine className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 text-purple-400 transform group-hover:scale-110 transition-transform duration-500" />}
            title="Giao diện thân thiện, dễ sử dụng"
            description="Thiết kế tối giản, trực quan giúp bạn dễ dàng tìm kiếm, lưu trữ và chia sẻ tài liệu một cách nhanh chóng."
            color="purple"
          />

          <FeatureCard
            icon={<RiFileUploadLine className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 text-pink-400 transform group-hover:scale-110 transition-transform duration-500" />}
            title="Dễ dàng tải lên và chia sẻ"
            description="Chia sẻ tài liệu của bạn với mọi người một cách nhanh chóng và dễ dàng. Hỗ trợ nhiều định dạng tệp khác nhau."
            color="pink"
          />

          <FeatureCard
            icon={<RiSearchLine className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 text-orange-400 transform group-hover:scale-110 transition-transform duration-500" />}
            title="Tìm kiếm và khám phá"
            description="Dễ dàng tìm kiếm tài liệu bạn cần và khám phá những tài liệu mới dựa trên sở thích của bạn."
            color="orange"
          />
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
