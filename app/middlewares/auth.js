const { verify } = require('jsonwebtoken');

const User = require('../db/models/User');
const config = require('../config');
const { AuthError } = require('../constants/Errors');

const checkToken = async (filedName, jwtSecret, req, res) => {
  req.user = null;

  const token = req.cookies[filedName] || null;

  if (!token) {
    throw new AuthError();
  }

  const decoded = verify(token, jwtSecret);

  if (!decoded || !decoded.data) {
    throw new AuthError();
  }

  const model = await User.findOne({ id: decoded.data.id });

  if (!model) {
    throw new AuthError();
  }

  const currentTime = Date.now();
  if (!decoded.exp || decoded.exp <= currentTime) {
    const index = model.tokenSalt.indexOf(decoded.data.salt);
    if (index !== -1) {
      model.tokenSalt.splice(index, 1);
      await model.save(model);
    }
    res.clearCookie(filedName);
    throw new AuthError();
  }

  if (!model.tokenSalt || !model.tokenSalt.includes(decoded.data.salt)) {
    res.clearCookie(filedName);
    throw new AuthError();
  }

  req.user = model;
  req.sessionSalt = decoded.data.salt;
};

async function checkAdminJwtToken(req, res, next) {
  try {
    await checkToken(config.jwt.adminTokenFiled, config.jwt.adminJwtSecret, req, res);
    return next();
  } catch (e) {
    return next(e);
  }
}

module.exports = {
  checkAdminJwtToken,
};
