import express from "express";
const app = express();
import { createRoles } from "./libs/createRoles.js";
import cors from "cors";
import createAdmin from "./libs/createAdmin.js";
import dotenv from "dotenv";
dotenv.config();
import userRoutes from "./routes/users.routes.js";
import panelRoutes from "./routes/panel.routes.js";
import depaRoutes from "./routes/depas.routes.js";
import authRoutes from "./routes/auth.routes.js";
import imageRoutes from "./routes/image.routes.js";
createRoles();
const clientIP = process.env.CLIENT_IP;
createAdmin();
const allowedOrigins = [process.env.CLIENT_IP,"http://localhost:5173/react-depas"];
//https://node-depas.onrender.com
const corsOptions = {
  origin: function (origin, callback) {
    console.log("recibido:"+clientIP)
    console.log('Solicitud de origen:', origin);
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      // Permitir si el origen está en la lista de permitidos o si es una solicitud sin origen (como Postman)
      callback(null, true);
      
    } else {
      // Bloquear si el origen no está permitido
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // Permitir cookies o credenciales
};
app.use(cors(corsOptions));
app.use(express.json());
app.use("/api/users/", userRoutes);
app.use("/api/panel/", panelRoutes);
app.use("/api/depa/", depaRoutes);
app.use("/api/auth/", authRoutes);
app.use("/api/imgs/", imageRoutes);
export default app;
