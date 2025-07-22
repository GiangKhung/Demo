import { Suspense } from "react";
import DocumentGrid from "@/components/documents/DocumentGrid";
import DocumentSearch from "@/components/documents/DocumentSearch";
import { userService } from "@/lib/user-service";
import { FiBookmark } from "react-icons/fi";

interface BookmarksPageProps {
  searchParams: Promise<{ q?: string }>;
}

async function BookmarkResults({ searchQuery }: { searchQuery?: string }) {
  try {
    // Gọi API backend để lấy bookmarks
    const bookmarks = await userService.getBookmarks();
    const documents = bookmarks.map((bookmark) => bookmark.document);

    // Lọc kết quả theo từ khóa tìm kiếm nếu có
    const filteredDocuments = searchQuery
      ? documents.filter(
          (doc: any) =>
            doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (doc.description &&
              doc.description
                .toLowerCase()
                .includes(searchQuery.toLowerCase())) ||
            (doc.subject &&
              doc.subject.toLowerCase().includes(searchQuery.toLowerCase()))
        )
      : documents;

    return (
      <DocumentGrid
        documents={filteredDocuments}
        bookmarkedDocIds={documents.map((doc: any) => doc.id)}
        emptyStateMessage={
          searchQuery
            ? `Không tìm thấy tài liệu đã lưu nào khớp với "${searchQuery}"`
            : "Bạn chưa lưu tài liệu nào"
        }
        emptyStateIcon={<FiBookmark className="h-12 w-12 text-white/30" />}
      />
    );
  } catch (error) {
    console.error("Lỗi khi tải danh sách bookmark:", error);
    return (
      <div className="text-center p-8 text-red-500">
        Đã xảy ra lỗi khi tải danh sách tài liệu đã lưu. Vui lòng thử lại sau.
      </div>
    );
  }
}

export default async function BookmarksPage({
  searchParams,
}: BookmarksPageProps) {
  // Trong thực tế, phải kiểm tra xem người dùng đã đăng nhập chưa
  // Nếu chưa đăng nhập, chuyển hướng đến trang đăng nhập
  // if (!session) {
  //   redirect('/auth/signin');
  // }

  const resolvedSearchParams = await searchParams;
  const searchQuery = resolvedSearchParams.q || "";

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500">
                Tài liệu đã lưu
              </h1>
              <p className="text-white/70">
                Quản lý danh sách tài liệu bạn đã đánh dấu yêu thích
              </p>
            </div>

            <DocumentSearch
              className="w-full md:w-80"
              placeholder="Tìm trong tài liệu đã lưu..."
            />
          </div>

          <div className="flex items-center gap-2 text-sm text-white/60">
            <FiBookmark className="h-4 w-4" />
            <span>
              {searchQuery
                ? `Kết quả tìm kiếm cho "${searchQuery}" trong tài liệu đã lưu`
                : "Tất cả tài liệu đã lưu"}
            </span>
          </div>

          <Suspense fallback={<DocumentGrid documents={[]} isLoading={true} />}>
            <BookmarkResults searchQuery={searchQuery} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
