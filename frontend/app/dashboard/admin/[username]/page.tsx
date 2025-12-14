"use client";

import Default from "@/components/dashboard/default/default";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function Admin() {
    const router = useRouter();
    const isAuthenticated = useAuth();
    console.log('User authenticated:', isAuthenticated);
    if (!isAuthenticated) {
        return router.push("/user/login");;
    }
    return <Default />
}
