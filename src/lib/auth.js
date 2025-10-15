import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'ma-bao-mat-jwt';
const JWT_EXPIRES_IN = '7d';

// Tạo JWT token
export function generateToken(user) {
    return jwt.sign(
        {
            userId: user._id,
            username: user.username,
            email: user.email,
            role: user.role
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
    );
}

// Verify JWT token
export function verifyToken(token) {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
}

// Set auth cookie
export function setAuthCookie(token) {
    const cookieStore = cookies();
    cookieStore.set('auth-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7 // 7 days
    });
}

// Get auth cookie
export function getAuthCookie() {
    const cookieStore = cookies();
    return cookieStore.get('auth-token')?.value;
}

// Remove auth cookie
export function removeAuthCookie() {
    const cookieStore = cookies();
    cookieStore.delete('auth-token');
}

// Middleware để kiểm tra authentication
export function requireAuth(handler) {
    return async (request) => {
        const token = request.cookies.get('auth-token')?.value;

        if (!token) {
            return Response.json(
                { success: false, message: 'Authentication required' },
                { status: 401 }
            );
        }

        const payload = verifyToken(token);
        if (!payload) {
            return Response.json(
                { success: false, message: 'Invalid token' },
                { status: 401 }
            );
        }

        // Attach user info to request
        request.user = payload;
        return handler(request);
    };
}

// Middleware để kiểm tra quyền admin
export function requireAdmin(handler) {
    return requireAuth(async (request) => {
        if (request.user.role !== 'admin') {
            return Response.json(
                { success: false, message: 'Admin access required' },
                { status: 403 }
            );
        }

        return handler(request);
    });
}