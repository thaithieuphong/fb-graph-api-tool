import { runStartupTasks } from '@/lib/startup';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const result = await runStartupTasks();

        if (result.success) {
            return NextResponse.json({
                success: true,
                message: result.message,
                data: result.adminResult
            }, { status: 200 });
        } else {
            return NextResponse.json({
                success: false,
                message: result.message,
                error: result.error
            }, { status: 500 });
        }
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: 'Server error during initialization',
            error: error.message
        }, { status: 500 });
    }
}

export async function POST() {
    // Cho phép force re-initialization qua POST request
    try {
        // Reset initialization flag (chỉ trong development)
        if (process.env.NODE_ENV === 'development') {
            const { resetInitialization } = await import('@/lib/startup');
            resetInitialization();
        }

        const result = await runStartupTasks();

        return NextResponse.json({
            success: result.success,
            message: result.message,
            data: result.adminResult || null,
            error: result.error || null
        }, { status: result.success ? 200 : 500 });

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: 'Server error during forced initialization',
            error: error.message
        }, { status: 500 });
    }
}