import { object, string } from "zod"

export const signInSchema = object({
    username: string({ required_error: "Tài khoản người dùng không được bỏ trống" })
        .min(6, "Tài khoản người dùng phải có ít nhất 6 ký tự")
        .max(16, "Tài khoản người dùng không được vượt quá 16 ký tự"),
    password: string({ required_error: "Mật khẩu không được để trống" })
        // .min(1, "Password is required")
        .min(8, "Mật khẩu phải chứa ít nhất 8 ký tự")
        .max(32, "Mật khẩu phải chứa ít nhất 32 ký tự"),
})