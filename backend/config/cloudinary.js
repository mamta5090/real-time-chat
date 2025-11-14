import cloudinary from 'cloudinary'; // Or something similar
import fs from "fs";

const uploadOnCloudinary = async (filePath) => {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: "auto",
    });

  
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    return result.secure_url;
  } catch (error) {
    // try to remove local file on error (if exists)
    if (fs.existsSync(filePath)) {
      try { fs.unlinkSync(filePath); } catch (e) { /* ignore */ }
    }
    console.error("Cloudinary upload failed:", error);
    throw error; 
  }
};

export default uploadOnCloudinary;
