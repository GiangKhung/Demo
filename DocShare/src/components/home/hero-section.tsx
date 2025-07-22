"use client";

import React from "react";

interface HeroSectionProps {
  howItWorksRef: React.RefObject<HTMLElement | null>;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ howItWorksRef }) => {
  const scrollToHowItWorks = () => {
    howItWorksRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="min-h-screen flex flex-col justify-center relative overflow-hidden pt-20 md:pt-10 mt-10">
      {/* WebGL Canvas Background */}
      <div className="absolute inset-0 -z-10">
        <div id="canvas-container" className="absolute inset-0"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black"></div>
      </div>

      {/* Distortion overlay */}
      <div className="absolute inset-0 bg-noise opacity-5 mix-blend-soft-light"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 gap-8 md:gap-16">
          <div className="space-y-4 md:space-y-8 text-center max-w-5xl mx-auto">
            <div className="relative mb-4 md:mb-6">
              <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-black leading-none uppercase split-text-animation tracking-tighter">
                <div className="overflow-hidden">
                  <span className="inline-block animate-reveal-text-up">
                    Nền tảng
                  </span>
                </div>
                <div className="overflow-hidden">
                  <span className="inline-block animate-reveal-text-up animation-delay-100">
                    chia sẻ tài liệu
                  </span>
                </div>
                <div className="overflow-hidden">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 inline-block animate-reveal-text-up animation-delay-200">
                    hàng đầu.
                  </span>
                </div>
              </h1>

              <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] rounded-full blur-[120px] bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20 opacity-70"></div>
            </div>

            <p className="text-white/70 text-base sm:text-lg md:text-xl lg:text-2xl max-w-2xl mx-auto leading-relaxed font-light px-4 sm:px-0">
              Truy cập hàng ngàn tài liệu chất lượng, chia sẻ kiến thức và kết
              nối với cộng đồng học tập toàn cầu.
            </p>

            <div className="flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-6 justify-center pt-6 md:pt-8">
              <button
                onClick={scrollToHowItWorks}
                className="magnetic-button group relative px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 overflow-hidden rounded-full w-full sm:w-auto"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-90 group-hover:opacity-100 transition-opacity duration-500"></span>
                <span className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-[radial-gradient(circle,_white_10%,_transparent_70%)] transition-opacity duration-500"></span>
                <span className="relative z-10 text-white text-base sm:text-lg uppercase tracking-wider font-medium">
                  Khám phá ngay
                </span>
              </button>

              <a
                href="/auth/login"
                className="magnetic-button group relative px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 overflow-hidden rounded-full w-full sm:w-auto"
              >
                <span className="absolute inset-0 border-2 border-white/30 group-hover:border-white/60 rounded-full transition-colors duration-500"></span>
                <span className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-white transition-opacity duration-500"></span>
                <span className="relative z-10 text-white/90 text-base sm:text-lg uppercase tracking-wider font-medium">
                  Đăng nhập
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="hidden md:block absolute bottom-5 right-5">
          <div className="flex flex-col items-center space-y-4">
            <span className="text-white/40 text-xs uppercase tracking-widest">
              Cuộn xuống
            </span>
            <div className="mouse-scroll-indicator">
              <div className="mouse border-2 border-white/30 w-8 h-14 rounded-full flex justify-center p-1">
                <div className="scroller bg-white/70 w-1 h-3 rounded-full animate-scroll"></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Mobile scroll indicator */}
        <div className="flex md:hidden justify-center mt-12 mb-4">
          <div className="flex flex-col items-center space-y-2">
            <span className="text-white/40 text-xs uppercase tracking-widest">
              Cuộn xuống
            </span>
            <div className="w-6 h-10 flex justify-center">
              <div className="w-0.5 h-6 bg-white/30 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
