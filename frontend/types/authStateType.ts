import { UserType } from "./userType";

export interface AuthStateType {
    user: UserType | null,
    tokens: {
        access_token: string | null;
        refresh_token: string | null;
    },
}