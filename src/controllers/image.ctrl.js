import userModel from "../models/user.model.js";
import depaModel from "../models/depa.model.js";
import cloudinary from "../libs/cloudinary.js";
import multer from "multer";
//TODO ahora esto cambia ya que el array imgs va a estar en depa y no en el user

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


// Controlador para subir imágenes
const uploadImages = async (req, res) => {
  try {
    const { depaId } = req.body; // ID del departamento al que se subirán las imágenes
    const depa = await depaModel.findById(depaId);

    if (!depa) {
      return res.status(404).json({ message: "Departamento no encontrado" });
    }

    // Arreglo para guardar los resultados de Cloudinary
    const uploadedImages = [];

    // Manejo de múltiples archivos
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        // Subir la imagen a Cloudinary
        const result = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "depas" },
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result);
              }
            }
          );
          uploadStream.end(file.buffer);
        });

        // Guardar la URL y el idkey de la imagen
        uploadedImages.push({ url: result.secure_url, idkey: result.public_id });
      }

      // Agregar las imágenes subidas al array imgs del departamento
      depa.imgs.push(...uploadedImages);
      await depa.save();

      return res.status(200).json({
        message: "Imágenes subidas con éxito",
        images: uploadedImages,
        depa,
      });
    } else {
      return res.status(400).json({ message: "No se proporcionaron imágenes" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al subir imágenes" });
  }
};
const deleteImage = async (req, res) => {
  try {
    const { depaId, imageId } = req.body;

    // Busca el departamento por ID
    const depa = await depaModel.findById(depaId);
    if (!depa) {
      return res.status(404).json({ message: "Departamento no encontrado" });
    }

    // Busca la imagen en el array imgs del departamento
    const image = depa.imgs.find((img) => img.idkey === imageId);
    console.log(image);
    if (!image) {
      return res
        .status(403)
        .json({
          message: "Imagen no encontrada o no autorizada para eliminar",
        });
    }

    // Si la imagen pertenece al departamento, procede a eliminarla de Cloudinary
    await cloudinary.uploader.destroy(imageId);

    // Elimina la imagen del array imgs en el depaModel
    depa.imgs = depa.imgs.filter((img) => img.idkey !== imageId);
    await depa.save();

    res.status(200).json({ message: "Imagen eliminada con éxito" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al eliminar la imagen" });
  }
};

export { deleteImage, uploadImages };
