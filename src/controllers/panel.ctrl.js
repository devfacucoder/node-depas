import userModel from "../models/user.model.js";
import roleModel from '../models/roles.model.js'
import depaModel from "../models/depa.model.js";
import cloudinary from "../libs/cloudinary.js"
export const permitido = (req,res) =>{
  res.json({mensage:"pase"})
}
export const deleteUserByAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    // Encuentra al usuario por su ID
    const user = await userModel.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Encuentra y elimina todos los departamentos asociados al usuario
    const depas = await depaModel.find({ author: id });
    for (const depa of depas) {
      // Elimina las imágenes asociadas a cada departamento en Cloudinary
      for (const img of depa.imgs) {
        await cloudinary.uploader.destroy(img.idkey);
      }
      // Elimina el departamento de la base de datos
      await depaModel.findByIdAndDelete(depa._id);
    }

    // Elimina el usuario de la base de datos
    await userModel.findByIdAndDelete(id);

    res.status(200).json({ message: "Usuario, departamentos e imágenes eliminados con éxito" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al eliminar el usuario" });
  }
};
export const deleteImage = async (req, res) => {
  try {
    const { user, depaId, imageId } = req.body;

    // Busca al usuario por ID
    const userDb = await userModel.findById(user);
    if (!userDb) {
      return res.status(404).json({ message: "User not found" });
    }

    // Busca la imagen en el array imgs del usuario (solo si se requiere validación extra)
    const image = userDb.imgs.find((img) => img.idImg === imageId);
    if (!image) {
      return res
        .status(403)
        .json({
          message: "Image not found or not authorized to delete this image",
        });
    }

    // Elimina la imagen de Cloudinary
    await cloudinary.uploader.destroy(imageId);

    // Busca el departamento por ID
    const depa = await depaModel.findById(depaId);
    if (!depa) {
      return res.status(404).json({ message: "Departamento no encontrado" });
    }

    // Elimina la imagen del array imgs en el depaModel
    depa.imgs = depa.imgs.filter((img) => img.idkey !== imageId);
    await depa.save();

    res.status(200).json({ message: "Imagen eliminada con éxito" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al eliminar la imagen" });
  }
};
export const updateUser = async (req, res) => {
  try {
    const { idUser, newRole } = req.body;

    // Verifica si el nuevo rol existe en la base de datos
    const role = await roleModel.findOne({ name: newRole });
    if (!role) {
      return res.status(400).json({ message: "El rol no existe" });
    }

    // Actualiza el rol del usuario
    const userDB = await userModel.findByIdAndUpdate(
      idUser,
      { rol: role._id },
      { new: true }
    );

    if (!userDB) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.status(200).json({ message: "Rol actualizado con éxito", userDB });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al actualizar el rol", error });
  }
};

export const getUsersForPanel = async (req, res) => {
  try {
    // Utilizamos populate para obtener el campo 'name' del rol asociado a cada usuario
    const users = await userModel.find().populate('rol', 'name');

    // En la respuesta, cada usuario ya incluirá el campo 'nameRole' con el nombre del rol
    const usersWithRoles = users.map(user => {
      return {
        ...user._doc, // Traemos todos los campos del usuario
        nameRole: user.rol ? user.rol.name : 'Rol no encontrado', // Si tiene un rol, asignamos el nombre, si no, un mensaje de error
      };
    });

    res.status(200).json(usersWithRoles);

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error al obtener los usuarios' });
  }
};



