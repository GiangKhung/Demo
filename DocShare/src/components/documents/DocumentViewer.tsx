"use client";

import { FC, useState, useEffect } from "react";
import { Document as DocumentType } from "@/types";
import { Button } from "@/components/ui/button";
import { recordDocumentView } from "@/lib/document-service";
import {
  FiDownload,
  FiBookmark,
  FiShare2,
  FiFile,
  FiMaximize,
} from "react-icons/fi";
import DocumentShareDialog from "./DocumentShareDialog";
import SaveDocumentButton from "./SaveDocumentButton";
import { useAuth } from "@/providers/auth-provider";

interface DocumentViewerProps {
  document: DocumentType;
  isBookmarked?: boolean;
  onToggleBookmark?: () => Promise<void>;
}

// Hook tùy chỉnh để xử lý việc xem tài liệu
const useDocumentViewer = (
  document: DocumentType,
  onToggleBookmark?: () => Promise<void>
) => {
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFullscreen, setShowFullscreen] = useState(false);

  // Hàm mở tài liệu trong tab mới
  const openInNewTab = () => {
    window.open(document.fileurl, "_blank", "noopener,noreferrer");
  };

  // Xử lý việc tải tài liệu
  const handleDownload = () => {
    window.open(document.fileurl, "_blank");
  };

  // Lấy tên file từ đường dẫn
  const getFileName = (url: string) => {
    if (!url) return "";
    const parts = url.split("/");
    return parts[parts.length - 1];
  };

  const fileName = getFileName(document.fileurl);

  // Xác định loại file từ filetype
  const determineFileType = () => {
    const type = document.filetype.toLowerCase();
    if (type.includes("pdf")) return "PDF";
    if (type.includes("word") || type.includes("doc")) return "Word";
    if (
      type.includes("excel") ||
      type.includes("sheet") ||
      type.includes("xls")
    )
      return "Excel";
    if (
      type.includes("powerpoint") ||
      type.includes("presentation") ||
      type.includes("ppt")
    )
      return "PowerPoint";
    if (type.includes("image") || type.includes("jpg") || type.includes("png"))
      return "Hình ảnh";
    if (type.includes("text") || type.includes("txt")) return "Văn bản";
    return "Tài liệu";
  };

  const fileType = determineFileType();

  // Tạo URL xem tài liệu phù hợp
  const getViewerUrl = () => {
    const type = document.filetype.toLowerCase();
    // Kiểm tra xem có phải file local không (bắt đầu với /uploads/)
    const isLocalFile = document.fileurl.startsWith("/uploads/");

    // Tạo full URL cho file local
    const fullFileUrl = isLocalFile
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"}${
          document.fileurl
        }`
      : document.fileurl;

    if (type.includes("pdf")) {
      // Sử dụng PDF.js viewer cho tất cả file PDF
      return `https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(
        fullFileUrl
      )}`;
    } else if (
      type.includes("word") ||
      type.includes("doc") ||
      type.includes("xls") ||
      type.includes("excel") ||
      type.includes("ppt") ||
      type.includes("powerpoint")
    ) {
      if (isLocalFile) {
        // Cho file local, trả về URL trực tiếp để xử lý fallback
        return fullFileUrl;
      } else {
        // File Office public - sử dụng Office Online Viewer
        return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
          document.fileurl
        )}`;
      }
    } else if (type.includes("image")) {
      // Hình ảnh - sử dụng full URL cho local files
      return isLocalFile ? fullFileUrl : document.fileurl;
    } else {
      // Các loại khác - sử dụng full URL cho local files
      return isLocalFile ? fullFileUrl : document.fileurl;
    }
  };

  const viewerUrl = getViewerUrl();

  // Ghi lại lượt xem tài liệu
  useEffect(() => {
    const recordView = async () => {
      try {
        // Sử dụng userId từ hook useAuth
        const { user } = useAuth();
        if (user) {
          await recordDocumentView(user.id, document.id);
        }
      } catch (error) {
        console.error("Lỗi khi ghi lại lượt xem:", error);
      }
    };

    recordView();
  }, [document.id]);

  return {
    showShareDialog,
    setShowShareDialog,
    error,
    setError,
    handleDownload,
    openInNewTab,
    onToggleBookmark,
    fileName,
    fileType,
    viewerUrl,
    showFullscreen,
    setShowFullscreen,
  };
};

