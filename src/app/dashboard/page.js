'use client'

import { useEffect, useState } from "react";
import { Alert, Button, Box, CircularProgress, Typography } from '@mui/material';
import BarChartComponent from "@/components/BarChartComponent";
import LineChartComponent from "@/components/LineChartComponent";


export default function Dashboard() {
    const [data, setData] = useState()
    useEffect(() => {
        fetchDashboard()
    }, [])
    const fetchDashboard = async () => {
        const response = await fetch(`/api/dashboard`);
        const result = await response.json();
        console.log('result', result.length)
        setData(result.length)
    }
    return (
        <>
            <h1 className="text-2xl font-bold mb-6">Bảng điều khiển</h1>

            <Box className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                <Box className="border border-gray-600 p-6 rounded-lg">
                    <Typography variant="h6" className="mb-2">Tổng bài viết</Typography>
                    <Typography variant="h4" className="text-blue-600">0</Typography>
                </Box>

                <Box className="border border-gray-600 p-6 rounded-lg">
                    <Typography variant="h6" className="mb-2">Tổng sản phẩm</Typography>
                    <Typography variant="h4" className="text-green-600">0</Typography>
                </Box>

                <Box className="border border-gray-600 p-6 rounded-lg">
                    <Typography variant="h6" className="mb-2">Tổng người dùng</Typography>
                    <Typography variant="h4" className="text-purple-600">{data}</Typography>
                </Box>
            </Box>
            <Box className='grid grid-cols-2'>
                <BarChartComponent/>
                <LineChartComponent/>
            </Box>
        </>
    )
}