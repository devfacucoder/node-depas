import express from "express";
const app = express();
import { createRoles } from "./libs/createRoles.js";
import cors from "cors";
import createAdmin from "./libs/createAdmin.js";

import userRoutes from "./routes/users.routes.js";
import panelRoutes from "./routes/panel.routes.js";
import depaRoutes from "./routes/depas.routes.js";
import authRoutes from "./routes/auth.routes.js";
import imageRoutes from "./routes/image.routes.js";
createRoles();

createAdmin()
app.use(cors());

app.use(express.json());
app.use("/api/users/", userRoutes);
app.use("/api/panel/", panelRoutes);
app.use("/api/depa/", depaRoutes);
app.use("/api/auth/", authRoutes);
app.use("/api/imgs/", imageRoutes);
export default app;
