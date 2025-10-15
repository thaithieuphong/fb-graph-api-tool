// scripts/init-admin.js
import '@dotenvx/dotenvx/config'
const bcrypt = require('bcryptjs');
const { MongoClient } = require('mongodb');

// Load environment variables
config({ path: '.env.local' });

async function initAdmin() {
    const client = new MongoClient(process.env.MONGODB_URI);

    try {
        await client.connect();
        console.log('🔌 Connected to MongoDB');

        const db = client.db();
        const usersCollection = db.collection('users');

        // Kiểm tra admin đã tồn tại
        const existingAdmin = await usersCollection.findOne({
            $or: [
                { username: process.env.ADMIN_USERNAME },
                { email: process.env.ADMIN_EMAIL },
                { role: 'admin' }
            ]
        });

        if (existingAdmin) {
            console.log('✅ Admin account already exists');
            console.log(`Username: ${existingAdmin.username}`);
            console.log(`Email: ${existingAdmin.email}`);
            return;
        }

        // Tạo indexes
        await usersCollection.createIndex({ username: 1 }, { unique: true });
        await usersCollection.createIndex({ email: 1 }, { unique: true });
        console.log('📊 Database indexes created');

        // Tạo admin mới
        const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);

        const adminUser = {
            username: process.env.ADMIN_USERNAME,
            email: process.env.ADMIN_EMAIL,
            password: hashedPassword,
            role: 'admin',
            createdAt: new Date(),
            updatedAt: new Date(),
            isActive: true,
            profile: {
                firstName: 'System',
                lastName: 'Administrator',
                avatar: null
            }
        };

        const result = await usersCollection.insertOne(adminUser);

        if (result.insertedId) {
            console.log('🎉 Admin account created successfully!');
            console.log(`Username: ${process.env.ADMIN_USERNAME}`);
            console.log(`Email: ${process.env.ADMIN_EMAIL}`);
            console.log(`Password: ${process.env.ADMIN_PASSWORD}`);
        }

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await client.close();
        console.log('🔚 Database connection closed');
    }
}

initAdmin();