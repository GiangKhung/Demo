"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/providers/auth-provider";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { UserStats, Document, UserActivity } from "@/types";
import { userService } from "@/lib/user-service";
import AccountStorageChart from "@/components/dashboard/AccountStorageChart";
import AccountDocumentTypeChart from "@/components/dashboard/AccountDocumentTypeChart";
import AccountActivityList from "@/components/dashboard/AccountActivityList";
import SavedDocumentList from "@/components/dashboard/SavedDocumentList";
import { formatBytes, formatDate } from "@/lib/utils";

export default function AccountPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [savedDocuments, setSavedDocuments] = useState<Document[]>([]);
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/login");
    }
  }, [isLoading, user, router]);

  useEffect(() => {
    // Biến để kiểm soát việc gọi API nhiều lần
    let isMounted = true;
    let retryCount = 0;
    const MAX_RETRIES = 3;

    const loadUserStats = async () => {
      if (!user || !isMounted) return;

      try {
        setIsLoadingStats(true);

        // Gọi API getUserStats với xử lý lỗi tốt hơn
        try {
          const stats = await userService.getUserStats();
          if (isMounted) {
            setUserStats(stats);
          }
        } catch (statsError) {
          console.error("Lỗi khi tải thống kê tài khoản:", statsError);
          // Vẫn tiếp tục để lấy danh sách tài liệu đã lưu
        }

        // Gọi API getBookmarks với xử lý lỗi riêng
        try {
          const bookmarks = await userService.getBookmarks();
          // Convert bookmarks to documents format
          const documents = bookmarks.map((bookmark) => bookmark.document);
          if (isMounted) {
            setSavedDocuments(documents);
          }
        } catch (docsError) {
          console.error("Lỗi khi tải danh sách tài liệu đã lưu:", docsError);
        }
      } catch (error) {
        console.error("Lỗi tổng thể khi tải dữ liệu:", error);

        // Thử lại nếu chưa đạt số lần tối đa
        if (isMounted && retryCount < MAX_RETRIES) {
          retryCount++;
          console.log(`Thử lại lần ${retryCount}/${MAX_RETRIES}...`);
          // Không gọi đệ quy, chỉ đặt trạng thái
        }
      } finally {
        if (isMounted) {
          setIsLoadingStats(false);
        }
      }
    };

    if (user) {
      loadUserStats();
    }

    // Hàm cleanup để tránh memory leak và vòng lặp vô hạn
    return () => {
      isMounted = false;
    };
  }, [user]);

  if (isLoading || !user) {
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
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">
            Thống kê tài khoản
          </h1>
          <p className="text-white/70">
            Quản lý tài liệu và xem thống kê sử dụng tài khoản của bạn
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card className="bg-white/5 border-white/10 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Tổng tài liệu</CardTitle>
              <CardDescription className="text-white/60">
                Tài liệu đã tải lên và đã lưu
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {isLoadingStats ? "-" : userStats?.totalDocuments || 0}
              </div>
              <div className="text-xs text-white/60 mt-1">
                <span className="text-blue-400">
                  {isLoadingStats ? "-" : userStats?.uploadedDocuments || 0}
                </span>{" "}
                đã tải lên ·
                <span className="text-purple-400 ml-1">
                  {isLoadingStats ? "-" : userStats?.savedDocuments || 0}
                </span>{" "}
                đã lưu
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Dung lượng sử dụng</CardTitle>
              <CardDescription className="text-white/60">
                Dung lượng lưu trữ đã sử dụng
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {isLoadingStats
                  ? "-"
                  : formatBytes(userStats?.usedStorage || 0)}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Progress
                  value={
                    isLoadingStats
                      ? 0
                      : ((userStats?.usedStorage || 0) /
                          (userStats?.totalStorage || 1)) *
                        100
                  }
                  className="h-2 bg-white/10"
                />
                <span className="text-xs text-white/60">
                  {isLoadingStats
                    ? "-"
                    : Math.round(
                        ((userStats?.usedStorage || 0) /
                          (userStats?.totalStorage || 1)) *
                          100
                      )}
                  %
                </span>
              </div>
              <div className="text-xs text-white/60 mt-1">
                {isLoadingStats
                  ? "-"
                  : formatBytes(userStats?.usedStorage || 0)}{" "}
                /{" "}
                {isLoadingStats
                  ? "-"
                  : formatBytes(userStats?.totalStorage || 0)}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Hoạt động gần đây</CardTitle>
              <CardDescription className="text-white/60">
                Hoạt động mới nhất của bạn
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingStats ? (
                <div className="animate-pulse h-6 bg-white/10 rounded"></div>
              ) : userStats?.recentActivities &&
                userStats.recentActivities.length > 0 ? (
                <div className="text-sm">
                  <div className="text-white/80">
                    {userStats.recentActivities[0].description}
                  </div>
                  <div className="text-xs text-white/60 mt-1">
                    {formatDate(
                      new Date(userStats.recentActivities[0].createdat)
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-sm text-white/60">
                  Chưa có hoạt động nào
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="bg-white/5 text-white mb-6">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-white/10"
            >
              Tổng quan
            </TabsTrigger>
            <TabsTrigger
              value="documents"
              className="data-[state=active]:bg-white/10"
            >
              Tài liệu đã lưu
            </TabsTrigger>
            <TabsTrigger
              value="activities"
              className="data-[state=active]:bg-white/10"
            >
              Lịch sử hoạt động
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/5 border-white/10 text-white">
                <CardHeader>
                  <CardTitle>Sử dụng dung lượng</CardTitle>
                  <CardDescription className="text-white/60">
                    Phân bổ dung lượng lưu trữ theo loại tài liệu
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingStats ? (
                    <div className="h-64 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-white"></div>
                    </div>
                  ) : (
                    <AccountStorageChart userStats={userStats} />
                  )}
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10 text-white">
                <CardHeader>
                  <CardTitle>Tài liệu theo loại</CardTitle>
                  <CardDescription className="text-white/60">
                    Số lượng tài liệu theo từng loại
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingStats ? (
                    <div className="h-64 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-white"></div>
                    </div>
                  ) : (
                    <AccountDocumentTypeChart userStats={userStats} />
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="documents" className="mt-0">
            <Card className="bg-white/5 border-white/10 text-white">
              <CardHeader>
                <CardTitle>Tài liệu đã lưu</CardTitle>
                <CardDescription className="text-white/60">
                  Danh sách tài liệu đã lưu vào tài khoản của bạn
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingStats ? (
                  <div className="h-64 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-white"></div>
                  </div>
                ) : (
                  <SavedDocumentList documents={savedDocuments} />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activities" className="mt-0">
            <Card className="bg-white/5 border-white/10 text-white">
              <CardHeader>
                <CardTitle>Lịch sử hoạt động</CardTitle>
                <CardDescription className="text-white/60">
                  Các hoạt động gần đây của bạn trên hệ thống
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingStats ? (
                  <div className="h-64 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-white"></div>
                  </div>
                ) : (
                  <AccountActivityList
                    activities={userStats?.recentActivities || []}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
