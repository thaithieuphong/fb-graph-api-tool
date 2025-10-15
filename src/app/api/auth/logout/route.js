import { NextResponse } from 'next/server';

export async function POST() {
    console.log('logout')
    try {
        const response = NextResponse.json({
            success: true,
            message: 'Logged out successfully'
        }, { status: 200 });

        // Xóa auth cookie
        response.cookies.set('auth-token', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 0, // Expire immediately
            path: '/'
        });

        return response;
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: 'Logout failed',
            error: error.message
        }, { status: 500 });
    }
}