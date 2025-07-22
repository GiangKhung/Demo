"use client";

interface AuthDividerProps {
  text: string;
}

export function AuthDivider({ text }: AuthDividerProps) {
  return (
    <div className="relative flex items-center justify-center">
      <div className="flex-grow h-px bg-white/10"></div>
      <span className="flex-shrink-0 mx-4 text-white/40 text-sm">
        {text}
      </span>
      <div className="flex-grow h-px bg-white/10"></div>
    </div>
  );
}
