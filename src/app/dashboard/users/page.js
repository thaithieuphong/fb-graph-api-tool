// export default function Users() {
//     return (
//         <>
//             <h1>Users Page</h1>
//         </>
//     )
// }

'use client'

import { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    IconButton,
    TextField,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    Pagination,
    CircularProgress,
    Alert,
    Avatar,
    Stack,
    Typography
} from '@mui/material';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Add as AddIcon,
    Search as SearchIcon,
    Refresh as RefreshIcon
} from '@mui/icons-material';

export default function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0
    });
    const [filters, setFilters] = useState({
        search: '',
        role: ''
    });

    useEffect(() => {
        fetchUsers();
    }, [pagination.page, pagination.limit]);

    const fetchUsers = async () => {
        setLoading(true);
        setError(null);

        try {
            const queryParams = new URLSearchParams({
                page: pagination.page,
                limit: pagination.limit,
                ...(filters.search && { search: filters.search }),
                ...(filters.role && { role: filters.role })
            });

            const response = await fetch(`/api/users?${queryParams}`);
            const result = await response.json();

            if (result.success) {
                setUsers(result.users);
                setPagination(prev => ({
                    ...prev,
                    total: result.pagination.total,
                    totalPages: result.pagination.totalPages
                }));
            } else {
                setError(result.message);
            }
        } catch (error) {
            setError('Failed to fetch users');
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (event, newPage) => {
        setPagination(prev => ({ ...prev, page: newPage }));
    };

    const handleSearch = () => {
        setPagination(prev => ({ ...prev, page: 1 }));
        fetchUsers();
    };

    const handleFilterChange = (field) => (event) => {
        setFilters(prev => ({
            ...prev,
            [field]: event.target.value
        }));
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getRoleColor = (role) => {
        switch (role) {
            case 'admin': return 'error';
            case 'user': return 'primary';
            default: return 'default';
        }
    };

    if (loading && users.length === 0) {
        return (
            <Box className="flex items-center justify-center h-64">
                <CircularProgress />
                <Typography className="ml-4">Đang tải dữ liệu...</Typography>
            </Box>
        );
    }

    return (
        <>
            <Stack direction="row" justifyContent="space-between" alignItems="center" className="mb-6">
                <Typography variant="h4" component="h1">
                    Quản lý người dùng
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    color="primary"
                >
                    Thêm người dùng
                </Button>
            </Stack>

            {error && (
                <Alert severity="error" className="mb-4">
                    {error}
                </Alert>
            )}

            {/* Filters */}
            <Paper className="p-4 mb-4">
                <Stack direction="row" spacing={2} alignItems="end">
                    <TextField
                        label="Tìm kiếm"
                        variant="outlined"
                        size="small"
                        value={filters.search}
                        onChange={handleFilterChange('search')}
                        placeholder="Tên, email, username..."
                        className="flex-1"
                    />

                    <FormControl size="small" style={{ minWidth: 120 }}>
                        <InputLabel>Vai trò</InputLabel>
                        <Select
                            value={filters.role}
                            onChange={handleFilterChange('role')}
                            label="Vai trò"
                        >
                            <MenuItem value="">Tất cả</MenuItem>
                            <MenuItem value="admin">Admin</MenuItem>
                            <MenuItem value="user">User</MenuItem>
                        </Select>
                    </FormControl>

                    <Button
                        variant="contained"
                        startIcon={<SearchIcon />}
                        onClick={handleSearch}
                    >
                        Tìm kiếm
                    </Button>

                    <IconButton onClick={fetchUsers} disabled={loading}>
                        <RefreshIcon />
                    </IconButton>
                </Stack>
            </Paper>

            {/* Users Table */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Avatar</TableCell>
                            <TableCell>Tên đăng nhập</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Họ tên</TableCell>
                            <TableCell>Vai trò</TableCell>
                            <TableCell>Trạng thái</TableCell>
                            <TableCell>Ngày tạo</TableCell>
                            <TableCell>Lần đăng nhập cuối</TableCell>
                            <TableCell align="center">Thao tác</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user._id} hover>
                                <TableCell>
                                    <Avatar
                                        src={user.profile?.avatar}
                                        alt={user.username}
                                    >
                                        {user.username?.charAt(0).toUpperCase()}
                                    </Avatar>
                                </TableCell>
                                <TableCell>{user.username}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                    {user.profile?.firstName && user.profile?.lastName
                                        ? `${user.profile.firstName} ${user.profile.lastName}`
                                        : 'Chưa cập nhật'
                                    }
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={user.role}
                                        color={getRoleColor(user.role)}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={user.isActive ? 'Hoạt động' : 'Bị khóa'}
                                        color={user.isActive ? 'success' : 'default'}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>{formatDate(user.createdAt)}</TableCell>
                                <TableCell>
                                    {user.lastLogin ? formatDate(user.lastLogin) : 'Chưa đăng nhập'}
                                </TableCell>
                                <TableCell align="center">
                                    <IconButton size="small" color="primary">
                                        <EditIcon />
                                    </IconButton>
                                    {user.role !== 'admin' && (
                                        <IconButton size="small" color="error">
                                            <DeleteIcon />
                                        </IconButton>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}

                        {users.length === 0 && !loading && (
                            <TableRow>
                                <TableCell colSpan={9} align="center">
                                    Không có dữ liệu
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
                <Box className="flex justify-center mt-4">
                    <Pagination
                        count={pagination.totalPages}
                        page={pagination.page}
                        onChange={handlePageChange}
                        color="primary"
                    />
                </Box>
            )}

            {/* Stats */}
            <Box className="mt-4 p-4 bg-gray-700 rounded-lg">
                <Typography variant="body2">
                    Hiển thị {users.length} trên tổng số {pagination.total} người dùng
                </Typography>
            </Box>
        </>
    );
}