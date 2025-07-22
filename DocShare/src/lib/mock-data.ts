// Dữ liệu mẫu cho ứng dụng DocShare
// Được sử dụng khi không có backend

import { Document, User, Bookmark, DocumentStats, UserStats } from '@/types';

// Dữ liệu người dùng mẫu
export const mockUser: User = {
  id: '1',
  name: 'Người Dùng Mẫu',
  email: 'user@example.com',
  image: 'https://ui-avatars.com/api/?name=Người+Dùng+Mẫu&background=random',
  createdat: new Date('2023-01-01'),
  updatedat: new Date('2023-01-01'),
  storageUsed: 1024 * 1024 * 100, // 100MB
  storageLimit: 1024 * 1024 * 1024, // 1GB
};

// Dữ liệu tài liệu mẫu
export const mockDocuments: Document[] = [
  {
    id: '1',
    title: 'Hướng dẫn sử dụng React',
    description: 'Tài liệu hướng dẫn đầy đủ về React từ cơ bản đến nâng cao',
    fileurl: '/mock-files/react-guide.pdf',
    thumbnailUrl: 'https://via.placeholder.com/300x200?text=React+Guide',
    filetype: 'pdf',
    filesize: 1024 * 1024 * 2.5, // 2.5MB
    keywords: ['react', 'javascript', 'frontend'],
    subject: 'Lập trình web',
    ispublic: true,
    userid: '1',
    createdat: new Date('2023-06-15'),
    updatedat: new Date('2023-06-15'),
  },
  {
    id: '2',
    title: 'Tài liệu Next.js',
    description: 'Tài liệu chính thức về Next.js và các tính năng mới nhất',
    fileurl: '/mock-files/nextjs-docs.pdf',
    thumbnailUrl: 'https://via.placeholder.com/300x200?text=Next.js+Docs',
    filetype: 'pdf',
    filesize: 1024 * 1024 * 3.2, // 3.2MB
    keywords: ['nextjs', 'react', 'ssr'],
    subject: 'Lập trình web',
    ispublic: true,
    userid: '1',
    createdat: new Date('2023-07-20'),
    updatedat: new Date('2023-07-20'),
  },
  {
    id: '3',
    title: 'Thiết kế UI với Tailwind CSS',
    description: 'Hướng dẫn thiết kế giao diện người dùng hiện đại với Tailwind CSS',
    fileurl: '/mock-files/tailwind-guide.pdf',
    thumbnailUrl: 'https://via.placeholder.com/300x200?text=Tailwind+CSS',
    filetype: 'pdf',
    filesize: 1024 * 1024 * 1.8, // 1.8MB
    keywords: ['tailwind', 'css', 'ui', 'design'],
    subject: 'Thiết kế web',
    ispublic: true,
    userid: '1',
    createdat: new Date('2023-08-05'),
    updatedat: new Date('2023-08-05'),
  },
  {
    id: '4',
    title: 'TypeScript cho người mới bắt đầu',
    description: 'Hướng dẫn TypeScript từ cơ bản đến nâng cao cho người mới',
    fileurl: '/mock-files/typescript-guide.pdf',
    thumbnailUrl: 'https://via.placeholder.com/300x200?text=TypeScript',
    filetype: 'pdf',
    filesize: 1024 * 1024 * 2.1, // 2.1MB
    keywords: ['typescript', 'javascript', 'programming'],
    subject: 'Lập trình',
    ispublic: true,
    userid: '1',
    createdat: new Date('2023-09-10'),
    updatedat: new Date('2023-09-10'),
  },
  {
    id: '5',
    title: 'Bảo mật ứng dụng web',
    description: 'Các phương pháp và kỹ thuật bảo mật cho ứng dụng web hiện đại',
    fileurl: '/mock-files/web-security.pdf',
    thumbnailUrl: 'https://via.placeholder.com/300x200?text=Web+Security',
    filetype: 'pdf',
    filesize: 1024 * 1024 * 4.3, // 4.3MB
    keywords: ['security', 'web', 'authentication'],
    subject: 'Bảo mật',
    ispublic: false,
    userid: '1',
    createdat: new Date('2023-10-15'),
    updatedat: new Date('2023-10-15'),
  },
];

// Dữ liệu bookmark mẫu
export const mockBookmarks: Bookmark[] = [
  {
    id: '1',
    userid: '1',
    documentid: '2',
    createdat: new Date('2023-07-25'),
  },
  {
    id: '2',
    userid: '1',
    documentid: '3',
    createdat: new Date('2023-08-10'),
  },
];

