'use client'

import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Box, Button, FormControl, IconButton, Input, InputAdornment, InputLabel, Alert } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { Suspense, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    })
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)
    const [alert, setAlert] = useState(null)
    const router = useRouter()

    const handleClickShowPassword = () => setShowPassword(prev => !prev)

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleMouseUpPassword = (event) => {
        event.preventDefault();
    };

    const handleInputChange = (field) => (event) => {
        setFormData(prev => ({
            ...prev,
            [field]: event.target.value
        }))
        // Xóa error khi user bắt đầu nhập
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: null
            }))
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        setLoading(true)
        setErrors({})
        setAlert(null)

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            })

            const result = await response.json()

            if (result.success) {
                setAlert({ type: 'success', message: 'Đăng nhập thành công!' })
                // Redirect sau 1 giây
                setTimeout(() => {
                    router.push('/dashboard')
                }, 1000)
            } else {
                setAlert({ type: 'error', message: result.message || 'Đăng nhập thất bại' })
                if (result.message.includes('credentials')) {
                    setErrors({
                        username: 'Tài khoản không tồn tại',
                        password: 'Mật khẩu không đúng'
                    })
                }
            }
        } catch (error) {
            console.error('Login error:', error)
            setAlert({ type: 'error', message: 'Lỗi kết nối server' })
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <Box component='div' className="w-full h-screen bg-gray-950 flex justify-center items-center p-6">
                <Suspense>
                    <form onSubmit={handleSubmit}>
                        <div className="p-6 rounded-xl bg-gray-800 min-w-80">
                            <Image width={256} height={256} src='/logo/Linux-Logo.wine.svg' className="text-center mx-auto mb-6" alt="" priority />

                            {alert && (
                                <Alert severity={alert.type} className="mb-4">
                                    {alert.message}
                                </Alert>
                            )}

                            <FormControl className="w-full" sx={{ marginBottom: '16px' }} variant="standard">
                                <InputLabel error={!!errors.username} htmlFor="input-username" sx={{ color: '#ffffff' }} >
                                    Tài khoản
                                </InputLabel>
                                <Input
                                    id="input-username"
                                    error={!!errors.username}
                                    sx={{ color: '#ffffff' }}
                                    value={formData.username}
                                    onChange={handleInputChange('username')}
                                    size="small"
                                    variant="standard"
                                    className="w-full py-1 mb-2"
                                />
                                {errors.username && <span className="text-red-700 text-xs">{errors.username}</span>}
                            </FormControl>

                            <FormControl className="w-full" sx={{ marginBottom: '24px' }} variant="standard">
                                <InputLabel error={!!errors.password} htmlFor="input-password" sx={{ color: '#ffffff' }}>
                                    Mật khẩu
                                </InputLabel>
                                <Input
                                    error={!!errors.password}
                                    id="input-password"
                                    type={showPassword ? 'text' : 'password'}
                                    size="small"
                                    sx={{ color: '#ffffff' }}
                                    variant="standard"
                                    value={formData.password}
                                    onChange={handleInputChange('password')}
                                    className="w-full py-1 mb-2"
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label={
                                                    showPassword ? 'hide the password' : 'display the password'
                                                }
                                                onClick={handleClickShowPassword}
                                                onMouseDown={handleMouseDownPassword}
                                                onMouseUp={handleMouseUpPassword}
                                                sx={{ color: '#ffffff' }}
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                />
                                {errors.password && <span className="text-red-700 text-xs">{errors.password}</span>}
                            </FormControl>

                            <Box component='div' className="flex justify-between items-center">
                                <Link href='/forgot-password' className="text-sky-500 hover:text-sky-600">Quên mật khẩu</Link>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={loading}
                                    className="float-end"
                                >
                                    {loading ? 'Đang xử lý...' : 'Đăng nhập'}
                                </Button>
                            </Box>
                        </div>
                    </form>
                </Suspense>
            </Box>
        </>
    );
}