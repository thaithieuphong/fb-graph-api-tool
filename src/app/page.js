'use client'

import { Box } from "@mui/material";
import AuthForm from "@/components/AuthForm";

export default function Home() {
    return (
        <>
            <Box component='div' className="w-full h-screen flex justify-center items-center p-6">
                <AuthForm />
            </Box>
        </>
    );
}