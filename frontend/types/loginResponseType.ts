export interface LoginResponseType {
    data: {
        user: {
            id: number;
            username: string;
            email: string;
            role: string;
            is_active: boolean;
            image: string | null;
        };
        tokens: {
            access_token: string;
            refresh_token: string;
        };
    }
}
