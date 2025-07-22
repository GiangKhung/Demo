"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FiBookmark, FiCheck } from "react-icons/fi";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/providers/auth-provider";
import { userService } from "@/lib/user-service";

interface SaveDocumentButtonProps {
  documentId: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export default function SaveDocumentButton({
  documentId,
  variant = "outline",
  size = "icon",
  className = "",
}: SaveDocumentButtonProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  // Kiểm tra xem tài liệu đã được bookmark chưa
  useEffect(() => {
    const checkBookmarkStatus = async () => {
      if (!user) return;

      try {
        const bookmarks = await userService.getBookmarks();
        // Đảm bảo bookmarks là array và có thuộc tính bookmarks
        const bookmarkList = Array.isArray(bookmarks)
          ? bookmarks
          : bookmarks?.bookmarks || [];
        const isBookmarked = bookmarkList.some(
          (bookmark) => bookmark.document?.id === documentId
        );
        setSaved(isBookmarked);
      } catch (error) {
        console.error("Lỗi khi kiểm tra trạng thái bookmark:", error);
      }
    };

    checkBookmarkStatus();
  }, [documentId, user]);

  const handleSaveClick = async () => {
    if (!user) {
      toast({
        title: "Cần đăng nhập",
        description: "Vui lòng đăng nhập để lưu tài liệu này.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      if (saved) {
        // Nếu đã lưu, xóa bookmark
        await userService.removeBookmark(documentId);
        setSaved(false);
        toast({
          title: "Thành công",
          description: "Đã xóa khỏi danh sách yêu thích",
        });
      } else {
        // Nếu chưa lưu, thêm bookmark
        await userService.addBookmark(documentId);
        setSaved(true);
        toast({
          title: "Thành công",
          description: "Đã thêm vào danh sách yêu thích",
        });
      }
    } catch (error) {
      console.error("Lỗi khi thao tác bookmark:", error);
      toast({
        title: "Thao tác thất bại",
        description: "Đã xảy ra lỗi. Vui lòng thử lại sau.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={variant}
              size={size}
              className={className}
              onClick={handleSaveClick}
              disabled={loading}
            >
              {saved ? (
                <FiCheck className="h-4 w-4" />
              ) : (
                <FiBookmark className="h-4 w-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{saved ? "Đã lưu vào yêu thích" : "Lưu vào yêu thích"}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </>
  );
}
