// scripts/reset-admin.js
const { config } = require('dotenv');
const { MongoClient } = require('mongodb');

// Load environment variables
config({ path: '.env.local' });

async function resetAdmin() {
    const client = new MongoClient(process.env.MONGODB_URI);

    try {
        await client.connect();
        console.log('🔌 Connected to MongoDB');

        const db = client.db();
        const usersCollection = db.collection('users');

        // Xóa tất cả admin accounts
        const deleteResult = await usersCollection.deleteMany({ role: 'admin' });
        console.log(`🗑️  Deleted ${deleteResult.deletedCount} admin account(s)`);

        // Hoặc xóa toàn bộ users collection (cẩn thận!)
        // await usersCollection.drop();
        // console.log('🗑️  Dropped users collection');

        console.log('✅ Admin reset completed!');
        console.log('Run "npm run init-admin" to create new admin account');

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await client.close();
        console.log('🔚 Database connection closed');
    }
}

resetAdmin();