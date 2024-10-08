import express from "express";
import { uploadImages,deleteImage } from "../controllers/image.ctrl.js"; 
import verifyToken from "../validators/verifytoken.js";
import multer from "multer";

// Configuración de Multer para almacenar archivos en memoria
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const imageRoutes = express.Router();
//TODO ahora esto cambia ya que el array imgs va a estar en depa y no en el user
imageRoutes.delete("/", [verifyToken], deleteImage);
imageRoutes.post("/upload", [verifyToken, upload.array("images", 10)], uploadImages);

export default imageRoutes;