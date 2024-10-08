import express from "express";
const app = express();
import { createRoles } from "./libs/createRoles.js";
import cors from "cors";
import createAdmin from "./libs/createAdmin.js";
import dotenv from "dotenv"
dotenv.config()
import userRoutes from "./routes/users.routes.js";
import panelRoutes from "./routes/panel.routes.js";
import depaRoutes from "./routes/depas.routes.js";
import authRoutes from "./routes/auth.routes.js";
import imageRoutes from "./routes/image.routes.js";
createRoles();
const clientIP = process.env.CLIENT_IP;
createAdmin()
app.use(cors({
    origin: (origin, callback) => {
        
      if (origin === clientIP || !origin) {
        callback(null, true);  // Permite el acceso si la IP es correcta o si no hay "origin" (ej. Postman)
      } else {
        callback(new Error("No autorizado por CORS"));  // Bloquea si la IP no coincide
      }
    }
  }));
  

app.use(express.json());
app.use("/api/users/", userRoutes);
app.use("/api/panel/", panelRoutes);
app.use("/api/depa/", depaRoutes);
app.use("/api/auth/", authRoutes);
app.use("/api/imgs/", imageRoutes);
export default app;
