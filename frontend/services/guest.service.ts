import { Visitor } from "@/store/types/visitor";
import API from "./api";

interface VisitorApiResponse {
    success: boolean;
    count: number;
    data: Visitor[];
}

interface SingleVisitorApiResponse {
    success: boolean;
    data: Visitor;
}

export const getVisitors = async (): Promise<Visitor[]> => {
    try {
        const response = await API.get<VisitorApiResponse>('/visitors');
        if (response.data && Array.isArray(response.data.data)) {
            return response.data.data;
        }
        return [];
    } catch (error) {
        console.error('Failed to fetch visitors:', error);
        throw error;
    }
};

export const addVisitor = async (newVisitor: Partial<Visitor>): Promise<Visitor> => {
    try {
        const formData = new FormData();

        // Append all fields
        Object.keys(newVisitor).forEach(key => {
            if (key === 'profileImgUri') return; // Handle image separately
            const value = (newVisitor as any)[key];
            if (value !== undefined && value !== null) {
                formData.append(key, value.toString());
            }
        });

        // Handle Image Upload
        if (newVisitor.profileImgUri) {
            const uri = newVisitor.profileImgUri;
            const filename = uri.split('/').pop() || 'profile.jpg';
            const match = /\.(\w+)$/.exec(filename);
            const type = match ? `image/${match[1]}` : `image/jpeg`;

            // @ts-ignore
            formData.append('profileImg', { uri, name: filename, type });
        }

        const response = await API.post<SingleVisitorApiResponse>('/visitors', formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data.data;
    } catch (error) {
        console.error('Failed to add visitor:', error);
        throw error;
    }
};

export const updateVisitor = async (updatedVisitor: Partial<Visitor> & { _id: string }): Promise<Visitor> => {
    try {
        const formData = new FormData();

        // Append all fields
        Object.keys(updatedVisitor).forEach(key => {
            if (key === 'profileImgUri') return; // Handle image separately
            const value = (updatedVisitor as any)[key];
            if (value !== undefined && value !== null) {
                formData.append(key, value.toString());
            }
        });

        // Handle Image Upload
        if (updatedVisitor.profileImgUri) {
            const uri = updatedVisitor.profileImgUri;
            // Check if it's a new local file (starts with file:// or content://)
            // If it's an existing http url, we might not need to upload it again, 
            // but if the user picked a new one, it will be a local URI.
            if (!uri.startsWith('http')) {
                const filename = uri.split('/').pop() || 'profile.jpg';
                const match = /\.(\w+)$/.exec(filename);
                const type = match ? `image/${match[1]}` : `image/jpeg`;

                // @ts-ignore
                formData.append('profileImg', { uri, name: filename, type });
            } else {
                // If it's already a remote URL, we can just send it as a string if the backend supports it,
                // OR we just don't send 'profileImg' file and let the backend keep the old one.
                // But if we want to update other fields, we send them.
                // If we send 'profileImgUri' as string, backend might interpret it.
                formData.append('profileImgUri', uri);
            }
        }

        const response = await API.patch<SingleVisitorApiResponse>(`/visitors/${updatedVisitor._id}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data.data;
    } catch (error) {
        console.error('Failed to update visitor:', error);
        throw error;
    }
};

export const deleteVisitor = async (visitorId: string): Promise<void> => {
    try {
        await API.delete(`/visitors/${visitorId}`);
    } catch (error) {
        console.error('Failed to delete visitor:', error);
        throw error;
    }
};

export const getVisitor = async (visitorId: string): Promise<Visitor> => {
    try {
        const response = await API.get<SingleVisitorApiResponse>(`/visitors/${visitorId}`);
        return response.data.data;
    } catch (error) {
        console.error('Failed to fetch visitor:', error);
        throw error;
    }
};