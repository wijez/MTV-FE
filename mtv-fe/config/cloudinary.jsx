import Cloudiary from 'cloudinary-core';

const cloudinary = new Cloudinary({
    cloud_name: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
    api_key: import.meta.env.VITE_API_KEY,
    api_secret: import.meta.env.VITE_API_SECRET,
    // secure: true,
})
export default cloudinary;

    