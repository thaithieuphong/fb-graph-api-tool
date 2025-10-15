import bcrypt from 'bcrypt';
import { generateToken } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';
import { NextResponse } from 'next/server';

export async function POST(request) {
    console.log('nhận request', request)
    try {
        const { username, password } = await request.json();

        if (!username || !password) {
            return NextResponse.json({
                success: false,
                message: 'Username and password are required'
            }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db();
        const usersCollection = db.collection('users');

        // Tìm user theo username hoặc email
        const user = await usersCollection.findOne({
            $or: [
                { username: username },
                { email: username }
            ],
            isActive: true
        });

        if (!user) {
            return NextResponse.json({
                success: false,
                message: 'Invalid credentials'
            }, { status: 401 });
        }

        // Kiểm tra mật khẩu
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return NextResponse.json({
                success: false,
                message: 'Invalid credentials'
            }, { status: 401 });
        }

        // Cập nhật lastLogin
        await usersCollection.updateOne(
            { _id: user._id },
            {
                $set: {
                    lastLogin: new Date(),
                    updatedAt: new Date()
                }
            }
        );

        // Tạo JWT token
        const token = generateToken(user);

        // Tạo response với user info (không bao gồm password)
        const { password: _, ...userWithoutPassword } = user;

        const response = NextResponse.json({
            success: true,
            message: 'Login successful',
            user: userWithoutPassword
        }, { status: 200 });

        // Set JWT cookie
        response.cookies.set('auth-token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: '/'
        });
        return response;

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({
            success: false,
            message: 'Server error during login',
            error: error.message
        }, { status: 500 });
    }
}