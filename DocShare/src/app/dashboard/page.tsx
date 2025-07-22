"use client";

import { useAuth } from "@/providers/auth-provider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { FiUser, FiFileText, FiActivity, FiPieChart, FiSave, FiUpload } from "react-icons/fi";

export default function DashboardPage() {
  const { user, isLoading, signOut } = useAuth();
  const isAuthenticated = !!user;
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isLoading, isAuthenticated, router]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut();
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error);
      setIsLoggingOut(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-2 border-b-2 border-white mx-auto mb-3 sm:mb-4"></div>
          <p className="text-base sm:text-lg">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-16 sm:pt-20 md:pt-24">
      <main className="container mx-auto px-4 sm:px-6 py-4 sm:py-6">
        <div className="bg-white/5 rounded-lg sm:rounded-xl p-5 sm:p-6 md:p-8 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-4">Xin chào, {user?.name}!</h2>
              <p className="text-white/70 text-sm sm:text-base">
                Bạn đã đăng nhập thành công vào hệ thống DocShare. Đây là trang dashboard của bạn.
              </p>
            </div>
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className={`px-4 py-2 sm:px-6 sm:py-2.5 bg-white/10 hover:bg-white/20 rounded-lg text-sm sm:text-base font-medium transition-colors duration-300 flex items-center ${
                isLoggingOut ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isLoggingOut ? (
                <>
                  <span className="inline-block h-4 w-4 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></span>
                  Đang đăng xuất...
                </>
              ) : (
                "Đăng xuất"
              )}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <Link href="/dashboard/account" className="block">
            <div className="bg-white/5 rounded-lg sm:rounded-xl p-4 sm:p-6 hover:bg-white/10 transition-colors h-full">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-blue-500/20 p-2 rounded-lg">
                  <FiPieChart className="h-5 w-5 text-blue-400" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold">Thống kê tài khoản</h3>
              </div>
              <p className="text-white/70 text-sm sm:text-base">
                Xem thống kê sử dụng tài khoản, dung lượng và hoạt động của bạn.
              </p>
            </div>
          </Link>

          <Link href="/dashboard/account?tab=documents" className="block">
            <div className="bg-white/5 rounded-lg sm:rounded-xl p-4 sm:p-6 hover:bg-white/10 transition-colors h-full">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-purple-500/20 p-2 rounded-lg">
                  <FiSave className="h-5 w-5 text-purple-400" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold">Tài liệu đã lưu</h3>
              </div>
              <p className="text-white/70 text-sm sm:text-base">
                Quản lý các tài liệu đã lưu vào tài khoản của bạn.
              </p>
            </div>
          </Link>

          <Link href="/documents" className="block">
            <div className="bg-white/5 rounded-lg sm:rounded-xl p-4 sm:p-6 hover:bg-white/10 transition-colors h-full">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-green-500/20 p-2 rounded-lg">
                  <FiUpload className="h-5 w-5 text-green-400" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold">Tải lên tài liệu</h3>
              </div>
              <p className="text-white/70 text-sm sm:text-base">
                Tải lên tài liệu mới hoặc tìm kiếm tài liệu công khai.
              </p>
            </div>
          </Link>
        </div>
        
        <div className="mt-6 sm:mt-8">
          <h3 className="text-xl font-semibold mb-4">Thông tin tài khoản</h3>
          <div className="bg-white/5 rounded-lg sm:rounded-xl p-4 sm:p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white/10 p-2 rounded-full">
                <FiUser className="h-6 w-6 text-white/70" />
              </div>
              <div>
                <h4 className="font-medium text-lg">{user?.name}</h4>
                <p className="text-sm text-white/60">{user?.email}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <Link href="/dashboard/account" className="block">
                <div className="bg-white/10 rounded-lg p-3 hover:bg-white/15 transition-colors">
                  <div className="flex items-center gap-3">
                    <FiPieChart className="h-5 w-5 text-blue-400" />
                    <span>Xem thống kê chi tiết</span>
                  </div>
                </div>
              </Link>
              
              <Link href="/documents" className="block">
                <div className="bg-white/10 rounded-lg p-3 hover:bg-white/15 transition-colors">
                  <div className="flex items-center gap-3">
                    <FiFileText className="h-5 w-5 text-green-400" />
                    <span>Quản lý tài liệu</span>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
