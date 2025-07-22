import { notFound, redirect } from "next/navigation";
import DocumentViewer from "@/components/documents/DocumentViewer";
import { getDocumentById } from "@/lib/document-service";
import { Metadata } from "next";
import Link from "next/link";

interface DocumentPageProps {
  params: Promise<{
    id: string;
  }>;
}

// Kiểm tra tính hợp lệ của MongoDB ObjectId
function isValidObjectId(id: string): boolean {
  return /^[0-9a-fA-F]{24}$/.test(id);
}

// Cấu hình metadata động dựa trên tài liệu
export async function generateMetadata({
  params,
}: DocumentPageProps): Promise<Metadata> {
  try {
    // Đảm bảo params đã được resolved trước khi sử dụng
    const resolvedParams = await params;

    // Kiểm tra định dạng ID trước khi gọi API
    if (!isValidObjectId(resolvedParams.id)) {
      return {
        title: "ID tài liệu không hợp lệ",
        description: "Định dạng ID tài liệu không đúng",
      };
    }

    const document = await getDocumentById(resolvedParams.id);

    if (!document) {
      return {
        title: "Không tìm thấy tài liệu",
        description: "Tài liệu này không tồn tại hoặc đã bị xóa",
      };
    }

    return {
      title: document.title,
      description: document.description || `Xem tài liệu ${document.title}`,
    };
  } catch (error) {
    console.error("Lỗi khi tải metadata tài liệu:", error);
    return {
      title: "Lỗi khi tải tài liệu",
      description: "Đã xảy ra lỗi khi tải thông tin tài liệu",
    };
  }
}

// Component hiển thị lỗi với các tùy chọn hành động
function DocumentErrorPage({
  title,
  message,
  showBackButton = true,
  showHomeButton = true,
}: {
  title: string;
  message: string;
  showBackButton?: boolean;
  showHomeButton?: boolean;
}) {
  return (
    <div className="pt-24 pb-16 min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="max-w-md mx-auto">
          {/* Icon lỗi */}
          <div className="mb-6">
            <div className="w-16 h-16 mx-auto bg-red-500/20 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold mb-4 text-red-500">
            {title}
          </h1>
          <p className="text-white/70 mb-8">{message}</p>

          {/* Các nút hành động */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {showBackButton && (
              <button
                onClick={() => window.history.back()}
                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Quay lại
              </button>
            )}

            {showHomeButton && (
              <Link
                href="/"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                Về trang chủ
              </Link>
            )}
          </div>

          {/* Gợi ý tìm kiếm */}
          <div className="mt-8 p-4 bg-white/5 rounded-lg border border-white/10">
            <p className="text-sm text-white/60 mb-3">Có thể bạn đang tìm:</p>
            <Link
              href="/documents"
              className="text-blue-400 hover:text-blue-300 text-sm underline"
            >
              Xem tất cả tài liệu
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function DocumentPage({ params }: DocumentPageProps) {
  try {
    // Đảm bảo params đã được resolved trước khi sử dụng
    const resolvedParams = await params;

    // Kiểm tra định dạng ID trước khi gọi API
    if (!isValidObjectId(resolvedParams.id)) {
      return (
        <DocumentErrorPage
          title="ID tài liệu không hợp lệ"
          message="Định dạng ID tài liệu không đúng. Vui lòng kiểm tra lại đường dẫn."
        />
      );
    }

    const document = await getDocumentById(resolvedParams.id);

    if (!document) {
      return (
        <DocumentErrorPage
          title="Không tìm thấy tài liệu"
          message="Tài liệu này không tồn tại hoặc đã bị xóa. Vui lòng kiểm tra lại đường dẫn hoặc tìm kiếm tài liệu khác."
        />
      );
    }

    return (
      <div className="mt-12 h-screen text-white flex flex-col">
        {/* Header space - chiếm 64px */}
        <div className="h-16"></div>

        {/* Content space - lấp đầy phần còn lại */}
        <div className="flex-1 px-0 sm:px-4 md:px-6 pb-6">
          <DocumentViewer document={document} />
        </div>
      </div>
    );
  } catch (error) {
    console.error("Lỗi khi tải tài liệu:", error);

    // Xử lý các loại lỗi khác nhau
    const errorMessage =
      error instanceof Error ? error.message : "Đã xảy ra lỗi không xác định";

    return (
      <DocumentErrorPage
        title="Lỗi khi tải tài liệu"
        message={`Không thể tải thông tin tài liệu: ${errorMessage}. Vui lòng thử lại sau.`}
      />
    );
  }
}