// Dữ liệu thống kê tài liệu mẫu
export const mockDocumentStats: DocumentStats[] = [
  {
    id: '1',
    documentId: '1',
    views: 120,
    downloads: 45,
    shares: 12,
    updatedat: new Date('2023-11-01'),
  },
  {
    id: '2',
    documentId: '2',
    views: 85,
    downloads: 32,
    shares: 8,
    updatedat: new Date('2023-11-01'),
  },
  {
    id: '3',
    documentId: '3',
    views: 210,
    downloads: 78,
    shares: 25,
    updatedat: new Date('2023-11-01'),
  },
  {
    id: '4',
    documentId: '4',
    views: 65,
    downloads: 28,
    shares: 5,
    updatedat: new Date('2023-11-01'),
  },
  {
    id: '5',
    documentId: '5',
    views: 42,
    downloads: 18,
    shares: 3,
    updatedat: new Date('2023-11-01'),
  },
];

// Dữ liệu thống kê người dùng mẫu
export const mockUserStats: UserStats = {
  totalDocuments: 5,
  savedDocuments: 2,
  uploadedDocuments: 5,
  totalStorage: 1024 * 1024 * 1024, // 1GB
  usedStorage: 1024 * 1024 * 100, // 100MB
  documentsByType: {
    pdf: 5,
    docx: 0,
    xlsx: 0,
    pptx: 0,
    txt: 0,
  },
  recentActivities: [
    {
      id: '1',
      userid: '1',
      activityType: 'upload',
      documentid: '5',
      description: 'Đã tải lên tài liệu "Bảo mật ứng dụng web"',
      createdat: new Date('2023-10-15'),
    },
    {
      id: '2',
      userid: '1',
      activityType: 'view',
      documentid: '3',
      description: 'Đã xem tài liệu "Thiết kế UI với Tailwind CSS"',
      createdat: new Date('2023-10-20'),
    },
    {
      id: '3',
      userid: '1',
      activityType: 'share',
      documentid: '1',
      description: 'Đã chia sẻ tài liệu "Hướng dẫn sử dụng React"',
      createdat: new Date('2023-10-25'),
    },
    {
      id: '4',
      userid: '1',
      activityType: 'download',
      documentid: '2',
      description: 'Đã tải xuống tài liệu "Tài liệu Next.js"',
      createdat: new Date('2023-10-30'),
    },
    {
      id: '5',
      userid: '1',
      activityType: 'save',
      documentid: '4',
      description: 'Đã lưu tài liệu "TypeScript cho người mới bắt đầu"',
      createdat: new Date('2023-11-01'),
    },
  ],
};

// Hàm trả về tài liệu công khai
export const getPublicDocuments = async (): Promise<Document[]> => {
  return mockDocuments.filter(doc => doc.ispublic);
};

// Hàm trả về tài liệu theo ID
export const getDocumentById = async (id: string): Promise<Document | null> => {
  const document = mockDocuments.find(doc => doc.id === id);
  return document || null;
};

// Hàm trả về tài liệu của người dùng
export const getUserDocuments = async (): Promise<Document[]> => {
  return mockDocuments;
};

// Hàm tìm kiếm tài liệu
export const searchDocuments = async (query: string): Promise<Document[]> => {
  const lowercaseQuery = query.toLowerCase();
  return mockDocuments.filter(
    doc => 
      doc.ispublic && 
      (doc.title.toLowerCase().includes(lowercaseQuery) || 
       (doc.description && doc.description.toLowerCase().includes(lowercaseQuery)) ||
       (doc.subject && doc.subject.toLowerCase().includes(lowercaseQuery)))
  );
};

// Hàm lấy bookmark của người dùng
export const getUserBookmarks = async (): Promise<Document[]> => {
  const bookmarkedDocIds = mockBookmarks.map(bookmark => bookmark.documentid);
  return mockDocuments.filter(doc => bookmarkedDocIds.includes(doc.id));
};

// Hàm lấy thống kê người dùng
export const getUserStats = async (): Promise<UserStats> => {
  return mockUserStats;
};

// Hàm giả lập đăng nhập
export const mockSignIn = async (): Promise<User> => {
  return mockUser;
};

// Hàm giả lập đăng ký
export const mockSignUp = async (): Promise<User> => {
  return mockUser;
};

// Hàm giả lập đăng xuất
export const mockSignOut = async (): Promise<void> => {
  return;
};

// Hàm giả lập lấy người dùng hiện tại
export const getCurrentUser = async (): Promise<User | null> => {
  return mockUser;
};
