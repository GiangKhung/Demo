"use client";

import { FC, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Document } from "@/types";
import {
  FiDownload,
  FiEye,
  FiBookmark,
  FiShare2,
  FiFile,
  FiCalendar,
  FiHardDrive,
  FiTag,
} from "react-icons/fi";
import { useRouter } from "next/navigation";
import { userService } from "@/lib/user-service";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/providers/auth-provider";
import DocumentShareDialog from "./DocumentShareDialog";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

interface DocumentCardProps {
  document: Document;
  isBookmarked?: boolean;
}

// Hook tùy chỉnh để xử lý các thao tác với tài liệu
const useDocumentActions = (
  document: Document,
  isBookmarked: boolean = false
) => {
  const router = useRouter();
  const { user } = useAuth();
  const [bookmarked, setBookmarked] = useState(isBookmarked);
  const [showShareDialog, setShowShareDialog] = useState(false);

  const handleViewDocument = () => {
    router.push(`/documents/${document.id}`);
  };

  const handleDownload = async () => {
    try {
      const { documentService } = await import("@/lib/document-service");
      await documentService.downloadDocument(
        document.id,
        document.originalFileName || document.title
      );
    } catch (error) {
      console.error("Lỗi khi tải xuống:", error);
      // Fallback: mở file trong tab mới nếu download API thất bại
      window.open(document.fileurl, "_blank");
    }
  };

  const handleToggleBookmark = async () => {
    try {
      // Kiểm tra đăng nhập
      if (!user) {
        toast({
          title: "Chưa đăng nhập",
          description: "Vui lòng đăng nhập để lưu tài liệu",
          variant: "destructive",
        });
        router.push("/auth/login");
        return;
      }

      if (bookmarked) {
        await userService.removeBookmark(document.id);
        setBookmarked(false);
        toast({
          title: "Thành công",
          description: "Đã xóa khỏi danh sách yêu thích",
        });
      } else {
        await userService.addBookmark(document.id);
        setBookmarked(true);
        toast({
          title: "Thành công",
          description: "Đã thêm vào danh sách yêu thích",
        });
      }
    } catch (error) {
      console.error("Lỗi khi thao tác với bookmark:", error);
      toast({
        title: "Thao tác thất bại",
        description: "Đã xảy ra lỗi. Vui lòng thử lại sau.",
        variant: "destructive",
      });
    }
  };

  return {
    bookmarked,
    showShareDialog,
    setShowShareDialog,
    handleViewDocument,
    handleDownload,
    handleToggleBookmark,
  };
};

