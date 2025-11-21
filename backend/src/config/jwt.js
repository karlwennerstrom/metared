const jwt = require('jsonwebtoken');

const generateToken = (usuario) => {
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES_IN || '24h';

  if (!secret) {
    console.error('JWT_SECRET is not defined!');
    throw new Error('JWT_SECRET must be configured');
  }

  console.log('Generating token with expiresIn:', expiresIn);

  return jwt.sign(
    {
      id: usuario.id,
      email: usuario.email,
      rol: usuario.rol
    },
    secret,
    { expiresIn: expiresIn }
  );
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = {
  generateToken,
  verifyToken
};
