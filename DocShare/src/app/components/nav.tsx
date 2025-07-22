"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { HamburgerMenu } from "@/components/ui/hamburger-menu";
import { Twitter, Instagram, Linkedin } from "lucide-react";

export default function () {
  const [scrolled, setScrolled] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const router = useRouter();
  const { user, isLoading, signOut } = useAuth();
  const isAuthenticated = !!user;

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut();
      router.push("/");
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error);
    }
  };

  const handleigation = (path: string) => {
    router.push(path);
    setSheetOpen(false);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "py-4 backdrop-blur-md bg-black/20" : "py-8"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div
              className="flex items-center gap-2 sm:gap-4 cursor-pointer"
              onClick={() => router.push("/")}
            >
              <div className="magnetic-element">
                <Image
                  className="hover:rotate-12 transition-transform duration-300 w-8 h-8 sm:w-10 sm:h-10"
                  src="/logo.svg"
                  alt="DocShare logo"
                  width={40}
                  height={40}
                  priority
                />
              </div>
              <span className="text-xl sm:text-2xl font-light tracking-widest">
                DOCSHARE
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex space-x-8 xl:space-x-12">
              <div
                onClick={() => router.push("/")}
                className="text-white/70 hover:text-white text-base uppercase tracking-widest transition-colors duration-300 py-2 relative magnetic-link cursor-pointer"
              >
                <span className="split-hover-text">Trang chủ</span>
                <span className="absolute left-0 right-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-white to-transparent scale-x-0 hover:scale-x-100 transition-transform duration-300 origin-center"></span>
              </div>
              <div
                onClick={() => router.push("/documents")}
                className="text-white/70 hover:text-white text-base uppercase tracking-widest transition-colors duration-300 py-2 relative magnetic-link cursor-pointer"
              >
                <span className="split-hover-text">Tài liệu</span>
                <span className="absolute left-0 right-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-white to-transparent scale-x-0 hover:scale-x-100 transition-transform duration-300 origin-center"></span>
              </div>
              <div
                onClick={() => router.push("/features")}
                className="text-white/70 hover:text-white text-base uppercase tracking-widest transition-colors duration-300 py-2 relative magnetic-link cursor-pointer"
              >
                <span className="split-hover-text">Tính năng</span>
                <span className="absolute left-0 right-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-white to-transparent scale-x-0 hover:scale-x-100 transition-transform duration-300 origin-center"></span>
              </div>
              <div
                onClick={() => router.push("/contact")}
                className="text-white/70 hover:text-white text-base uppercase tracking-widest transition-colors duration-300 py-2 relative magnetic-link cursor-pointer"
              >
                <span className="split-hover-text">Liên hệ</span>
                <span className="absolute left-0 right-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-white to-transparent scale-x-0 hover:scale-x-100 transition-transform duration-300 origin-center"></span>
              </div>
            </nav>

            {/* Desktop Auth Buttons */}
            <div className="hidden lg:flex items-center space-x-6">
              {!isAuthenticated ? (
                <>
                  <button
                    onClick={() => router.push("/auth/login")}
                    className="text-white/80 hover:text-white text-base uppercase tracking-widest transition-colors duration-300 magnetic-button"
                  >
                    Đăng nhập
                  </button>
                  <button
                    onClick={() => router.push("/auth/register")}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-2 px-6 rounded-full transition-all duration-300 transform hover:scale-105 magnetic-button"
                  >
                    Đăng ký
                  </button>
                </>
              ) : (
                <div
                  onClick={() => router.push("/dashboard")}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  {user?.image ? (
                    <Image
                      src={user.image}
                      alt={user.name || "Người dùng"}
                      width={40}
                      height={40}
                      className="rounded-full border-2 border-transparent group-hover:border-white/30 transition-all duration-300"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-lg border-2 border-transparent group-hover:border-white/30 transition-all duration-300">
                      {user?.name?.charAt(0) || "U"}
                    </div>
                  )}
                  <span className="text-white/80 group-hover:text-white transition-colors duration-300">
                    {user?.name || "Người dùng"}
                  </span>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                <SheetTrigger asChild>
                  <div className="cursor-pointer">
                    <HamburgerMenu
                      isOpen={sheetOpen}
                      toggle={() => setSheetOpen(!sheetOpen)}
                    />
                  </div>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="w-full sm:w-80 bg-gradient-to-b from-gray-900 to-black border-l border-white/10 p-0"
                >
                  <div className="flex flex-col h-full">
                    {/* Mobile Menu Header */}
                    <div className="p-6 border-b border-white/10">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Image
                            src="/logo.svg"
                            alt="DocShare logo"
                            width={32}
                            height={32}
                          />
                          <span className="text-xl font-light tracking-widest">
                            DOCSHARE
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Mobile Menu Content */}
                    <div className="flex-1 overflow-y-auto py-6 px-6">
                      {/* Navigation Links */}
                      <nav className="flex flex-col space-y-6 mb-8">
                        <div
                          onClick={() => handleigation("/")}
                          className="text-white/70 hover:text-white text-lg uppercase tracking-widest transition-colors duration-300 py-2 relative cursor-pointer"
                        >
                          Trang chủ
                        </div>
                        <div
                          onClick={() => handleigation("/tai-lieu")}
                          className="text-white/70 hover:text-white text-lg uppercase tracking-widest transition-colors duration-300 py-2 relative cursor-pointer"
                        >
                          Tài liệu
                        </div>
                        <div
                          onClick={() => handleigation("/tinh-nang")}
                          className="text-white/70 hover:text-white text-lg uppercase tracking-widest transition-colors duration-300 py-2 relative cursor-pointer"
                        >
                          Tính năng
                        </div>
                        <div
                          onClick={() => handleigation("/lien-he")}
                          className="text-white/70 hover:text-white text-lg uppercase tracking-widest transition-colors duration-300 py-2 relative cursor-pointer"
                        >
                          Liên hệ
                        </div>
                      </nav>

                      {/* Auth Buttons */}
                      <div className="space-y-4 mb-8">
                        {!isAuthenticated ? (
                          <>
                            <button
                              onClick={() => handleigation("/auth/login")}
                              className="w-full text-center bg-white/10 hover:bg-white/20 text-white py-3 px-6 rounded-lg transition-colors duration-300"
                            >
                              Đăng nhập
                            </button>
                            <button
                              onClick={() => handleigation("/auth/register")}
                              className="w-full text-center bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 px-6 rounded-lg transition-all duration-300"
                            >
                              Đăng ký
                            </button>
                          </>
                        ) : (
                          <div className="bg-white/5 rounded-lg p-4 flex flex-col items-center">
                            {user?.image ? (
                              <Image
                                src={user.image}
                                alt={user.name || "Người dùng"}
                                width={64}
                                height={64}
                                className="rounded-full mb-3"
                              />
                            ) : (
                              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl mb-3">
                                {user?.name?.charAt(0) || "U"}
                              </div>
                            )}
                            <span className="text-white text-lg mb-3">
                              {user?.name || "Người dùng"}
                            </span>
                            <div className="flex space-x-3 w-full">
                              <button
                                onClick={() => handleigation("/dashboard")}
                                className="flex-1 bg-white/10 hover:bg-white/20 text-white py-2 px-4 rounded-lg transition-colors duration-300"
                              >
                                Dashboard
                              </button>
                              <button
                                onClick={handleLogout}
                                className="flex-1 bg-white/10 hover:bg-white/20 text-white py-2 px-4 rounded-lg transition-colors duration-300"
                              >
                                Đăng xuất
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Social Links */}
                      <div className="flex justify-center space-x-6">
                        <a
                          href="#"
                          className="text-white/70 hover:text-blue-400 transition-colors duration-300"
                        >
                          <Twitter className="h-6 w-6" />
                        </a>
                        <a
                          href="#"
                          className="text-white/70 hover:text-pink-400 transition-colors duration-300"
                        >
                          <Instagram className="h-6 w-6" />
                        </a>
                        <a
                          href="#"
                          className="text-white/70 hover:text-blue-400 transition-colors duration-300"
                        >
                          <Linkedin className="h-6 w-6" />
                        </a>
                      </div>
                    </div>

                    {/* Mobile Menu Footer */}
                    <div className="p-6 border-t border-white/10">
                      <p className="text-white/50 text-sm text-center">
                        2025 DocShare. Tất cả các quyền được bảo lưu.
                      </p>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
