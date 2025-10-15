'use client'

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

export default function ProtectedRoute({ children, requireAdmin = false }) {
    const { user, loading, isAuthenticated, isAdmin } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (!isAuthenticated) {
                router.push('/');
                return;
            }

            if (requireAdmin && !isAdmin) {
                router.push('/dashboard'); // Redirect to dashboard if not admin
                return;
            }
        }
    }, [loading, isAuthenticated, isAdmin, requireAdmin, router]);

    if (loading) {
        return (
            <Box className="flex items-center justify-center h-screen">
                <CircularProgress />
                <Typography className="ml-4">Đang xác thực...</Typography>
            </Box>
        );
    }

    if (!isAuthenticated) {
        return (
            <Box className="flex items-center justify-center h-screen">
                <Typography>Redirecting to login...</Typography>
            </Box>
        );
    }

    if (requireAdmin && !isAdmin) {
        return (
            <Box className="flex items-center justify-center h-screen">
                <Typography color="error">Access denied. Admin privileges required.</Typography>
            </Box>
        );
    }

    return children;
}