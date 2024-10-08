import userModel from "../models/user.model.js";
import roleModel from "../models/roles.model.js";
import { config } from "dotenv";
config();
const createAdmin = async () => {
  try {
    // Verifica si ya existe un administrador
    const existingAdmin = await userModel.findOne({ email: process.env.ADEMAIL });
    if (existingAdmin) {
      console.log("El administrador ya existe");
      return; // No crear si ya existe
    }

    // Obtén el rol de administrador
    const adminRole = await roleModel.findOne({ name: "admin" });
    if (!adminRole) {
      console.log("El rol de administrador no existe. Crearlo primero.");
      return;
    }

    // Crea el administrador
    const adm = new userModel({
      firtsName: process.env.ADFT, 
      lastName: process.env.ADLN,
      email: process.env.ADEMAIL,
      password: await userModel.enCryptPassword(process.env.ADPASS),
      rol: adminRole._id, // Asigna el ID del rol de administrador
      codeVerify: await userModel.generateVerificationCode(),
    });
    
    await adm.save();
    console.log("Administrador creado");
  } catch (error) {
    console.error("Error al crear el administrador:", error);
  }
};

export default createAdmin;
