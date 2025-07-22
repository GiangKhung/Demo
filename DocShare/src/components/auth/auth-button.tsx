"use client";
import { AuthButtonProps } from "@/types/auth";
import { cn } from "@/lib/utils";

export function AuthButton({
  type = "button",
  onClick,
  children,
  fullWidth = true,
  variant = "primary",
  className,
  disabled,
}: AuthButtonProps) {
  const baseClasses = "rounded-lg sm:rounded-xl py-3 sm:py-4 text-sm sm:text-base font-medium tracking-wide transition-all duration-300 relative overflow-hidden group";
  
  const variantClasses = {
    primary: "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg hover:shadow-blue-500/20",
    secondary: "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-lg hover:shadow-purple-500/20",
    outline: "border border-white/10 text-white/80 hover:bg-white/5"
  };

  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : "";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        baseClasses,
        variantClasses[variant],
        fullWidth ? "w-full" : "",
        disabledClasses,
        className
      )}
    >
      <span className="relative z-10">{children}</span>
      {variant !== "outline" && !disabled && (
        <span className={`absolute inset-0 bg-gradient-to-r ${
          variant === "primary" 
            ? "from-blue-700 to-purple-700" 
            : "from-purple-700 to-blue-700"
        } opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></span>
      )}
    </button>
  );
}
