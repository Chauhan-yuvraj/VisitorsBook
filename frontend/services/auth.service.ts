import API from "./api";

export const loginAdmin = async (credentials: { email: string; password: string }) => {
    try {
        const response = await API.post('/auth/login', credentials);

        const data = response.data;

        return {
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
            user: data.user,
        };
    } catch (error) {
        throw error;
    }
};
