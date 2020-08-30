const { AuthError } = require('../constants/Errors');

const { catchErrors } = require('../middlewares/errorHeandler');
const User = require('../db/models/User');
const config = require('../config');

async function defaultAdmin(req, res) {
  const {
    username,
    password,
  } = config.admin;
  const user = await User.findOne({ username }).select('id +password createdAt updatedAt');
  if (!user) {
    const admin = new User({
      username,
      password,
      role: 'DEFAULT_ADMIN',
    });
    await admin.save();
  }

  return res.json({
    success: true,
  });
}

async function login(req, res) {
  const {
    username,
    password,
  } = req.body;
  const user = await User.findOne({ username }).select('id +password createdAt updatedAt');
  if (!user) {
    throw new AuthError();
  }

  user.comparePassword(password);
  const token = await user.generateToken(1);

  res.cookie(config.jwt.adminTokenFiled, token);

  return res.json({
    success: true,
    payload: {
      id: user.id,
      token,
    },
  });
}

function getProfile(req, res) {
  return res.json({
    success: true,
    payload: {
      id: req.user.id,
      username: req.user.username,
      role: req.user.role,
    },
  });
}

module.exports = {
  defaultAdmin: catchErrors(defaultAdmin),
  login: catchErrors(login),
  getProfile,
};
