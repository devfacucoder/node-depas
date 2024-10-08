import { Router } from "express";
import * as depaCtrl from "../controllers/depa.ctrl.js";
import verifyToken from "../validators/verifytoken.js";
import upload from "../libs/multerConfig.js";
const depaRoutes = Router();

// Rutas protegidas por verificación de token
depaRoutes.post("/", [verifyToken, upload], depaCtrl.createDepa); // Crear un departamento /funciona
depaRoutes.put("/:ide", [verifyToken], depaCtrl.updateDepaById); // Actualizar un departamento /funciona
depaRoutes.post("/depausers",depaCtrl.getDepasUsers) //funciona
depaRoutes.delete("/:depaId", [verifyToken], depaCtrl.deleteDepa); // Eliminar un departamento //funciona

// Rutas de acceso público
depaRoutes.get("/", depaCtrl.getAllDepas); // Obtener todos los departamentos
depaRoutes.get("/:ide", depaCtrl.getOneDepabyId); // Obtener un departamento por su ID
export default depaRoutes;