const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Load env vars
dotenv.config();

// Import models
const User = require("../models/User");
const Document = require("../models/Document");
const Bookmark = require("../models/Bookmark");
const UserActivity = require("../models/UserActivity");
const DocumentStats = require("../models/DocumentStats");

// Connect to database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB Connected for seeding");
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
};

// Sample data
const sampleUsers = [
  {
    name: "Admin User",
    email: "admin@docshare.com",
    password: "Admin123",
    role: "admin",
    storageLimit: 5 * 1024 * 1024 * 1024, // 5GB
  },
  {
    name: "Nguyễn Văn A",
    email: "user1@example.com",
    password: "User123",
    role: "user",
  },
  {
    name: "Trần Thị B",
    email: "user2@example.com",
    password: "User123",
    role: "user",
  },
];

const sampleDocuments = [
  {
    title: "Hướng dẫn sử dụng React",
    description: "Tài liệu hướng dẫn đầy đủ về React từ cơ bản đến nâng cao",
    fileurl: "/uploads/sample-react-guide.pdf",
    originalFileName: "react-guide.pdf",
    filetype: "pdf",
    filesize: 2.5 * 1024 * 1024,
    keywords: ["react", "javascript", "frontend"],
    subject: "Lập trình web",
    ispublic: true,
  },
  {
    title: "Tài liệu Next.js",
    description: "Tài liệu chính thức về Next.js và các tính năng mới nhất",
    fileurl: "/uploads/sample-nextjs-docs.pdf",
    originalFileName: "nextjs-docs.pdf",
    filetype: "pdf",
    filesize: 3.2 * 1024 * 1024,
    keywords: ["nextjs", "react", "ssr"],
    subject: "Lập trình web",
    ispublic: true,
  },
  {
    title: "Thiết kế UI với Tailwind CSS",
    description:
      "Hướng dẫn thiết kế giao diện người dùng hiện đại với Tailwind CSS",
    fileurl: "/uploads/sample-tailwind-guide.pdf",
    originalFileName: "tailwind-guide.pdf",
    filetype: "pdf",
    filesize: 1.8 * 1024 * 1024,
    keywords: ["tailwind", "css", "ui", "design"],
    subject: "Thiết kế web",
    ispublic: true,
  },
];

// Seed function
const seedDatabase = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Document.deleteMany({});
    await Bookmark.deleteMany({});
    await UserActivity.deleteMany({});
    await DocumentStats.deleteMany({});

    console.log("Cleared existing data");

    // Create users
    const users = [];
    for (const userData of sampleUsers) {
      // Không cần hash password ở đây vì User model đã có pre-save hook
      const user = await User.create(userData);
      users.push(user);
    }

    console.log("Created sample users");

    // Create documents
    const documents = [];
    for (let i = 0; i < sampleDocuments.length; i++) {
      const docData = {
        ...sampleDocuments[i],
        userid: users[i % users.length]._id,
      };
      const document = await Document.create(docData);
      documents.push(document);

      // Create document stats
      await DocumentStats.create({
        documentId: document._id,
        views: Math.floor(Math.random() * 100) + 10,
        downloads: Math.floor(Math.random() * 50) + 5,
        shares: Math.floor(Math.random() * 20) + 1,
      });
    }

    console.log("Created sample documents");

    // Create some bookmarks
    await Bookmark.create({
      userid: users[1]._id,
      documentid: documents[0]._id,
    });

    await Bookmark.create({
      userid: users[2]._id,
      documentid: documents[1]._id,
    });

    console.log("Created sample bookmarks");

    // Create some activities
    const activities = [
      {
        userid: users[1]._id,
        activityType: "upload",
        documentid: documents[0]._id,
        description: 'Đã tải lên tài liệu "Hướng dẫn sử dụng React"',
      },
      {
        userid: users[1]._id,
        activityType: "view",
        documentid: documents[1]._id,
        description: 'Đã xem tài liệu "Tài liệu Next.js"',
      },
      {
        userid: users[2]._id,
        activityType: "download",
        documentid: documents[0]._id,
        description: 'Đã tải xuống tài liệu "Hướng dẫn sử dụng React"',
      },
    ];

    await UserActivity.insertMany(activities);

    console.log("Created sample activities");

    console.log("✅ Database seeded successfully!");
    console.log("\nSample accounts:");
    console.log("Admin: admin@docshare.com / Admin123");
    console.log("User 1: user1@example.com / User123");
    console.log("User 2: user2@example.com / User123");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    mongoose.connection.close();
  }
};

// Run seeder
if (require.main === module) {
  connectDB().then(() => {
    seedDatabase();
  });
}

module.exports = seedDatabase;
