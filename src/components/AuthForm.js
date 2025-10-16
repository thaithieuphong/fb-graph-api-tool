'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Container,
    Paper,
    TextField,
    Typography,
} from '@mui/material';

export default function AuthForm() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [showTwoFactor, setShowTwoFactor] = useState(false);
    const [twoFactorCode, setTwoFactorCode] = useState('');

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setError(''); setSuccess('');
        setLoading(true);

        try {
            const result = await signIn('credentials', {
                redirect: false, // Tắt chuyển hướng tự động để xử lý lỗi
                username,
                password,
            });

            if (result.error) {
                setError('Tên đăng nhập hoặc mật khẩu không đúng.');
            } else if (result.ok) {
                // Nếu đăng nhập thành công mà không có lỗi, chuyển hướng
                router.push('/dashboard');
            } else if (!result.ok && !result.error) {
                // Trường hợp đặc biệt: signIn không lỗi, không ok -> cần 2FA
                setShowTwoFactor(true);
            }
        } catch (err) {
            console.error('Login submission error:', err);
            setError('Đã có lỗi xảy ra. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    const handleTwoFactorSubmit = async (e) => {
        e.preventDefault();
        setError(''); setSuccess('');
        setLoading(true);

        try {
            const result = await signIn('credentials', {
                redirect: false,
                username, // Gửi lại username để xác định người dùng
                twoFactorCode,
            });

            if (result.error) {
                setError('Mã xác thực không đúng hoặc đã hết hạn.');
            } else if (result.ok) {
                setSuccess('Đăng nhập thành công! Đang chuyển hướng...');
                router.push('/dashboard');
            } else {
                setError('Đã có lỗi không xác định xảy ra.');
            }

        } catch (err) {
            console.error('2FA submission error:', err);
            setError('Đã có lỗi xảy ra. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    }

    // Thay đổi hàm submit dựa trên trạng thái
    const handleSubmit = showTwoFactor ? handleTwoFactorSubmit : handlePasswordSubmit;

    return (
        <Container component="main" maxWidth="xs">
            <Paper
                elevation={3}
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: 4,
                    borderRadius: 2,
                }}
            >
                <Typography component="h1" variant="h5">
                    {showTwoFactor ? 'Xác thực hai lớp' : 'Đăng Nhập'}
                </Typography>
                {showTwoFactor && <Typography variant="body2" sx={{ mt: 1, textAlign: 'center' }}>Mở ứng dụng xác thực của bạn và nhập mã.</Typography>}

                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }} noValidate>
                    {!showTwoFactor ? (
                        <>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="username"
                                label="Tên đăng nhập hoặc Email"
                                name="username"
                                autoComplete="username"
                                autoFocus
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                disabled={loading}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Mật khẩu"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={loading}
                            />
                        </>
                    ) : (
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="2fa-code"
                            label="Mã xác thực"
                            type="text"
                            id="2fa-code"
                            autoFocus
                            value={twoFactorCode}
                            onChange={(e) => setTwoFactorCode(e.target.value)}
                            disabled={loading}
                            inputProps={{ maxLength: 6, style: { textAlign: 'center', letterSpacing: '0.5em' } }}
                        />
                    )}

                    {error && <Alert severity="error" sx={{ width: '100%', mt: 2 }}>{error}</Alert>}
                    {success && <Alert severity="success" sx={{ width: '100%', mt: 2 }}>{success}</Alert>}

                    <Box sx={{ position: 'relative', mt: 3, mb: 2 }}>
                        <Button type="submit" fullWidth variant="contained" disabled={loading}>
                            {showTwoFactor ? 'Xác Nhận' : 'Đăng Nhập'}
                        </Button>
                        {loading && <CircularProgress size={24} sx={{ position: 'absolute', top: '50%', left: '50%', marginTop: '-12px', marginLeft: '-12px' }} />}
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
}