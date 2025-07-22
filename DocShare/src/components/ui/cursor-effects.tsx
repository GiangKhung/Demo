"use client";

import React from "react";

export const CursorEffects: React.FC = () => {
  return (
    <>
      {/* Cursor follow effect */}
      <div className="cursor-follow fixed w-[50vw] h-[50vh] rounded-full blur-[100px] bg-blue-500/20 pointer-events-none opacity-70 transition-transform duration-[800ms] ease-out -z-10" />
      
      {/* Custom cursor */}
      <div className="cursor-outer fixed w-8 h-8 rounded-full border-2 border-white pointer-events-none opacity-0 z-50 transition-transform duration-200 ease-out"></div>
      <div className="cursor-inner fixed w-2 h-2 rounded-full bg-white pointer-events-none opacity-0 z-50 transition-transform duration-150 ease-out"></div>
      
      {/* Cursor ripple effect */}
      <div className="cursor-ripple fixed pointer-events-none z-40"></div>
      
      {/* Global styles cho hiệu ứng */}
      <style jsx global>{`
        @keyframes blob {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(20px, -30px) scale(1.1);
          }
          50% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          75% {
            transform: translate(-40px, -20px) scale(1.05);
          }
        }

        .animate-blob {
          animation: blob 10s infinite ease-in-out;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        @keyframes scroll {
          0% {
            transform: translateY(0);
            opacity: 1;
          }
          30% {
            opacity: 1;
          }
          100% {
            transform: translateY(8px);
            opacity: 0;
          }
        }

        .animate-scroll {
          animation: scroll 1.5s infinite;
        }

        .animate-in {
          opacity: 1 !important;
          transform: translateY(0) scale(1) !important;
        }
      `}</style>
    </>
  );
};

export default CursorEffects;
