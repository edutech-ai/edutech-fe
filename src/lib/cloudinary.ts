import { cloudinaryConfig } from "@/config/cloudinary";

export interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  format: string;
  width: number;
  height: number;
}

export const uploadToCloudinary = async (
  file: File
): Promise<CloudinaryUploadResult> => {
  const { cloudName, uploadPreset } = cloudinaryConfig;

  if (!cloudName || !uploadPreset) {
    console.error("Cloudinary config:", { cloudName, uploadPreset });
    throw new Error(
      "Cloudinary configuration is missing. Please check your environment variables."
    );
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  try {
    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

    const response = await fetch(uploadUrl, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Upload failed:", response.status, errorData);
      throw new Error(
        `Upload failed: ${errorData?.error?.message || response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    // console.error("Error uploading to Cloudinary:", error);
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      throw new Error(
        "Network error: Unable to connect to Cloudinary. Please check your internet connection."
      );
    }
    throw error;
  }
};
