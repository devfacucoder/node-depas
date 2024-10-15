import { Router } from "express";
import verifyToken from "../validators/verifytoken.js";
import { itsAdmin, itsModeratorOrAdmin } from "../validators/itsPermise.js";
//import rateLimit from "../libs/rateLimits.js";
import * as panelCtrl from "../controllers/panel.ctrl.js";
const panelRoutes = Router();
//panelRoutes.use(rateLimit);
//panelRoutes.get("/", (req, res) => res.send("usted es admin"));

//ruta para eliminar imagenes siendo moderator o admin
panelRoutes.delete("/img/", [verifyToken], panelCtrl.deleteImage);

//ruta para eliminar usuario siendo admin
panelRoutes.delete("/user/:id", [verifyToken,itsAdmin], panelCtrl.deleteUserByAdmin);

//ruta para cambiar roles
panelRoutes.put("/role", [verifyToken,itsAdmin], panelCtrl.updateUser); //* funciona
panelRoutes.get("/permiso",[verifyToken,itsAdmin],panelCtrl.permitido)
panelRoutes.get("/users",[verifyToken,itsAdmin],panelCtrl.getUsersForPanel)

export default panelRoutes;
/*TODO para mañana quizas despues de venir de la facultad terminar con esto y 
luego ir pensado en implementar algo para la validaciones o ir estudiando algo para desplegar

*/
