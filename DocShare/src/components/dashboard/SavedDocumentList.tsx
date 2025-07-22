"use client";

import { Document } from "@/types";
import { formatBytes, formatDate } from "@/lib/utils";
import { FiFile, FiDownload, FiTrash2, FiExternalLink } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/providers/auth-provider";
import { useState } from "react";
import { removeSavedDocument } from "@/lib/saved-document-service";
import Link from "next/link";

interface SavedDocumentListProps {
  documents: Document[];
}

export default function SavedDocumentList({ documents }: SavedDocumentListProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

  if (!documents || documents.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-white/60">Chưa có tài liệu nào được lưu</p>
      </div>
    );
  }

  // Hàm xử lý xóa tài liệu đã lưu
  const handleRemoveSaved = async (documentId: string) => {
    if (!user) return;

    // Cập nhật trạng thái loading
    setLoadingStates(prev => ({ ...prev, [documentId]: true }));

    try {
      await removeSavedDocument(user.id);
      
      toast({
        title: "Đã xóa khỏi danh sách đã lưu",
        description: "Tài liệu đã được xóa khỏi danh sách đã lưu của bạn.",
      });
      
      // Cập nhật UI (trong thực tế, bạn có thể muốn cập nhật state ở component cha)
      window.location.reload();
    } catch (error) {
      console.error("Lỗi khi xóa tài liệu đã lưu:", error);
      toast({
        title: "Lỗi",
        description: "Không thể xóa tài liệu khỏi danh sách đã lưu.",
        variant: "destructive",
      });
    } finally {
      setLoadingStates(prev => ({ ...prev, [documentId]: false }));
    }
  };

  // Hàm lấy icon phù hợp với loại tài liệu
  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) {
      return <FiFile className="h-5 w-5 text-red-400" />;
    } else if (fileType.includes('word') || fileType.includes('document')) {
      return <FiFile className="h-5 w-5 text-blue-400" />;
    } else if (fileType.includes('excel') || fileType.includes('sheet')) {
      return <FiFile className="h-5 w-5 text-green-400" />;
    } else if (fileType.includes('powerpoint') || fileType.includes('presentation')) {
      return <FiFile className="h-5 w-5 text-orange-400" />;
    } else if (fileType.includes('image')) {
      return <FiFile className="h-5 w-5 text-purple-400" />;
    } else {
      return <FiFile className="h-5 w-5 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-4">
      {documents.map((document) => (
        <div
          key={document.id}
          className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
        >
          <div className="p-3 rounded-full bg-white/10 shrink-0">
            {getFileIcon(document.filetype)}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-medium text-white truncate">{document.title}</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 mt-2 text-xs text-white/60">
              <div className="flex items-center gap-1">
                <span className="font-medium">Loại:</span>
                <span>{document.filetype.split('/')[1] || document.filetype}</span>
              </div>
              
              <div className="flex items-center gap-1">
                <span className="font-medium">Kích thước:</span>
                <span>{formatBytes(document.filesize)}</span>
              </div>
              
              <div className="flex items-center gap-1">
                <span className="font-medium">Ngày tạo:</span>
                <span>{formatDate(new Date(document.createdat))}</span>
              </div>
              
              <div className="flex items-center gap-1">
                <span className="font-medium">Cập nhật:</span>
                <span>{formatDate(new Date(document.updatedat))}</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-row sm:flex-col gap-2 mt-3 sm:mt-0">
            <Button
              variant="ghost"
              size="sm"
              className="bg-white/10 hover:bg-white/20 text-white"
              asChild
            >
              <Link href={`/documents/${document.id}`}>
                <FiExternalLink className="h-4 w-4 mr-1" />
                <span>Xem</span>
              </Link>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="bg-white/10 hover:bg-white/20 text-white"
              asChild
            >
              <a href={document.fileurl} target="_blank" rel="noopener noreferrer" download>
                <FiDownload className="h-4 w-4 mr-1" />
                <span>Tải xuống</span>
              </a>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="bg-red-900/20 hover:bg-red-900/40 text-white"
              onClick={() => handleRemoveSaved(document.id)}
              disabled={loadingStates[document.id]}
            >
              {loadingStates[document.id] ? (
                <>
                  <span className="h-4 w-4 border-t-2 border-b-2 border-white rounded-full animate-spin mr-1"></span>
                  <span>Đang xóa...</span>
                </>
              ) : (
                <>
                  <FiTrash2 className="h-4 w-4 mr-1" />
                  <span>Xóa</span>
                </>
              )}
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
