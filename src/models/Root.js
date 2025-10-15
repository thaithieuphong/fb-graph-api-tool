import mongoose from 'mongoose';
const { Schema } = mongoose;

const Root = new Schema(
    {
        first_name: String, // String is shorthand for {type: String}
        last_name: String,
        email: String,
        phone_number: String,
        username: {
            type: String,
            unique: true
        },
        password: {
            type: String,
        },
        last_password: [
            {
                password: String,  // Thêm field password
                changed_at: Date   // Đổi tên từ 'type' thành 'changed_at' cho rõ nghĩa
            }
        ],
        role: String
    },
    {
        timestamps: true
    }
);

export default mongoose.model('Root', Root);