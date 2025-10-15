// src/middlewares/withAuth.js
import { NextResponse } from 'next/server';

export function withAuth(middleware) {
    return async (request, event) => {
        // Giả sử token được lưu trong cookie có tên 'auth-token'
        const token = request.cookies.get('auth-token')?.value;

        // Đường dẫn cần bảo vệ
        const protectedPaths = ['/dashboard'];
        const isProtectedPath = protectedPaths.some(path =>
            request.nextUrl.pathname.startsWith(path)
        );

        if (isProtectedPath && !token) {
            // Chuyển hướng đến trang login nếu chưa xác thực
            const signInUrl = new URL('/auth/login', request.url);
            signInUrl.searchParams.set('callbackUrl', request.nextUrl.pathname);
            return NextResponse.redirect(signInUrl);
        }

        // Nếu đã xác thực hoặc không phải route được bảo vệ, chuyển đến middleware tiếp theo
        return middleware(request, event);
    };
}