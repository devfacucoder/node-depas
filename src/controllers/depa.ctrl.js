import depaModel from "../models/depa.model.js";
import cloudinary from "../libs/cloudinary.js"; // Asegúrate de importar correctamente Cloudinary
import userModel from "../models/user.model.js";
import { trusted } from "mongoose";
export const createDepa = async (req, res) => {
  try {
    const { title, contactNumber, price, location, description, wasapNumber } =
      req.body;

    // Asegúrate de que features sea un array
    let features = [];
    if (req.body.features) {
      features = JSON.parse(req.body.features); // Convertir el string JSON a un array
    }

    const imgs = [];

    // Manejo de las imágenes
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const uploadPromise = new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "depas" },
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                imgs.push({ url: result.secure_url, idkey: result.public_id });
                resolve(result);
              }
            }
          );
          uploadStream.end(file.buffer);
        });

        await uploadPromise;
      }
    }

    const newDepa = new depaModel({
      title,
      author: req.userId,
      contactNumber,
      price,
      location,
      wasapNumber,
      description,
      features, // Aquí se guarda el array ya parseado
      imgs,
    });

    await userModel.findByIdAndUpdate(req.userId, {
      $push: { depas: newDepa._id },
    });

    await newDepa.save();
    res.status(200).json(newDepa);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al crear el departamento" });
  }
};

export const getAllDepas = async (req, res) => {
  try {
    const { location } = req.query;
    if(location){
      const depasDB = await depaModel.find({ location: location });
      return res.json({ depas: depasDB });

    }
    const depasDB = await depaModel.find();
    res.json({ depas: depasDB });
  } catch (error) {
    console.log(error);
  }
};
export const getOneDepabyId = async (req, res) => {
  try {
    const depaDB = await depaModel.findOne({ _id: req.params.ide });
    res.status(200).json({ depa: depaDB });
  } catch (error) {
    console.log(error);
  }
};
export const getDepasUsers = async (req, res) => {
  try {
    const { depasUrl } = req.body;

    if (!Array.isArray(depasUrl)) {
      return res.status(400).json({ message: "depasUrl debe ser un array" });
    }

    const depasListDB = await Promise.all(
      depasUrl.map(async (id) => {
        return await depaModel.findOne({ _id: id });
      })
    );

    res.json(depasListDB);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al obtener los departamentos" });
  }
};
export const deleteDepa = async (req, res) => {
  try {
    const { depaId } = req.params;
    const userId = req.userId;

    // Buscar el departamento en la base de datos
    const depa = await depaModel.findById(depaId);
    if (!depa) {
      return res.status(404).json({ message: "Departamento no encontrado" });
    }

    // Verificar que el departamento pertenezca al usuario
    if (depa.author.toString() !== userId) {
      return res.status(403).json({
        message: "No estás autorizado para eliminar este departamento",
      });
    }

    // Eliminar las imágenes de Cloudinary
    if (depa.imgs && depa.imgs.length > 0) {
      for (const img of depa.imgs) {
        if(!img.idkey){
          continue;
        }
        await cloudinary.uploader.destroy(img.idkey);
      }
    }

    // Eliminar el departamento de la base de datos
    await depaModel.findByIdAndDelete(depaId);

    // Eliminar el departamento del array de departamentos del usuario
    await userModel.findByIdAndUpdate(userId, {
      $pull: { depas: depaId },
    });

    res.status(200).json({ message: "Departamento eliminado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al eliminar el departamento" });
  }
};
export const updateDepaById = async (req, res) => {
  try {
    const { ide } = req.params;

    // Encuentra el departamento por su ID
    const depaDb = await depaModel.findById(ide);
    if (!depaDb) {
      return res.status(404).json({ message: "Departamento no encontrado" });
    }

    // Verifica si el usuario autenticado es el autor del departamento
    if (req.userId !== depaDb.author.toString()) {
      return res
        .status(403)
        .json({ message: "No tienes permiso para editar este departamento" });
    }

    // Actualiza solo los campos que se envían en el cuerpo de la solicitud
    const updatedDepa = await depaModel.findByIdAndUpdate(ide, req.body, {
      new: true,
    });

    res.status(200).json(updatedDepa);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al actualizar el departamento" });
  }
};
export const buscarDepa = async (req, res) => {
  try {
    const { location } = req.query;
    const depasDb = await depaModel.find({ location: location });
    res.json(depasDb);
  } catch (error) {
    console.log(error);
  }
};
