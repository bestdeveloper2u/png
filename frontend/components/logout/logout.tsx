import { logout } from "@/redux/features/auth/authSlice";
import { useRouter } from "next/navigation";
import React from "react";
import { useDispatch } from "react-redux";

interface LogoutProps {
    style?: string;
}

export const Logout: React.FC<LogoutProps> = ({ style }) => {
    const router = useRouter();
    const dispatch = useDispatch();
    const handleLogout = () => {
        dispatch(logout());
        router.push('/');
    }
    return (
        <button
            className={`${style} cursor-pointer`}
            type="button"
            onClick={handleLogout}
        >
            Logout
        </button>
    );
};
