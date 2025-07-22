// MongoDB initialization script for Docker
db = db.getSiblingDB('docshare');

// Create collections
db.createCollection('users');
db.createCollection('documents');
db.createCollection('bookmarks');
db.createCollection('useractivities');

// Create indexes for better performance
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "createdat": -1 });

db.documents.createIndex({ "userid": 1 });
db.documents.createIndex({ "ispublic": 1 });
db.documents.createIndex({ "createdat": -1 });
db.documents.createIndex({ "title": "text", "description": "text", "subject": "text" });

db.bookmarks.createIndex({ "userid": 1, "documentid": 1 }, { unique: true });
db.bookmarks.createIndex({ "createdat": -1 });

db.useractivities.createIndex({ "userid": 1 });
db.useractivities.createIndex({ "createdat": -1 });

print('DocShare database initialized successfully!');
