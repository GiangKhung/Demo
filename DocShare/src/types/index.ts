// Định nghĩa các kiểu dữ liệu chung cho ứng dụng

export interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: 'purple' | 'pink' | 'orange';
  linkText?: string;
  linkHref?: string;
}

export interface StatItemProps {
  value: string;
  label: string;
  color: 'blue' | 'purple' | 'pink' | 'orange';
  target: string;
  suffix: string;
}

export interface FooterLinkProps {
  href: string;
  label: string;
}

export interface FooterLinkGroupProps {
  title: string;
  links: FooterLinkProps[];
}

export interface SocialLinkProps {
  href: string;
  icon: React.ReactNode;
}

// Định nghĩa kiểu dữ liệu cho người dùng
export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  emailVerified?: Date;
  createdat: Date;
  updatedat: Date;
  storageUsed?: number; // Dung lượng đã sử dụng (bytes)
  storageLimit?: number; // Giới hạn dung lượng (bytes)
}

// Định nghĩa kiểu dữ liệu cho tài liệu
export interface Document {
  id: string;
  title: string;
  description?: string;
  fileurl: string;
  thumbnailUrl?: string;
  filetype: string;
  filesize: number;
  keywords?: string[];
  subject?: string;
  ispublic: boolean;
  userid: string;
  createdat: Date;
  updatedat: Date;
  isSaved?: boolean; // Đánh dấu tài liệu đã được lưu vào tài khoản
  folder?: string; // Thư mục lưu trữ tài liệu
  tags?: string[]; // Thẻ gắn với tài liệu
}

// Định nghĩa kiểu dữ liệu cho bookmark
export interface Bookmark {
  id: string;
  userid: string;
  documentid: string;
  createdat: Date;
}

// Định nghĩa kiểu dữ liệu cho lượt xem tài liệu
export interface DocumentView {
  id: string;
  userid: string;
  documentId: string;
  createdat: Date;
}

// Định nghĩa kiểu dữ liệu cho lượt chia sẻ tài liệu
export interface DocumentShare {
  id: string;
  documentId: string;
  userid: string;
  sharedUserId?: string;
  sharedEmail?: string;
  permissionLevel: 'view' | 'download';
  expiresAt?: Date;
  createdat: Date;
}

// Định nghĩa kiểu dữ liệu cho thống kê tài liệu
export interface DocumentStats {
  id: string;
  documentId: string;
  views: number;
  downloads: number;
  shares: number;
  updatedat: Date;
}

// Định nghĩa kiểu dữ liệu cho thư mục lưu trữ
export interface Folder {
  id: string;
  name: string;
  userid: string;
  parentid?: string;
  createdat: Date;
  updatedat: Date;
}

// Định nghĩa kiểu dữ liệu cho tài liệu đã lưu
export interface SavedDocument {
  id: string;
  userid: string;
  documentid: string;
  folderid?: string;
  createdat: Date;
  updatedat: Date;
}

// Định nghĩa kiểu dữ liệu cho thẻ gắn với tài liệu
export interface Tag {
  id: string;
  name: string;
  userid: string;
  createdat: Date;
}

// Định nghĩa kiểu dữ liệu cho mối quan hệ giữa tài liệu và thẻ
export interface DocumentTag {
  id: string;
  documentid: string;
  tagid: string;
  createdat: Date;
}

// Định nghĩa kiểu dữ liệu cho hoạt động người dùng
export interface UserActivity {
  id: string;
  userid: string;
  activityType: 'upload' | 'download' | 'view' | 'share' | 'save' | 'delete';
  documentid?: string;
  description: string;
  createdat: Date;
}

// Định nghĩa kiểu dữ liệu cho thống kê tài khoản
export interface UserStats {
  totalDocuments: number;
  savedDocuments: number;
  uploadedDocuments: number;
  totalStorage: number;
  usedStorage: number;
  documentsByType: Record<string, number>;
  recentActivities: UserActivity[];
}

// Định nghĩa kiểu dữ liệu cho biểu đồ thống kê
export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string[];
    borderColor?: string[];
    borderWidth?: number;
  }[];
}
