'use client'

import { useState, useEffect } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Box, Button, FormControl, IconButton, Input, InputAdornment, InputLabel, Alert, CircularProgress } from "@mui/material";
import Link from "next/link";
import Image from "next/image";

import { signIn } from "next-auth/react"
import { redirect } from "next/navigation";

const AuthForm = ({ mode, onSubmit, resetForm }) => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (resetForm) {
            setEmail('')
            setPassword('')
        }
    }, [resetForm])

    const handleClickShowPassword = () => setShowPassword(prev => !prev)

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleMouseUpPassword = (event) => {
        event.preventDefault();
    };

    const handleSubmit = async (event) => {
        event.preventDefault()
        onSubmit({ email, password })
        setLoading(true);
        // setError("");

        
        const formData = new FormData(event.currentTarget);
        const data = {
            username: formData.get('username'),
            password: formData.get('password'),
            redirect: false,
            callbackUrl: '/'
        };

        // console.log('>>> check form data:', data)

        try {
            
            const result = await signIn("credentials", data)
            console.log('>>> check result', result)
            
            if (result.error === 'CredentialsSignin') {
                console.log('Bị lỗi rồi!!!')
            }

            redirect('/dashboard')
        } catch (error) {
            console.log('Có lỗi xảy ra:', error)
        }
    }
    return (
        <>
            <form onSubmit={handleSubmit}>
                <div className="w-[500] p-6 rounded-xl border">
                    <Image width={0} height={0} src='/logo/Linux-Logo.wine.svg' className="text-center mx-auto w-[256] h-auto" alt="" priority />
                    {/* {alert && (
                        <Alert severity={alert.type} className="mb-4">
                            {alert.message}
                        </Alert>
                    )} */}
                    <FormControl className="w-full" sx={{ marginBottom: '16px' }} variant="standard">
                        <InputLabel htmlFor="input-username" className="text-black" >
                            Email
                        </InputLabel>
                        <Input id="input-username" label="Tài khoản" size="small" variant="standard" className="w-full py-1 mb-2 text-black" name="username" placeholder="Ví dụ: cromium@gmail.com" onChange={(e) => setEmail(e.target.value)} value={email} />
                        {/* {error && <span className="text-red-700 text-xs">Tài khoản không tồn tại</span>} */}
                        {/* {errors.username && <span className="text-red-700 text-xs">{errors.username}</span>} */}
                    </FormControl>
                    <FormControl className="w-full" sx={{ marginBottom: '24px' }} variant="standard">
                        <InputLabel htmlFor="input-password" className="text-black">
                            Mật khẩu
                        </InputLabel>
                        <Input id="input-password" type={showPassword ? 'text' : 'password'} size="small" variant="standard" label="Mật khẩu" className="w-full py-1 mb-2 text-black" name="password" placeholder="********" endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label={
                                        showPassword ? 'hide the password' : 'display the password'
                                    }
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    onMouseUp={handleMouseUpPassword}
                                    className="text-black"

                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        } onChange={(e) => setPassword(e.target.value)} value={password} />
                        {/* {error && <span className="text-red-700 text-xs">Mật khẩu không đúng</span>} */}
                        {/* {errors.password && <span className="text-red-700 text-xs">{errors.password}</span>} */}
                    </FormControl>
                    <Box component='div' className="flex justify-between">
                        <Link href='/forgot-password' className="text-sky-500 hover:text-sky-900">Quên mật khẩu</Link>
                        <Button type="submit" variant="contained" disabled={loading} startIcon={loading ? <CircularProgress size={16} /> : null}>
                            {loading ? 'Đang xử lý...' : 'Đăng nhập'}
                        </Button>
                    </Box>
                </div>
            </form>
        </>
    )
}

export default AuthForm