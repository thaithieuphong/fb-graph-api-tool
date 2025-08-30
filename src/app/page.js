'use client'

import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Box, Button, FormControl, IconButton, Input, InputAdornment, InputLabel } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { Suspense, useState } from "react";

const error = false


export default function Home() {
    const [showPassword, setShowPassword] = useState(false)

    const handleClickShowPassword = () => setShowPassword(prev => !prev)

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleMouseUpPassword = (event) => {
        event.preventDefault();
    };
    return (
        <>
            <Box component='div' className="w-full h-screen bg-gray-950 flex justify-center items-center p-6">
                <Suspense>
                    <form action>
                        <div className="p-6 rounded-xl bg-gray-800">
                            <Image width={256} height={256} src='/logo/Linux-Logo.wine.svg' className="text-center mx-auto" alt="" priority />
                            <FormControl className="w-full" sx={{ marginBottom: '16px' }} variant="standard">
                                <InputLabel error={error} htmlFor="input-username" sx={{ color: '#ffffff' }} >
                                Tài khoản
                                </InputLabel>
                                <Input id="input-username" error={error} sx={{ color: '#ffffff' }} label="Tài khoản" size="small" variant="standard" className="w-full py-1 mb-2" />
                                {error && <span className="text-red-700 text-xs">Tài khoản không tồn tại</span>}
                            </FormControl>
                            <FormControl className="w-full" sx={{ marginBottom: '24px' }} variant="standard">
                                <InputLabel error={error} htmlFor="input-password" sx={{ color: '#ffffff' }}>
                                    Mật khẩu
                                </InputLabel>
                                <Input error={error} id="input-password" type={showPassword ? 'text' : 'password'} size="small" variant="standard" label="Mật khẩu" className="w-full py-1 mb-2"  endAdornment={
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
                                } />
                                {error && <span className="text-red-700 text-xs">Mật khẩu không đúng</span>}
                            </FormControl>
                            <Box component='div' className="flex justify-between">
                                <Link href='/forgot-password' className="text-sky-500 hover:text-sky-600">Quên mật khẩu</Link>
                                <Button variant="contained" className="float-end">
                                    <Link href='/dashboard'>
                                        Đăng nhập
                                    </Link>
                                </Button>
                            </Box>
                        </div>
                    </form>
                </Suspense>
            </Box>
        </>
    );
}
