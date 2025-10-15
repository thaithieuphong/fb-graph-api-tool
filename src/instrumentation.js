import clientPromise from './lib/mongodb.js';
import { HashPassword } from './lib/hashAndComparePw.js';

export async function register() {
    try {
        console.log('🚀 Bắt đầu khởi tạo ứng dụng...\n');
        console.log('📊 Đang tạo chỉ mục cơ sở dữ liệu...\n');
        const client = await clientPromise;
        const db = client.db();
        const usersCollection = db.collection('users');

        // Tạo unique index cho username và email
        await usersCollection.createIndex({ username: 1 }, { unique: true });
        await usersCollection.createIndex({ email: 1 }, { unique: true });

        console.log('✅ Chỉ mục cơ sở dữ liệu đã được tạo thành công\n');
        // Khởi tạo tài khoản admin
        console.log('👤 Đang khởi tạo tài khoản quản trị...\n');

        // Kiểm tra xem admin đã tồn tại chưa
        const existingAdmin = await usersCollection.findOne({
            $or: [
                { username: process.env.ADMIN_USERNAME },
                { email: process.env.ADMIN_EMAIL },
                { role: 'admin' }
            ]
        });

        if (existingAdmin) {
            console.log('✅ Tài khoản quản trị đã tồn tại, bỏ qua bước khởi tạo.\n');
            return
        }

        // Tạo tài khoản admin mới
        const hashedPassword = await HashPassword(process.env.ADMIN_PASSWORD);

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
            console.log('🎉 Tài khoản quản trị đã được tạo thành công!\n');
            console.log(`Tên người dùng: ${process.env.ADMIN_USERNAME}`);
            console.log(`Email: ${process.env.ADMIN_EMAIL}\n`);
        } else {
            console.log('Không tạo được tài khoản quản trị\n')
        }

        console.log('✅ Đã hoàn tất khởi tạo ứng dụng!\n');

    } catch (error) {
        console.error('❌ Khởi tạo ứng dụng không thành công:', error);
    }

}