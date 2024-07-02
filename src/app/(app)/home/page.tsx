"use client";

import { useUserContext } from "@/app/contexts/UserContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
    const { token } = useUserContext();
    const router = useRouter();
    useEffect(() => {
        if (!token && !localStorage.getItem('token')) {
            router.push("/login.html");
        }
    
    }, [token, router]);


    return (
        <main>
            Home
            { token }
        </main>
    )
}