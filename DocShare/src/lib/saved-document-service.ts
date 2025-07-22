// File service mới sử dụng dữ liệu mẫu thay vì Supabase
import { Folder, SavedDocument } from '@/types';
import { mockDocuments } from './mock-data';

// Dữ liệu mẫu cho thư mục
const mockFolders: Folder[] = [
  {
    id: '1',
    name: 'Tài liệu học tập',
    userid: '1',
    createdat: new Date('2023-05-15'),
    updatedat: new Date('2023-05-15'),
  },
  {
    id: '2',
    name: 'Tài liệu công việc',
    userid: '1',
    createdat: new Date('2023-06-20'),
    updatedat: new Date('2023-06-20'),
  },
  {
    id: '3',
    name: 'Tài liệu cá nhân',
    userid: '1',
    createdat: new Date('2023-07-10'),
    updatedat: new Date('2023-07-10'),
  },
];

// Dữ liệu mẫu cho tài liệu đã lưu
const mockSavedDocuments: SavedDocument[] = [
  {
    id: '1',
    userid: '1',
    documentid: '2',
    folderid: '1',
    createdat: new Date('2023-07-25'),
    updatedat: new Date('2023-07-25'),
  },
  {
    id: '2',
    userid: '1',
    documentid: '3',
    folderid: '2',
    createdat: new Date('2023-08-10'),
    updatedat: new Date('2023-08-10'),
  },
];

// Kiểm tra xem tài liệu đã được lưu chưa
export const isDocumentSaved = async (documentId: string): Promise<boolean> => {
  console.log('Giả lập kiểm tra tài liệu đã lưu:', documentId);
  return mockSavedDocuments.some(doc => doc.documentid === documentId);
};

// Lưu tài liệu
export const saveDocument = async (documentId: string, folderId?: string): Promise<SavedDocument> => {
  console.log('Giả lập lưu tài liệu:', documentId, folderId);
  
  const newSavedDocument: SavedDocument = {
    id: `mock-${Date.now()}`,
    userid: '1',
    documentid: documentId,
    folderid: folderId,
    createdat: new Date(),
    updatedat: new Date(),
  };
  
  return newSavedDocument;
};

// Xóa tài liệu đã lưu
export const removeSavedDocument = async (documentId: string): Promise<void> => {
  console.log('Giả lập xóa tài liệu đã lưu:', documentId);
  return;
};

// Lấy danh sách thư mục
export const getFolders = async (): Promise<Folder[]> => {
  console.log('Giả lập lấy danh sách thư mục');
  return mockFolders;
};

// Tạo thư mục mới
export const createFolder = async (name: string): Promise<Folder> => {
  console.log('Giả lập tạo thư mục mới:', name);
  
  const newFolder: Folder = {
    id: `mock-${Date.now()}`,
    name,
    userid: '1',
    createdat: new Date(),
    updatedat: new Date(),
  };
  
  return newFolder;
};

// Lấy danh sách tài liệu đã lưu
export const getSavedDocuments = async (): Promise<any[]> => {
  console.log('Giả lập lấy danh sách tài liệu đã lưu');
  
  // Kết hợp thông tin tài liệu với thông tin đã lưu
  return mockSavedDocuments.map(savedDoc => {
    const document = mockDocuments.find(doc => doc.id === savedDoc.documentid);
    const folder = mockFolders.find(folder => folder.id === savedDoc.folderid);
    
    return {
      ...document,
      savedId: savedDoc.id,
      folderid: savedDoc.folderid,
      folderName: folder?.name || 'Không có thư mục',
    };
  });
};

// Lấy thống kê người dùng
export const getUserStats = async (): Promise<any> => {
  console.log('Giả lập lấy thống kê người dùng');
  
  // Tạo dữ liệu mẫu cho thống kê người dùng
  return {
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
};
