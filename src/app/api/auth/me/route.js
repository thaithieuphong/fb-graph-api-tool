import { verifyToken } from '@/lib/auth';
import { User } from '@/models/User';
import { NextResponse } from 'next/server';

export async function GET(request) {
    try {
        const token = request.cookies.get('auth-token')?.value;

        if (!token) {
            return NextResponse.json({
                success: false,
                message: 'No authentication token'
            }, { status: 401 });
        }

        const payload = verifyToken(token);
        if (!payload) {
            return NextResponse.json({
                success: false,
                message: 'Invalid or expired token'
            }, { status: 401 });
        }

        // Lấy thông tin user mới nhất từ database
        const user = await User.findById(payload.userId);
        if (!user || !user.isActive) {
            return NextResponse.json({
                success: false,
                message: 'User not found or inactive'
            }, { status: 401 });
        }

        // Trả về user info (không có password)
        const { password, ...userWithoutPassword } = user;

        return NextResponse.json({
            success: true,
            user: userWithoutPassword
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: 'Server error',
            error: error.message
        }, { status: 500 });
    }
}