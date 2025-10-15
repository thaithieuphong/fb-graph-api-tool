'use client'

import { Box } from "@mui/material";
import { useRouter } from "next/navigation";
import Login from "@/components/AuthForm";

export default function Home() {
    // const [errors, setErrors] = useState({})
    // const [alert, setAlert] = useState(null)
    // const router = useRouter()


    // const handleSubmit = async (event) => {
    //     
        
    //     const response = await signIn('credentials', data)
    //     console.log('>>> check response:', response)
    //     // setLoading(true)
    //     // setErrors({})
    //     // setAlert(null)
    //     // try {
    //     //     const formData = new FormData(event.currentTarget);
    //     //     const data = {
    //     //         username: formData.get('username'),
    //     //         password: formData.get('password')
    //     //     };
    //     //     const response = await fetch('/api/auth/login', {
    //     //         method: 'POST',
    //     //         headers: {
    //     //             'Content-Type': 'application/json',
    //     //         },
    //     //         body: JSON.stringify(data),
    //     //     })

    //     //     // // Kiểm tra response status trước khi parse JSON
    //     //     // if (!response.ok) {
    //     //     //     throw new Error(`HTTP error! status: ${response.status}`);
    //     //     // }

    //     //     const result = await response.json()
    //     //     console.log('result', result)

    //     //     if (result.success) {
    //     //         setAlert({ type: 'success', message: result.message })

    //     //         // Lưu token nếu có
    //     //         if (result.token) {
    //     //             localStorage.setItem('token', result.token);
    //     //         }

    //     //         // Redirect sau 1 giây
    //     //         // setTimeout(() => {
    //     //         // }, 1000)
    //     //         router.push('/dashboard')
    //     //         // redirect('/dashboard')
    //     //     } else {
    //     //         setAlert({ type: 'error', message: result.message || 'Đăng nhập thất bại' })
    //     //         // Xử lý lỗi xác thực từ formValidator
    //     //         if (result.errors && Array.isArray(result.errors)) {
    //     //             const newErrors = {};
    //     //             result.errors.forEach(error => {
    //     //                 // Map lỗi từ server về các trường tương ứng
    //     //                 if (error.path === 'username') {
    //     //                     newErrors.username = error.msg;
    //     //                 } else if (error.path === 'password') {
    //     //                     newErrors.password = error.msg;
    //     //                 }
    //     //                 // Có thể thêm các trường khác nếu cần
    //     //             });
    //     //             setErrors(newErrors);
    //     //         } else if (result.message.includes('credentials')) {
    //     //             setErrors({
    //     //                 username: 'Tài khoản không tồn tại',
    //     //                 password: 'Mật khẩu không đúng'
    //     //             })
    //     //         }
    //     //     }
    //     // } catch (error) {
    //     //     console.error('Login error:', error)
    //     //     setAlert({ type: 'error', message: 'Lỗi kết nối server' })
    //     // } finally {
    //     //     setLoading(false)
    //     // }
    // }

    return (
        <>
            <Box component='div' className="w-full h-screen flex justify-center items-center p-6">
                <Login/>
            </Box>
        </>
    );
}