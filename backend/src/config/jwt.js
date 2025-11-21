const jwt = require('jsonwebtoken');

// Valores por defecto hardcodeados
const JWT_SECRET = process.env.JWT_SECRET || 'tu_super_secret_jwt_cambiar_en_produccion';
const JWT_EXPIRES_IN = '24h';

const generateToken = (usuario) => {
  return jwt.sign(
    {
      id: usuario.id,
      email: usuario.email,
      rol: usuario.rol
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

module.exports = {
  generateToken,
  verifyToken
};
