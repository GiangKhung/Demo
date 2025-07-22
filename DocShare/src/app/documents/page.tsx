import { Suspense } from "react";
import DocumentSearch from "@/components/documents/DocumentSearch";
import DocumentGrid from "@/components/documents/DocumentGrid";
import DocumentUpload from "@/components/documents/DocumentUpload";
import { documentService, searchDocuments } from "@/lib/document-service";
import { FiFileText, FiAlertTriangle } from "react-icons/fi";

interface DocumentsPageProps {
  searchParams: { q?: string; error?: string; id?: string };
}

// Component hiển thị thông báo lỗi
function ErrorAlert({ error, id }: { error: string; id?: string }) {
  const getErrorMessage = () => {
    switch (error) {
      case "invalid-id":
        return {
          title: "ID tài liệu không hợp lệ",
          message: id
            ? `ID "${id}" không đúng định dạng. Vui lòng kiểm tra lại đường dẫn.`
            : "Định dạng ID tài liệu không hợp lệ.",
        };
      case "not-found":
        return {
          title: "Không tìm thấy tài liệu",
          message: "Tài liệu bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.",
        };
      default:
        return {
          title: "Đã xảy ra lỗi",
          message: "Có lỗi xảy ra khi truy cập tài liệu.",
        };
    }
  };

  const { title, message } = getErrorMessage();

  return (
    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
      <div className="flex items-start gap-3">
        <FiAlertTriangle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
        <div>
          <h3 className="text-red-400 font-medium mb-1">{title}</h3>
          <p className="text-red-300/80 text-sm">{message}</p>
        </div>
      </div>
    </div>
  );
}

async function DocumentResults({ searchQuery }: { searchQuery?: string }) {
  try {
    console.log("Fetching documents with search query:", searchQuery);
    let documents = [];

    if (searchQuery) {
      console.log("Searching documents with query:", searchQuery);
      documents = await searchDocuments(searchQuery);
    } else {
      console.log("Fetching all public documents");
      const response = await documentService.getPublicDocuments();
      documents = response.documents;
    }

    console.log("Documents fetched successfully:", documents.length);
    return (
      <DocumentGrid
        documents={documents}
        emptyStateMessage={
          searchQuery
            ? `Không tìm thấy kết quả nào cho "${searchQuery}"`
            : "Chưa có tài liệu nào được tải lên"
        }
      />
    );
  } catch (error: any) {
    console.error("Lỗi khi tải danh sách tài liệu:", error);
    console.error("Error details:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        baseURL: error.config?.baseURL,
      },
    });

    return (
      <div className="text-center p-8">
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 inline-block">
          <FiAlertTriangle className="w-6 h-6 text-red-400 mx-auto mb-2" />
          <div className="text-red-400 font-medium">Lỗi tải dữ liệu</div>
          <div className="text-red-300/80 text-sm mt-1">
            {error.response?.status === 404
              ? "Không thể kết nối đến máy chủ. Vui lòng thử lại sau."
              : "Đã xảy ra lỗi khi tải danh sách tài liệu. Vui lòng thử lại sau."}
          </div>
        </div>
      </div>
    );
  }
}

export default async function DocumentsPage({
  searchParams,
}: DocumentsPageProps) {
  // Log environment variables để debug
  console.log("🌐 Environment check:", {
    NODE_ENV: process.env.NODE_ENV,
    API_URL: process.env.NEXT_PUBLIC_API_URL,
    BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
  });

  try {
    const resolvedSearchParams = await searchParams;
    const { error, id: errorId, ...otherParams } = resolvedSearchParams;

    // Thêm fallback nếu API không khả dụng
    let documents: DocumentsResponse;

    try {
      documents = await documentService.getPublicDocuments(otherParams);
    } catch (apiError) {
      console.error("❌ API Error:", apiError);

      // Fallback với empty data
      documents = {
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

    return (
      <div className="pt-24 pb-16 min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col space-y-8">
            {/* Hiển thị thông báo lỗi nếu có */}
            {error && <ErrorAlert error={error} id={errorId} />}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                  Kho tài liệu
                </h1>
                <p className="text-white/70">
                  Khám phá và tải xuống các tài liệu chất lượng cao
                </p>
              </div>

              <div className="flex gap-2 w-full md:w-auto">
                <DocumentSearch className="flex-1 md:w-80" />
                <DocumentUpload />
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-white/60">
              <FiFileText className="h-4 w-4" />
              <span>
                {searchQuery
                  ? `Kết quả tìm kiếm cho "${searchQuery}"`
                  : "Tất cả tài liệu công khai"}
              </span>
            </div>

            <Suspense
              fallback={<DocumentGrid documents={[]} isLoading={true} />}
            >
              <DocumentResults searchQuery={searchQuery} />
            </Suspense>
          </div>
        </div>
      </div>
    );
  } catch (error: any) {
    console.error("❌ Page Error:", error);

    return (
      <div className="pt-24 pb-16 min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6">
            <h2 className="text-red-400 text-xl mb-2">Lỗi tải trang</h2>
            <p className="text-red-300/80">
              Không thể tải trang tài liệu. Vui lòng thử lại sau.
            </p>
          </div>
        </div>
      </div>
    );
  }
}
