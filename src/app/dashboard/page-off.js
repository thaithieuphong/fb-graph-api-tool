'use client'

import { useEffect, useState } from 'react';
import { Alert, Button, Box, CircularProgress, Typography } from '@mui/material';

export default function Dashboard() {
    const [initStatus, setInitStatus] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkInitialization();
    }, []);

    const checkInitialization = async () => {
        try {
            const response = await fetch('/api/init');
            const result = await response.json();
            setInitStatus(result);
        } catch (error) {
            setInitStatus({
                success: false,
                message: 'Failed to check initialization status',
                error: error.message
            });
        } finally {
            setLoading(false);
        }
    };

    const forceReInitialize = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/init', { method: 'POST' });
            const result = await response.json();
            setInitStatus(result);
        } catch (error) {
            setInitStatus({
                success: false,
                message: 'Failed to re-initialize',
                error: error.message
            });
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Box className="flex items-center justify-center h-64">
                <CircularProgress />
                <Typography className="ml-4">Đang kiểm tra hệ thống...</Typography>
            </Box>
        );
    }

    return (
        <>
            <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

            {/* System Status */}
            <Box className="mb-6">
                <Typography variant="h6" className="mb-3">Trạng thái hệ thống</Typography>

                {initStatus && (
                    <Alert
                        severity={initStatus.success ? 'success' : 'error'}
                        className="mb-3"
                    >
                        {initStatus.message}
                        {initStatus.adminResult && (
                            <div className="mt-2 text-sm">
                                Admin ID: {initStatus.adminResult.adminId || 'Đã tồn tại'}
                            </div>
                        )}
                    </Alert>
                )}

                {process.env.NODE_ENV === 'development' && (
                    <Button
                        variant="outlined"
                        onClick={forceReInitialize}
                        disabled={loading}
                        className="mt-2"
                    >
                        Force Re-initialize (Dev Only)
                    </Button>
                )}
            </Box>

            {/* Dashboard Content */}
            <Box className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Box className="bg-gray-700 p-6 rounded-lg">
                    <Typography variant="h6" className="mb-2">Tổng bài viết</Typography>
                    <Typography variant="h4" className="text-blue-400">0</Typography>
                </Box>

                <Box className="bg-gray-700 p-6 rounded-lg">
                    <Typography variant="h6" className="mb-2">Tổng sản phẩm</Typography>
                    <Typography variant="h4" className="text-green-400">0</Typography>
                </Box>

                <Box className="bg-gray-700 p-6 rounded-lg">
                    <Typography variant="h6" className="mb-2">Tổng người dùng</Typography>
                    <Typography variant="h4" className="text-purple-400">1</Typography>
                </Box>
            </Box>

            {/* Quick Actions */}
            <Box className="mt-8">
                <Typography variant="h6" className="mb-4">Thao tác nhanh</Typography>
                <Box className="flex gap-4">
                    <Button variant="contained" color="primary">
                        Tạo bài viết mới
                    </Button>
                    <Button variant="contained" color="secondary">
                        Thêm sản phẩm
                    </Button>
                    <Button variant="outlined">
                        Quản lý người dùng
                    </Button>
                </Box>
            </Box>
        </>
    );
}