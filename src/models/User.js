import bcrypt from 'bcryptjs';
import clientPromise from '../lib/mongodb.js';

export class User {
    constructor(userData) {
        this.username = userData.username;
        this.email = userData.email;
        this.password = userData.password;
        this.role = userData.role || 'user';
        this.isActive = userData.isActive !== undefined ? userData.isActive : true;
        this.profile = userData.profile || {};
        this.createdAt = userData.createdAt || new Date();
        this.updatedAt = userData.updatedAt || new Date();
    }

    // Tạo user mới
    static async create(userData) {
        try {
            const client = await clientPromise;
            const db = client.db();
            const usersCollection = db.collection('users');

            // Hash password
            const hashedPassword = await bcrypt.hash(userData.password, 12);

            const user = new User({
                ...userData,
                password: hashedPassword
            });

            const result = await usersCollection.insertOne(user);
            return { success: true, userId: result.insertedId };
        } catch (error) {
            if (error.code === 11000) {
                return { success: false, message: 'Username or email already exists' };
            }
            return { success: false, message: error.message };
        }
    }

    // Tìm user theo username hoặc email
    static async findByCredentials(identifier) {
        try {
            const client = await clientPromise;
            const db = client.db();
            const usersCollection = db.collection('users');

            const user = await usersCollection.findOne({
                $or: [
                    { username: identifier },
                    { email: identifier }
                ],
                isActive: true
            });

            return user;
        } catch (error) {
            throw new Error(`Error finding user: ${error.message}`);
        }
    }

    // Tìm user theo ID
    static async findById(userId) {
        try {
            const client = await clientPromise;
            const db = client.db();
            const usersCollection = db.collection('users');

            const user = await usersCollection.findOne({ _id: userId });
            return user;
        } catch (error) {
            throw new Error(`Error finding user by ID: ${error.message}`);
        }
    }

    // Cập nhật thông tin user
    static async updateById(userId, updateData) {
        try {
            const client = await clientPromise;
            const db = client.db();
            const usersCollection = db.collection('users');

            const result = await usersCollection.updateOne(
                { _id: userId },
                {
                    $set: {
                        ...updateData,
                        updatedAt: new Date()
                    }
                }
            );

            return { success: result.modifiedCount > 0 };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }

    // Lấy danh sách users với phân trang
    static async getUsers(page = 1, limit = 10, filters = {}) {
        try {
            const client = await clientPromise;
            const db = client.db();
            const usersCollection = db.collection('users');

            const skip = (page - 1) * limit;

            const users = await usersCollection
                .find(filters, { projection: { password: 0 } }) // Không trả về password
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .toArray();

            const total = await usersCollection.countDocuments(filters);

            return {
                success: true,
                users,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit)
                }
            };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }

    // Verify password
    static async verifyPassword(plainPassword, hashedPassword) {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }

    // Kiểm tra quyền admin
    static isAdmin(user) {
        return user && user.role === 'admin';
    }

    // Xóa user
    static async deleteById(userId) {
        try {
            const client = await clientPromise;
            const db = client.db();
            const usersCollection = db.collection('users');

            const result = await usersCollection.deleteOne({ _id: userId });
            return { success: result.deletedCount > 0 };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }

    // Đếm số lượng admin
    static async countAdmins() {
        try {
            const client = await clientPromise;
            const db = client.db();
            const usersCollection = db.collection('users');

            const count = await usersCollection.countDocuments({ role: 'admin', isActive: true });
            return count;
        } catch (error) {
            throw new Error(`Error counting admins: ${error.message}`);
        }
    }
}