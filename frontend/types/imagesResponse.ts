export interface KeywordsResponse {
  id: number;
  name: string;
  slug: string;
}

export interface CategoriesResponse {
  id: number;
  name: string;
  slug: string;
}

export interface SubCategoriesResponse {
  id: number;
  name: string;
  slug: string;
}

export interface UserResponse {
  id: number;
  username: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
}

export interface ImagesResponse {
  id: number;
  cloudflare_id: string;
  cloudflare_url: string;
  name: string;
  title: string;
  slug: string;
  description: string;
  status: string;
  download_count: number;
  user: UserResponse | null;
  keywords: KeywordsResponse[];
  category: CategoriesResponse | null;
  sub_category: SubCategoriesResponse | null;
}
