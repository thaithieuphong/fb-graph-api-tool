import Layout from "@/components/Layout";
import Topbar from "@/components/Taskbar";
import { Box, Grid, Stack } from "@mui/material";

export default function AdminLayout({ children }) {
    return (
        <>
            <Layout>
                {children}
            </Layout>
        </>
    )
}