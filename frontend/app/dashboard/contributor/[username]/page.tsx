"use client";

import ContributorDefault from "@/components/dashboard/default/contributorDefault";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function Contributor() {
    const router = useRouter();
    const isAuthenticated = useAuth();
    console.log('User authenticated:', isAuthenticated);
    if (!isAuthenticated) {
        return router.push("/user/login");;
    }
    return <ContributorDefault />
}
