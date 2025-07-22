"use client";
import { useEffect, useRef } from "react";
import { AuthInputProps } from "@/types/auth";
import { cn } from "@/lib/utils";

export function AuthInput({
  type,
  id,
  name,
  value,
  onChange,
  label,
  required = false,
}: Omit<AuthInputProps, 'placeholder'>) {
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleFocus = () => {
      wrapperRef.current?.classList.add("focused");
    };

    const handleBlur = (e: FocusEvent) => {
      const target = e.target as HTMLInputElement;
      if (!target.value) {
        wrapperRef.current?.classList.remove("focused");
      }
    };

    const inputElement = inputRef.current;
    if (inputElement) {
      inputElement.addEventListener("focus", handleFocus);
      inputElement.addEventListener("blur", handleBlur);
    }

    return () => {
      if (inputElement) {
        inputElement.removeEventListener("focus", handleFocus);
        inputElement.removeEventListener("blur", handleBlur);
      }
    };
  }, []);

  useEffect(() => {
    // Nếu đã có giá trị, thêm class focused
    if (value) {
      wrapperRef.current?.classList.add("focused");
    }
  }, [value]);

  return (
    <div
      ref={wrapperRef}
      className={cn(
        "field-wrapper relative mb-4 sm:mb-6",
        value ? "focused" : ""
      )}
    >
      <input
        ref={inputRef}
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        className="input-field w-full bg-white/5 border border-white/10 rounded-lg sm:rounded-xl px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-300"
        placeholder=" "
        required={required}
      />
      <label
        htmlFor={id}
        className="absolute left-4 sm:left-6 top-3 sm:top-4 text-sm sm:text-base text-white/60 transition-all duration-200 pointer-events-none"
      >
        {label}
      </label>
      <style jsx>{`
        .field-wrapper.focused label,
        input:focus ~ label,
        input:not(:placeholder-shown) ~ label {
          transform: translateY(-18px) scale(0.8);
          color: rgba(255, 255, 255, 0.8);
        }
        
        @media (min-width: 640px) {
          .field-wrapper.focused label,
          input:focus ~ label,
          input:not(:placeholder-shown) ~ label {
            transform: translateY(-20px) scale(0.8);
          }
        }
      `}</style>
    </div>
  );
}
