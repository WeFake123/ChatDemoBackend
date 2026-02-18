import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

// Configuración de Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// Configuración de almacenamiento Multer + Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: "mi_app",
      format: file.mimetype.split("/")[1], // detecta automáticamente jpg, png, webp
      public_id: `${Date.now()}-${file.originalname.split(".")[0]}`, // nombre único
    };
  },
});

// Inicializamos Multer
const upload = multer({ storage });

// Exportamos la función de middleware para usar en rutas
export default upload;
