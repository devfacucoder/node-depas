import jwt from 'jsonwebtoken';
import userModel from '../models/user.model.js';
import config from '../config.js';

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(400).json({ message: "Authorization header missing" });

    // Verificar que el token comience con "Bearer "
    const token = authHeader.split(' ')[1];
    if (!token) return res.status(400).json({ message: "Token missing or malformed" });

    // Verificar el token
    const decoded = jwt.verify(token, config.secret_jwt);
    req.userId = decoded.id;

    // Buscar al usuario en la base de datos
    const userDB = await userModel.findById(req.userId, { password: 0 });
    if (!userDB) return res.status(404).json({ message: "User not found" });

    next();
  } catch (error) {
    console.log(error);
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

export default verifyToken;