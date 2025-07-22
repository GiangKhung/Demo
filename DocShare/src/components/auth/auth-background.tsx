"use client";
import { AuthBackgroundProps } from "@/types/auth";

export function AuthBackground({ variant = "login" }: AuthBackgroundProps) {
  const isLogin = variant === "login";
  
  return (
    <div className="fixed inset-0 z-0">
      <div className="absolute inset-0 bg-[#0c0c0c]"></div>
      <div className={`absolute top-0 left-0 right-0 h-[70vh] bg-gradient-to-b from-${isLogin ? 'blue' : 'purple'}-900/20 to-transparent`}></div>
      <div className={`absolute bottom-0 left-0 right-0 h-[50vh] bg-gradient-to-t from-${isLogin ? 'purple' : 'blue'}-900/20 to-transparent`}></div>

      {/* Animated circles */}
      <div className={`absolute top-1/3 left-1/4 w-[30vw] h-[30vw] rounded-full bg-${isLogin ? 'blue' : 'purple'}-600/10 blur-[100px] animate-pulse-slow`}></div>
      <div className={`absolute top-2/3 right-1/4 w-[25vw] h-[25vw] rounded-full bg-${isLogin ? 'purple' : 'blue'}-600/10 blur-[100px] animate-pulse-slow animation-delay-1000`}></div>

      <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.03] mix-blend-soft-light pointer-events-none"></div>
      
      {/* Custom styles */}
      <style jsx>{`
        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.05);
          }
        }

        .animate-pulse-slow {
          animation: pulse-slow 8s infinite ease-in-out;
        }

        .animation-delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
}
