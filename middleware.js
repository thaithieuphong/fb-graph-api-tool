import { auth } from '@/auth';

export default auth;

export const config = {
    // matcher khớp với tất cả các route ngoại trừ các tệp tĩnh,
    // API routes của Next.js và các route của Next-Auth.
    matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico).*)'],
};

