import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import clientPromise from '@/lib/mongodb';
import bcrypt from 'bcrypt';
import { authenticator } from 'otplib';

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            // Bạn có thể tùy chỉnh form đăng nhập được tạo tự động bởi Next-Auth
            // hoặc sử dụng form của riêng bạn.
            name: 'Credentials',
            credentials: {
                username: { label: 'Username', type: 'text', placeholder: 'jsmith' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                // Nếu không có username, hoặc có cả password và 2FA code (không hợp lệ)
                if (!credentials?.username || (credentials.password && credentials.twoFactorCode)) {
                    return null;
                }

                const client = await clientPromise;
                const usersCollection = client.db().collection('users');

                // Tìm user theo username hoặc email
                const user = await usersCollection.findOne({
                    $or: [{ username: credentials.username }, { email: credentials.username }],
                    isActive: true,
                });

                if (!user) {
                    return null;
                }

                // --- XỬ LÝ XÁC THỰC 2 LỚP (BƯỚC 2) ---
                if (user.twoFactorEnabled && credentials.twoFactorCode) {
                    // Xác minh mã TOTP
                    const isValid = authenticator.verify({
                        token: credentials.twoFactorCode,
                        secret: user.twoFactorSecret, // Giả sử secret được lưu trữ trực tiếp
                    });

                    if (!isValid) {
                        return null; // Mã không hợp lệ
                    }
                    // Mã hợp lệ, trả về đầy đủ thông tin user để hoàn tất đăng nhập
                    return {
                        id: user._id.toString(),
                        name: user.username,
                        email: user.email,
                        role: user.role,
                    };
                }

                // --- XỬ LÝ XÁC THỰC MẬT KHẨU (BƯỚC 1) ---
                if (!credentials.password) {
                    return null; // Thiếu mật khẩu ở bước 1
                }

                // So sánh mật khẩu
                const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
                if (!isPasswordValid) {
                    return null;
                }

                // Nếu mật khẩu đúng và người dùng đã bật 2FA,
                // trả về một đối tượng đặc biệt để báo hiệu cần bước 2.
                if (user.twoFactorEnabled) {
                    return { id: user._id.toString(), twoFactor: true };
                }

                // Nếu mật khẩu đúng và không bật 2FA, trả về thông tin user để hoàn tất đăng nhập
                return { id: user._id.toString(), name: user.username, email: user.email, role: user.role };
            },
        }),
    ],
    callbacks: {
        // Callback này được gọi để thêm thông tin vào JWT
        jwt({ token, user }) {
            if (user) {
                // Nếu là user từ bước 1 của 2FA, chỉ thêm cờ twoFactor
                if (user.twoFactor) {
                    token.twoFactor = true;
                    return token;
                }
                token.role = user.role;
                token.id = user.id;
            }
            return token;
        },
        // Callback này được gọi để thêm thông tin vào đối tượng session phía client
        session({ session, token, user }) {
            if (token && session.user) {
                session.user.role = token.role;
                session.user.id = token.id;
            }
            return session;
        },
    },
    pages: {
        signIn: '/', // Trang đăng nhập của chúng ta là trang chủ
        error: '/', // Chuyển hướng về trang chủ nếu có lỗi
    },
});