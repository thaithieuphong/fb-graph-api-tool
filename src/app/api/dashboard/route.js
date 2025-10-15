import { NextResponse } from 'next/server';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const result = [
            {
                id: 1,
                username: 'abc'
            },
            {
                id: 2,
                username: 'def'
            },
            {
                id: 3,
                username: 'ghi'
            },
        ]
        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: 'Server error',
            error: error.message
        }, { status: 500 });
    }
}