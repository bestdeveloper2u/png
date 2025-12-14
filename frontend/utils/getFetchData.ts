type ExtendedFetchOptions = RequestInit & {
    next?: {
        revalidate?: number | false;
        tags?: string[];
    };
};

export const getFetchData = async (apiURL: string, options: ExtendedFetchOptions = {}) => {
    try {
        const response = await fetch(apiURL, {
            ...options,
            headers: {
                Accept: "application/json",
                ...(options.headers ?? {}),
            },
        });
        if (!response.ok) {
            const errorText = await response.text().catch(() => "Failed to fetch");
            throw new Error(`Request failed (${response.status}): ${errorText}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error fetching ${apiURL}`, error);
        throw error;
    }
};