const DocumentViewer: FC<DocumentViewerProps> = ({
  document,
  isBookmarked = false,
  onToggleBookmark,
}) => {
  const {
    showShareDialog,
    setShowShareDialog,
    error,
    setError,
    handleDownload,
    openInNewTab,
    fileName,
    fileType,
    viewerUrl,
    showFullscreen,
    setShowFullscreen,
  } = useDocumentViewer(document, onToggleBookmark);

  // Render nội dung tài liệu
  const renderDocumentContent = () => {
    // Xử lý lỗi nếu có
    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-8 bg-gray-900/50 backdrop-blur-sm">
          <div className="bg-white/5 p-6 rounded-xl border border-white/10 flex flex-col items-center max-w-md">
            <div className="text-red-400 text-lg mb-3">
              Không thể tải tài liệu
            </div>
            <p className="text-white/70 mb-6 text-center">{error}</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Button
                onClick={handleDownload}
                className="gap-2 bg-blue-600 hover:bg-blue-700"
              >
                <FiDownload className="h-4 w-4" />
                Tải xuống
              </Button>
              <Button
                onClick={openInNewTab}
                className="gap-2 bg-gray-700 hover:bg-gray-600"
              >
                <FiMaximize className="h-4 w-4" />
                Mở trong tab mới
              </Button>
            </div>
          </div>
        </div>
      );
    }

    const type = document.filetype.toLowerCase();
    const isLocalFile = document.fileurl.startsWith("/uploads/");

    // Xử lý riêng cho hình ảnh
    if (type.includes("image")) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-gray-950/50">
          <img
            src={viewerUrl}
            alt={document.title}
            className="max-w-full max-h-full object-contain"
            loading="lazy"
            onError={() => {
              setError("Không thể tải hình ảnh. Vui lòng tải xuống để xem.");
            }}
          />
        </div>
      );
    }

    // Xử lý PDF
    if (type.includes("pdf")) {
      return (
        <iframe
          src={viewerUrl}
          className="w-full h-full border-0"
          title={fileName}
        />
      );
    }

    // Xử lý Office files (Word, Excel, PowerPoint)
    if (
      type.includes("word") ||
      type.includes("doc") ||
      type.includes("xls") ||
      type.includes("excel") ||
      type.includes("ppt") ||
      type.includes("powerpoint")
    ) {
      if (isLocalFile) {
        // Cho file local, hiển thị thông báo download vì Office Online Viewer không hỗ trợ localhost
        return (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-950/50 text-center p-8">
            <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-6 max-w-md">
              <div className="text-yellow-400 mb-4">
                <svg
                  className="w-16 h-16 mx-auto"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Không thể preview file Office
              </h3>
              <p className="text-gray-300 mb-4">
                File {fileType} không thể preview trực tiếp trong môi trường
                development. Vui lòng tải xuống để xem nội dung.
              </p>
              <Button
                onClick={handleDownload}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Tải xuống file
              </Button>
            </div>
          </div>
        );
      } else {
        return (
          <div className="w-full h-full relative">
            <iframe
              src={viewerUrl}
              className="w-full h-full border-0"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-downloads allow-presentation"
              allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
              loading="eager"
              onError={() => {
                setError(
                  "Không thể tải tài liệu Office. Vui lòng tải xuống để xem."
                );
              }}
            />
          </div>
        );
      }
    }

    // Xử lý text files
    if (type.includes("txt") || type.includes("text")) {
      return (
        <iframe
          src={viewerUrl}
          className="w-full h-full border-0"
          title={fileName}
        />
      );
    }

    // Fallback cho các loại file khác
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gray-950/50 text-center p-8">
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 max-w-md">
          <div className="text-gray-400 mb-4">
            <svg
              className="w-16 h-16 mx-auto"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">
            Không thể preview file
          </h3>
          <p className="text-gray-300 mb-4">
            File {fileType} không hỗ trợ preview trực tiếp. Vui lòng tải xuống
            để xem nội dung.
          </p>
          <Button
            onClick={handleDownload}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Tải xuống file
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full border border-white/10 rounded-xl overflow-hidden">
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-white/10 p-2 rounded-lg">
            <FiFile className="h-6 w-6 text-white/70" />
          </div>
          <div>
            <h2 className="font-medium text-lg truncate text-white">
              {document.title}
            </h2>
            <p className="text-sm text-white/60">
              {fileType} • {fileName}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFullscreen(true)}
            className="gap-2 bg-transparent border-teal-400/30 hover:bg-teal-500/20 text-teal-300"
          >
            <FiMaximize className="h-4 w-4" />
            Xem toàn màn hình
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={openInNewTab}
            className="gap-2 bg-transparent border-white/20 hover:bg-white/10 text-white"
          >
            <FiMaximize className="h-4 w-4" />
            Mở tab mới
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            className="gap-2 bg-transparent border-white/20 hover:bg-white/10 text-white"
          >
            <FiDownload className="h-4 w-4" />
            Tải xuống
          </Button>

          {/* Nút lưu tài liệu vào tài khoản */}
          <SaveDocumentButton
            documentId={document.id}
            variant="outline"
            size="sm"
            className="gap-2 bg-transparent border-white/20 hover:bg-white/10 text-white"
          />

          {onToggleBookmark && (
            <Button
              variant="outline"
              size="sm"
              onClick={onToggleBookmark}
              className={`gap-2 bg-transparent border-white/20 hover:bg-white/10 ${
                isBookmarked ? "text-yellow-400" : "text-white"
              }`}
            >
              <FiBookmark className="h-4 w-4" />
              {isBookmarked ? "Đã lưu" : "Lưu lại"}
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowShareDialog(true)}
            className="gap-2 bg-transparent border-white/20 hover:bg-white/10 text-white"
          >
            <FiShare2 className="h-4 w-4" />
            Chia sẻ
          </Button>
        </div>
      </div>

      <div className="flex-1 bg-gray-900 overflow-hidden">
        {renderDocumentContent()}
      </div>

      {/* Modal xem toàn màn hình */}
      {showFullscreen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
          <div className="absolute inset-0 flex flex-col">
            <div className="flex justify-between items-center bg-gray-900 p-2">
              <h3 className="text-white font-medium px-4">{document.title}</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFullscreen(false)}
                className="text-white hover:bg-white/10"
              >
                Đóng
              </Button>
            </div>
            <div className="flex-1 bg-gray-800 overflow-hidden">
              <iframe
                src={viewerUrl}
                className="w-full h-full border-0"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-downloads allow-presentation"
                allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
              />
            </div>
          </div>
        </div>
      )}

      <DocumentShareDialog
        open={showShareDialog}
        onOpenChange={setShowShareDialog}
        document={document}
      />
    </div>
  );
};

export default DocumentViewer;
