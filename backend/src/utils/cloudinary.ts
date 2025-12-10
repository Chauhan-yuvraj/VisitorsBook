// Ensure TypeScript recognizes the global FormData and Blob if not configured in lib
declare var FormData: any;
declare var Blob: any;

export const uploadImageToCloudinary = async (fileBuffer: Buffer): Promise<string> => {
    try {
        console.log("Starting Cloudinary Upload (Unsigned)...");
        const formData = new FormData();
        // Convert Buffer to Blob (Node.js 18+ supports global Blob)
        const blob = new Blob([fileBuffer], { type: 'image/jpeg' });
        
        formData.append('file', blob, 'upload.jpg');
        formData.append('upload_preset', 'Abhyuday');
        formData.append('cloud_name', 'drmhveetn');

        const response = await fetch("https://api.cloudinary.com/v1_1/drmhveetn/image/upload", {
            method: "POST",
            body: formData
        });

        const data = await response.json() as any;
        
        if (data.secure_url) {
            return data.secure_url;
        } else {
            console.error("Cloudinary Error Response:", data);
            throw new Error(data.error?.message || "Upload failed");
        }
    } catch (error) {
        console.error("Cloudinary Upload Error:", error);
        throw error;
    }
};
