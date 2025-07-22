import api from './api';
import { User, UserStats, UserActivity, Bookmark } from '@/types';

interface UserStatsResponse {
  stats: UserStats;
}

interface UserActivitiesResponse {
  activities: UserActivity[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

interface BookmarksResponse {
  bookmarks: Bookmark[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export const userService = {
  // Lấy thống kê user
  async getUserStats(): Promise<UserStats> {
    try {
      const response = await api.get<{ success: boolean; data: UserStatsResponse }>('/users/stats');
      return response.data.data.stats;
    } catch (error: any) {
      console.error('Error fetching user stats:', error);
      throw new Error(error.response?.data?.error || 'Không thể tải thống kê người dùng');
    }
  },

  // Lấy hoạt động user
  async getUserActivities(params: Record<string, any> = {}): Promise<UserActivitiesResponse> {
    try {
      const response = await api.get<{ success: boolean; data: UserActivitiesResponse }>('/users/activities', { params });
      return response.data.data;
    } catch (error: any) {
      console.error('Error fetching user activities:', error);
      throw new Error(error.response?.data?.error || 'Không thể tải hoạt động người dùng');
    }
  },

  // Lấy bookmarks
  async getBookmarks(params: Record<string, any> = {}): Promise<BookmarksResponse> {
    try {
      const response = await api.get<{ success: boolean; data: BookmarksResponse }>('/users/bookmarks', { params });
      return response.data.data;
    } catch (error: any) {
      console.error('Error fetching bookmarks:', error);
      throw new Error(error.response?.data?.error || 'Không thể tải danh sách bookmark');
    }
  },

  // Thêm bookmark
  async addBookmark(documentId: string, note: string = ''): Promise<Bookmark> {
    try {
      const response = await api.post<{ success: boolean; data: { bookmark: Bookmark } }>(`/users/bookmarks/${documentId}`, { note });
      return response.data.data.bookmark;
    } catch (error: any) {
      console.error('Error adding bookmark:', error);
      throw new Error(error.response?.data?.error || 'Không thể thêm bookmark');
    }
  },

  // Xóa bookmark
  async removeBookmark(documentId: string): Promise<boolean> {
    try {
      await api.delete(`/users/bookmarks/${documentId}`);
      return true;
    } catch (error: any) {
      console.error('Error removing bookmark:', error);
      throw new Error(error.response?.data?.error || 'Không thể xóa bookmark');
    }
  },

  // Kiểm tra xem tài liệu đã được bookmark chưa
  async isBookmarked(documentId: string): Promise<boolean> {
    try {
      const bookmarks = await this.getBookmarks();
      return bookmarks.bookmarks.some(bookmark => bookmark.documentid === documentId);
    } catch (error) {
      return false;
    }
  }
};

export default userService;
