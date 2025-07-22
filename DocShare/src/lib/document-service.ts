// Document service để tương tác với backend API
import api from "./api";
import { Document, Bookmark, DocumentShare } from "@/types";

interface DocumentsResponse {
  documents: Document[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

interface DocumentResponse {
  document: Document;
}

interface UploadDocumentData {
  title: string;
  description?: string;
  subject?: string;
  ispublic?: boolean;
  keywords?: string;
  tags?: string;
}

export const documentService = {
  // Lấy tài liệu công khai với pagination và filters
  async getPublicDocuments(
    params: Record<string, any> = {}
  ): Promise<DocumentsResponse> {
    try {
      console.log("🔍 Fetching documents with params:", params);

      // Test connection first
      try {
        await api.get("/health");
        console.log("✅ Backend connection OK");
      } catch (healthError) {
        console.warn("⚠️ Health check failed, proceeding anyway");
      }

      const response = await api.get<{
        success: boolean;
        data: DocumentsResponse;
      }>("/documents", {
        params,
        timeout: 15000,
      });

      console.log("✅ Documents fetched successfully");
      return response.data.data;
    } catch (error: any) {
      console.error("❌ Error fetching documents:", {
        message: error.message,
        status: error.response?.status,
        url: error.config?.url,
      });

      // Return empty data instead of throwing
      return {
        documents: [],
        pagination: {
          currentPage: 1,
          totalPages: 0,
          totalDocuments: 0,
          hasNextPage: false,
          hasPrevPage: false,
        },
      };
    }
  },

  // Lấy tài liệu của user hiện tại
  async getMyDocuments(
    params: Record<string, any> = {}
  ): Promise<DocumentsResponse> {
    try {
      const response = await api.get<{
        success: boolean;
        data: DocumentsResponse;
      }>("/documents/my", { params });
      return response.data.data;
    } catch (error: any) {
      console.error("Error fetching my documents:", error);
      throw new Error(
        error.response?.data?.error || "Không thể tải tài liệu của bạn"
      );
    }
  },

  // Lấy chi tiết một tài liệu
  async getDocument(id: string): Promise<Document> {
    try {
      console.log(`Fetching document with ID: ${id}`);
      const response = await api.get<{
        success: boolean;
        data: DocumentResponse;
      }>(`/documents/${id}`);
      console.log("Document fetched successfully:", response.data);
      return response.data.data.document;
    } catch (error: any) {
      console.error("Error fetching document:", error);
      console.error("Error details:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
      });
      throw new Error(error.response?.data?.error || "Không thể tải tài liệu");
    }
  },

  // Upload tài liệu mới
  async uploadDocument(formData: FormData): Promise<Document> {
    try {
      console.log("Sending upload request to:", "/documents");
      console.log("FormData entries:");
      for (let [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(
            `${key}: File(${value.name}, ${value.size} bytes, ${value.type})`
          );
        } else {
          console.log(`${key}: ${value}`);
        }
      }

      const response = await api.post<{
        success: boolean;
        data: DocumentResponse;
      }>("/documents", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 60000, // 60 seconds for file upload
      });

      console.log("Upload response:", response.data);
      return response.data.data.document;
    } catch (error: any) {
      console.error("Error uploading document:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
      console.error("Error headers:", error.response?.headers);

      throw new Error(
        error.response?.data?.error ||
          error.message ||
          "Upload tài liệu thất bại"
      );
    }
  },

  // Cập nhật thông tin tài liệu
  async updateDocument(
    id: string,
    data: Partial<UploadDocumentData>
  ): Promise<Document> {
    try {
      const response = await api.put<{
        success: boolean;
        data: DocumentResponse;
      }>(`/documents/${id}`, data);
      return response.data.data.document;
    } catch (error: any) {
      console.error("Error updating document:", error);
      throw new Error(
        error.response?.data?.error || "Cập nhật tài liệu thất bại"
      );
    }
  },

  // Xóa tài liệu
  async deleteDocument(id: string): Promise<boolean> {
    try {
      await api.delete(`/documents/${id}`);
      return true;
    } catch (error: any) {
      console.error("Error deleting document:", error);
      throw new Error(error.response?.data?.error || "Xóa tài liệu thất bại");
    }
  },

  // Download tài liệu
  async downloadDocument(
    id: string,
    filename: string = "document"
  ): Promise<boolean> {
    try {
      const response = await api.get(`/documents/${id}/download`, {
        responseType: "blob",
      });

      // Tạo URL để download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;

      // Lấy tên file từ response headers nếu có
      const contentDisposition = response.headers["content-disposition"];
      const downloadFilename = contentDisposition
        ? contentDisposition.split("filename=")[1]?.replace(/"/g, "")
        : filename;

      link.setAttribute("download", downloadFilename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      return true;
    } catch (error: any) {
      console.error("Error downloading document:", error);
      throw new Error(
        error.response?.data?.error || "Download tài liệu thất bại"
      );
    }
  },

  // Tìm kiếm tài liệu
  async searchDocuments(
    query: string,
    params: Record<string, any> = {}
  ): Promise<DocumentsResponse> {
    try {
      const searchParams = { search: query, ...params };
      const response = await api.get<{
        success: boolean;
        data: DocumentsResponse;
      }>("/documents", { params: searchParams });
      return response.data.data;
    } catch (error: any) {
      console.error("Error searching documents:", error);
      throw new Error(error.response?.data?.error || "Tìm kiếm thất bại");
    }
  },
};

// Backward compatibility functions
export const getPublicDocuments = async (): Promise<Document[]> => {
  const data = await documentService.getPublicDocuments();
  return data.documents || [];
};

export const getDocumentById = async (id: string): Promise<Document | null> => {
  try {
    console.log(`getDocumentById called with ID: ${id}`);

    // Kiểm tra định dạng ID trước khi gọi API
    if (!id || typeof id !== "string" || !/^[0-9a-fA-F]{24}$/.test(id)) {
      console.warn(`Invalid document ID format: ${id}`);
      return null;
    }

    const result = await documentService.getDocument(id);
    console.log("getDocumentById result:", result);
    return result;
  } catch (error: any) {
    // Log chi tiết lỗi để debug
    console.error(`Error fetching document ${id}:`, {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });

    // Trả về null thay vì throw error để component có thể xử lý
    return null;
  }
};

export const getUserDocuments = async (): Promise<Document[]> => {
  try {
    const data = await documentService.getMyDocuments();
    return data.documents || [];
  } catch (error) {
    return [];
  }
};

export const searchDocuments = async (query: string): Promise<Document[]> => {
  try {
    const data = await documentService.searchDocuments(query);
    return data.documents || [];
  } catch (error) {
    return [];
  }
};

// Legacy functions - use documentService instead
export const createDocument = async (
  document: Omit<Document, "id" | "createdat" | "updatedat">
): Promise<Document> => {
  console.warn(
    "createDocument is deprecated, use documentService.uploadDocument instead"
  );
  throw new Error("Use documentService.uploadDocument instead");
};

export const updateDocument = async (
  id: string,
  document: Partial<Document>
): Promise<Document> => {
  console.warn(
    "updateDocument is deprecated, use documentService.updateDocument instead"
  );
  return await documentService.updateDocument(id, document);
};

export const deleteDocument = async (id: string): Promise<void> => {
  console.warn(
    "deleteDocument is deprecated, use documentService.deleteDocument instead"
  );
  await documentService.deleteDocument(id);
};

export const uploadFile = async (file: File, path: string): Promise<string> => {
  console.warn(
    "uploadFile is deprecated, use documentService.uploadDocument instead"
  );
  throw new Error("Use documentService.uploadDocument instead");
};

// Bookmark functions - use userService instead
export const bookmarkDocument = async (
  userId: string,
  documentId: string
): Promise<Bookmark> => {
  console.warn(
    "bookmarkDocument is deprecated, use userService.addBookmark instead"
  );
  throw new Error("Use userService.addBookmark instead");
};

export const removeBookmark = async (
  userId: string,
  documentId: string
): Promise<void> => {
  console.warn(
    "removeBookmark is deprecated, use userService.removeBookmark instead"
  );
  throw new Error("Use userService.removeBookmark instead");
};

// Activity tracking - handled automatically by backend
export const recordDocumentView = async (
  userId: string,
  documentId: string
): Promise<void> => {
  console.warn(
    "recordDocumentView is deprecated, view tracking is automatic in backend"
  );
  // No-op since backend handles this automatically
  return;
};

// Share functions - placeholder for future implementation
export const shareDocument = async (
  share: Omit<DocumentShare, "id" | "createdat">
): Promise<DocumentShare> => {
  console.warn("shareDocument not yet implemented in backend");
  throw new Error("Share functionality not yet implemented");
};

// Get shared documents - placeholder for future implementation
export const getSharedDocuments = async (
  userId: string
): Promise<Document[]> => {
  console.warn("getSharedDocuments not yet implemented in backend");
  return [];
};

// Get user bookmarks - use userService instead
export const getUserBookmarks = async (userId: string): Promise<Bookmark[]> => {
  console.warn(
    "getUserBookmarks is deprecated, use userService.getBookmarks instead"
  );
  return [];
};
