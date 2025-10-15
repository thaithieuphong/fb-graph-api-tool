import { User } from '@/models/User';
import { NextResponse } from 'next/server';

// GET - Lấy danh sách users
export async function GET(request) {
    console.log('request user', request)
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page')) || 1;
        const limit = parseInt(searchParams.get('limit')) || 10;
        const role = searchParams.get('role');
        console.log('role', role)
        const search = searchParams.get('search');

        let filters = {};

        if (role) {
            filters.role = role;
        }

        if (search) {
            filters.$or = [
                { username: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { 'profile.firstName': { $regex: search, $options: 'i' } },
                { 'profile.lastName': { $regex: search, $options: 'i' } }
            ];
        }

        const result = await User.getUsers(page, limit, filters);
        console.log('result user', result)

        if (result.success) {
            return NextResponse.json(result, { status: 200 });
        } else {
            return NextResponse.json({
                success: false,
                message: result.message
            }, { status: 500 });
        }
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: 'Server error',
            error: error.message
        }, { status: 500 });
    }
}

// POST - Tạo user mới
export async function POST(request) {
    try {
        const userData = await request.json();

        // Validation
        if (!userData.username || !userData.email || !userData.password) {
            return NextResponse.json({
                success: false,
                message: 'Username, email, and password are required'
            }, { status: 400 });
        }

        const result = await User.create(userData);

        if (result.success) {
            return NextResponse.json({
                success: true,
                message: 'User created successfully',
                userId: result.userId
            }, { status: 201 });
        } else {
            return NextResponse.json({
                success: false,
                message: result.message
            }, { status: 400 });
        }
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: 'Server error',
            error: error.message
        }, { status: 500 });
    }
}