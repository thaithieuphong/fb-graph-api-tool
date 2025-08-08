import { Button } from "@mui/material";
import Link from "next/link";

export default function LoginPage() {
    return (
        <>
            <h1>Login Page</h1>
            <p>
                <Button className="bg-sky-500 text-white"><Link href='/admin/dashboard'>Go to Login</Link></Button>
            </p>
        </>
    )
}