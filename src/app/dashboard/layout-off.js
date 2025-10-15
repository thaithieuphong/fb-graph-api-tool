'use client'

import Layout from "@/components/Layout-off";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function AdminLayout({ children }) {
    return (
        <ProtectedRoute>
            <Layout>
                {children}
            </Layout>
        </ProtectedRoute>
    );
}