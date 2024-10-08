import multer from 'multer';

const storage = multer.memoryStorage();

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limita el tamaño de cada archivo a 5 MB
}).array('imgs', 10); // Permite un máximo de 10 imágenes

export default upload;