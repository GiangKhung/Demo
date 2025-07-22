"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { FiUpload, FiFile } from "react-icons/fi";
import { useAuth } from "@/providers/auth-provider";
import { documentService } from "@/lib/document-service";

// Hook tùy chỉnh để xử lý việc upload tài liệu
const useDocumentUpload = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    subject: "",
    ispublic: true,
  });
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, ispublic: e.target.checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      toast({
        title: "Vui lòng chọn tài liệu để tải lên",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUploading(true);

      // Tạo FormData để gửi đến API route
      const apiFormData = new FormData();
      apiFormData.append("title", formData.title);
      apiFormData.append("description", formData.description);
      apiFormData.append("subject", formData.subject);
      apiFormData.append("ispublic", formData.ispublic.toString());
      apiFormData.append("file", file);

      // Debug info
      console.log("Upload form data:", {
        title: formData.title,
        description: formData.description,
        subject: formData.subject,
        ispublic: formData.ispublic,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
      });

      // Kiểm tra đăng nhập
      if (!user) {
        throw new Error("Bạn cần đăng nhập để tải tài liệu lên");
      }

      console.log("User info:", {
        id: user.id,
        name: user.name,
        email: user.email,
      });

      // Gọi API backend thực
      const document = await documentService.uploadDocument(apiFormData);

      console.log("Upload tài liệu thành công:", document);

      toast({
        title: "Thành công",
        description: "Tải tài liệu thành công!",
      });
      setOpen(false);
      router.refresh();

      // Reset form
      setFile(null);
      setFormData({
        title: "",
        description: "",
        subject: "",
        ispublic: true,
      });
    } catch (error: unknown) {
      console.error("Lỗi khi tải tài liệu:", error);

      let errorMessage = "Đã xảy ra lỗi khi tải tài liệu của bạn.";
      let description = "";

      if (
        (error as Error).message === "Bạn cần đăng nhập để tải tài liệu lên"
      ) {
        errorMessage = "Chưa đăng nhập";
        description = "Bạn cần đăng nhập để có thể tải tài liệu lên hệ thống.";
        router.push("/auth/login");
      }

      // Xử lý các loại lỗi đơn giản hơn
      if (error instanceof Error) {
        if (error.message.includes("size")) {
          errorMessage = "Tệp quá lớn";
          description = "Vui lòng tải lên tệp nhỏ hơn 50MB.";
        } else {
          errorMessage = "Lỗi không xác định";
          description = error.message;
        }
      }

      toast({
        title: errorMessage,
        description: description,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return {
    isUploading,
    open,
    setOpen,
    formData,
    file,
    handleFileChange,
    handleInputChange,
    handleCheckboxChange,
    handleSubmit,
  };
};

const DocumentUpload = () => {
  const {
    isUploading,
    open,
    setOpen,
    formData,
    file,
    handleFileChange,
    handleInputChange,
    handleCheckboxChange,
    handleSubmit,
  } = useDocumentUpload();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-none">
          <FiUpload className="w-4 h-4" />
          Tải lên tài liệu
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-gradient-to-b from-gray-800 to-gray-900 border border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="text-white">Tải lên tài liệu mới</DialogTitle>
          <DialogDescription className="text-white/70">
            Tải lên tài liệu PDF, Word, PowerPoint để chia sẻ với người khác.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title" className="text-white/80">
                Tiêu đề
              </Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Nhập tiêu đề tài liệu"
                required
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-blue-500"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description" className="text-white/80">
                Mô tả
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Mô tả ngắn về tài liệu"
                rows={3}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-blue-500"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="subject" className="text-white/80">
                Bộ môn
              </Label>
              <Input
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                placeholder="Nhập bộ môn liên quan"
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-blue-500"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="file" className="text-white/80">
                Tài liệu
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="file"
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx"
                  required
                  className="flex-1 bg-white/5 border-white/10 text-white file:bg-white/10 file:text-white file:border-0"
                />
              </div>
              {file && (
                <div className="flex items-center gap-2 text-sm text-white/60">
                  <FiFile className="w-4 h-4" />
                  <span>{file.name}</span>
                  <span className="ml-auto">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </span>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <input
                id="isPublic"
                type="checkbox"
                checked={formData.ispublic}
                onChange={handleCheckboxChange}
                className="w-4 h-4 rounded border-white/30 focus:ring-blue-500 bg-white/5"
              />
              <Label htmlFor="isPublic" className="!m-0 text-white/80">
                Công khai cho mọi người
              </Label>
            </div>
          </div>
          <DialogFooter className="sm:justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setOpen(false)}
              disabled={isUploading}
              className="bg-white/10 hover:bg-white/20 text-white border-none"
            >
              Hủy
            </Button>
            <Button type="submit" disabled={isUploading} variant="gradient">
              {isUploading ? "Đang tải lên..." : "Tải lên"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentUpload;
