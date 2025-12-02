// lib/cloudinary.ts
const CLOUD_NAME = "dayhhjn4m";
const UPLOAD_PRESET = "imperioPlay";

export async function subirACloudinary(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  try {
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!res.ok) {
      const error = await res.text();
      throw new Error(`Cloudinary error: ${error}`);
    }

    const data = await res.json();
    return data.secure_url;
  } catch (error) {
    console.error("Error subiendo a Cloudinary:", error);
    throw error;
  }
}
