"use client"

import React from "react"
import { cn } from "@/lib/utils"

interface HamburgerMenuProps {
  isOpen: boolean
  toggle: () => void
  className?: string
}

export function HamburgerMenu({ isOpen, toggle, className }: HamburgerMenuProps) {
  return (
    <button
      className={cn("relative w-10 h-10 flex flex-col justify-center items-center group", className)}
      onClick={toggle}
      aria-label={isOpen ? "Đóng menu" : "Mở menu"}
    >
      <div
        className={cn(
          "w-6 h-0.5 bg-white transition-all duration-300 ease-in-out",
          isOpen ? "rotate-45 translate-y-1.5" : ""
        )}
      />
      <div
        className={cn(
          "w-6 h-0.5 bg-white my-1.5 transition-all duration-300 ease-in-out",
          isOpen ? "opacity-0" : "opacity-100"
        )}
      />
      <div
        className={cn(
          "w-6 h-0.5 bg-white transition-all duration-300 ease-in-out",
          isOpen ? "-rotate-45 -translate-y-1.5" : ""
        )}
      />
    </button>
  )
}
