import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

export const useAuth = (): boolean => {
    const { user, tokens } = useSelector((state: RootState) => state.auth);
    return Boolean(user && tokens?.access_token);
};
