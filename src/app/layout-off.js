import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { AuthProvider } from '@/contexts/AuthContext';

import "./globals.css";

import { Roboto } from 'next/font/google';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../theme';

const roboto = Roboto({
    weight: ['300', '400', '500', '700'],
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-roboto',
});

export const metadata = {
    title: "Admin Dashboard",
    description: "Admin Dashboard with MongoDB Integration",
};

export default function RootLayout({ children, props }) {
    return (
        <html lang="en" className={roboto.variable} suppressHydrationWarning>
            <body>
                <AppRouterCacheProvider options={{ enableCssLayer: true }}>
                    <ThemeProvider theme={theme}>
                        <AuthProvider>
                            {children}
                        </AuthProvider>
                    </ThemeProvider>
                </AppRouterCacheProvider>
            </body>
        </html>
    );
}