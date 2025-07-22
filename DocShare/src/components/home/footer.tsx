"use client";

import React from "react";
import Image from "next/image";
import FooterLinkGroup from "./footer-link-group";
import SocialLinks from "./social-links";
import NewsletterForm from "./newsletter-form";
import { FooterLinkProps } from "@/types";

const Footer: React.FC = () => {
  // Dữ liệu cho các nhóm liên kết
  const quickLinks: FooterLinkProps[] = [
    { href: "#", label: "Trang chủ" },
    { href: "#", label: "Tài liệu" },
    { href: "#", label: "Đăng tải" },
    { href: "#", label: "Cộng đồng" },
  ];

  const supportLinks: FooterLinkProps[] = [
    { href: "#", label: "FAQ" },
    { href: "#", label: "Điều khoản sử dụng" },
    { href: "#", label: "Chính sách bảo mật" },
    { href: "#", label: "Liên hệ" },
  ];

  // Dữ liệu cho các liên kết mạng xã hội
  const socialLinks = [
    {
      href: "#",
      icon: (
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
        </svg>
      ),
    },
    {
      href: "#",
      icon: (
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      ),
    },
    {
      href: "#",
      icon: (
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
        </svg>
      ),
    },
  ];

  return (
    <footer className="footer py-12 sm:py-16 md:py-20 border-t border-white/10">
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 md:gap-12">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <Image
                src="/logo.svg"
                alt="DocShare logo"
                width={28}
                height={28}
                className="w-7 h-7 sm:w-8 sm:h-8"
                priority
              />
              <span className="text-xl sm:text-2xl font-light tracking-wider">
                DOCSHARE
              </span>
            </div>
            <p className="text-white/60 max-w-xs text-sm sm:text-base">
              Nền tảng chia sẻ tài liệu hàng đầu dành cho cộng đồng học tập và
              nghiên cứu toàn cầu.
            </p>
            <SocialLinks links={socialLinks} />
          </div>

          <div className="sm:col-span-2 lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-8">
            <FooterLinkGroup title="Liên kết nhanh" links={quickLinks} />
            <FooterLinkGroup title="Hỗ trợ" links={supportLinks} />
            <NewsletterForm />
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 sm:mt-12 md:mt-16 pt-6 sm:pt-8 text-center text-white/40 text-xs sm:text-sm">
          <p>
            &copy; {new Date().getFullYear()} DocShare. Tất cả các quyền được
            bảo lưu.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