const DocumentCard: FC<DocumentCardProps> = ({
  document,
  isBookmarked = false,
}) => {
  const {
    bookmarked,
    showShareDialog,
    setShowShareDialog,
    handleViewDocument,
    handleDownload,
    handleToggleBookmark,
  } = useDocumentActions(document, isBookmarked);

  // Lấy tên file từ đường dẫn fileurl
  const getFileName = (url: string) => {
    if (!url) return "";
    const parts = url.split("/");
    return parts[parts.length - 1];
  };

  const fileName = getFileName(document.fileurl);

  // Chuyển đổi kích thước file sang dạng dễ đọc
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Lấy icon phù hợp cho loại file
  const getFileIcon = (fileType: string) => {
    const type = fileType.toLowerCase();
    if (type.includes("pdf")) {
      return <FiFile className="h-8 w-8 text-red-400" />;
    } else if (type.includes("word") || type.includes("doc")) {
      return <FiFile className="h-8 w-8 text-blue-400" />;
    } else if (
      type.includes("sheet") ||
      type.includes("excel") ||
      type.includes("xls")
    ) {
      return <FiFile className="h-8 w-8 text-green-400" />;
    } else if (
      type.includes("presentation") ||
      type.includes("powerpoint") ||
      type.includes("ppt")
    ) {
      return <FiFile className="h-8 w-8 text-orange-400" />;
    } else {
      return <FiFile className="h-8 w-8" />;
    }
  };

  // Format ngày tạo
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return format(date, "dd/MM/yyyy", { locale: vi });
    } catch (error) {
      return "";
    }
  };

  return (
    <Card className="overflow-hidden flex flex-col transition-all hover:shadow-lg border border-white/15 bg-white/5 backdrop-blur-sm text-white hover:bg-white/10 rounded-xl">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="text-white/60 mt-1 bg-white/10 rounded-lg p-3">
            {getFileIcon(document.filetype)}
          </div>
          <div className="flex-1 min-w-0">
            <Link
              href={`/documents/${document.id}`}
              className="hover:text-blue-400 transition-colors"
            >
              <h3 className="font-medium text-lg line-clamp-1 mb-2">
                {document.title}
              </h3>
            </Link>

            <p className="text-sm text-white/60 line-clamp-1 mb-3">
              {fileName}
            </p>

            <div className="flex flex-wrap gap-2 mb-3">
              {document.subject && (
                <Badge
                  variant="outline"
                  className="bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 border-blue-500/30"
                >
                  <FiTag className="mr-1 h-3 w-3" />
                  {document.subject}
                </Badge>
              )}

              <Badge
                variant="outline"
                className="bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 border-purple-500/30"
              >
                <FiHardDrive className="mr-1 h-3 w-3" />
                {formatFileSize(document.filesize)}
              </Badge>

              {document.createdat && (
                <Badge
                  variant="outline"
                  className="bg-green-500/20 text-green-300 hover:bg-green-500/30 border-green-500/30"
                >
                  <FiCalendar className="mr-1 h-3 w-3" />
                  {formatDate(document.createdat.toString())}
                </Badge>
              )}
            </div>

            {document.description && (
              <p className="text-sm text-white/70 line-clamp-2 mb-2">
                {document.description}
              </p>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-wrap gap-2 p-4 pt-0 border-t border-white/10 mt-2 px-6 pb-5">
        <Button
          variant="outline"
          onClick={handleViewDocument}
          className="flex-1 justify-center py-2 text-sm text-white/80 hover:text-white hover:bg-blue-500/20 border-blue-500/30 rounded-lg"
        >
          <div className="flex items-center gap-1.5">
            <FiEye className="h-4 w-4" />
            <span>Xem</span>
          </div>
        </Button>

        <Button
          variant="outline"
          onClick={handleDownload}
          className="flex-1 justify-center py-2 text-sm text-white/80 hover:text-white hover:bg-green-500/20 border-green-500/30 rounded-lg"
        >
          <div className="flex items-center gap-1.5">
            <FiDownload className="h-4 w-4" />
            <span>Tải xuống</span>
          </div>
        </Button>

        <Button
          variant="outline"
          onClick={handleToggleBookmark}
          className={`flex-1 justify-center py-2 text-sm ${
            bookmarked
              ? "text-yellow-400 hover:text-yellow-300 border-yellow-500/30 hover:bg-yellow-500/20"
              : "text-white/80 hover:text-white border-purple-500/30 hover:bg-purple-500/20"
          } rounded-lg`}
        >
          <div className="flex items-center gap-1.5">
            <FiBookmark className="h-4 w-4" />
            <span>{bookmarked ? "Đã lưu" : "Lưu"}</span>
          </div>
        </Button>

        <Button
          variant="outline"
          onClick={() => setShowShareDialog(true)}
          className="flex-1 justify-center py-2 text-sm text-white/80 hover:text-white hover:bg-orange-500/20 border-orange-500/30 rounded-lg"
        >
          <div className="flex items-center gap-1.5">
            <FiShare2 className="h-4 w-4" />
            <span>Chia sẻ</span>
          </div>
        </Button>
      </CardFooter>

      <DocumentShareDialog
        open={showShareDialog}
        onOpenChange={setShowShareDialog}
        document={document}
      />
    </Card>
  );
};

export default DocumentCard;
