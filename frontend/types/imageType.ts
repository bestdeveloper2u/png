export interface KeywordResponseType {
    id: number;
    name: string;
    image: number;
};

export interface UserResponseType {
    id: number;
    image: null | string;
    username: string;
    slug: string;
    email: string;
    number: string;
    first_name: string;
    last_name: string;
    role: string;
};

export interface ImageTypeRespose {
    id: number;
    keywords: KeywordResponseType[] | [];
    user: UserResponseType | null;
    image_id: string;
    url: string;
    title: string;
    description: string;
    category: string;
    status: string;
    created_at: string;
};