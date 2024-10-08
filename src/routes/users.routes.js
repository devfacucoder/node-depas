import { Router } from "express";

const userRoutes = Router();

import * as userCtrl from "../controllers/user.ctrl.js";
import verifyToken from "../validators/verifytoken.js";
import { itsAdmin, itsModeratorOrAdmin } from "../validators/itsPermise.js";

userRoutes.get("/", [verifyToken,itsAdmin], userCtrl.getUsers);
userRoutes.get("/perfil",[verifyToken], userCtrl.getPerfil);
userRoutes.get("/:id", userCtrl.getOneUser);

userRoutes.post("/",  userCtrl.createUser);
userRoutes.delete("/", [verifyToken,itsAdmin], userCtrl.deleteUser);
userRoutes.put("/", [verifyToken,itsAdmin], userCtrl.updateUserMyUser);

export default userRoutes;