const jwt = require('jsonwebtoken');
require('dotenv').config({ path: 'server/.env' });
require('dotenv').config();

const createAccessToken = (user) => {
  return jwt.sign({ user_id: user._id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '2h',
  });
};
const createRefreshToken = (user) => {
  return jwt.sign({ user_id: user._id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: '30d',
  });
};

const sendRefreshToken = (res, token) => {
  res.cookie('jid', token, {
    httpOnly: true,
    path: '/',
    sameSite: 'none',
    secure: true,
  });
  res.header('Access-Control-Expose-Headers', 'Set-Cookie');
};

const isAuth = (context) => {
  const authHeader = context.req?.headers?.authorization;
  if (!authHeader) {
    throw new Error('Authorization header must be provided');
  }
  const token = authHeader.split('Bearer ')[1];
  if (!token) {
    throw new Error('Authentication token must be "Bearer [token]" format');
  }
  try {
    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    context.payload = payload;
  } catch (err) {
    console.log(err);
    throw new Error('Invalid/Expired token');
  }
};

module.exports = {
  createAccessToken,
  createRefreshToken,
  isAuth,
  sendRefreshToken,
};
