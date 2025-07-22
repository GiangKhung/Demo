"use client";

import React from "react";

export const NewsletterForm: React.FC = () => {
  return (
    <div>
      <h3 className="text-xs sm:text-sm uppercase tracking-widest mb-3 sm:mb-6 font-medium">
        Đăng ký nhận tin
      </h3>
      <p className="text-white/60 mb-3 sm:mb-4 text-sm sm:text-base">
        Nhận thông báo về tài liệu mới và tin tức hàng tuần.
      </p>
      <form className="space-y-2 sm:space-y-3">
        <div>
          <input
            type="email"
            placeholder="Email của bạn"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-white placeholder-white/40 focus:outline-none focus:border-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 transition-colors duration-300 text-white py-2 sm:py-3 rounded-lg text-xs sm:text-sm uppercase tracking-widest"
        >
          Đăng ký
        </button>
      </form>
    </div>
  );
};

export default NewsletterForm;
