import bcrypt from 'bcrypt'

const saltRounds = 12

export async function HashPassword(pwd) {
    const salt = await bcrypt.genSalt(saltRounds)
    const pwdHash = await bcrypt.hash(pwd, salt);
    return pwdHash
}

export async function ComparePassword(userInputPassword, storedHashedPassword) {
    try {
        const result = await bcrypt.compare(userInputPassword, storedHashedPassword);
        return result
    } catch (error) {
        // Xử lý lỗi
        console.error('Lỗi so sánh mật khẩu:', error);
        throw error
    }
}