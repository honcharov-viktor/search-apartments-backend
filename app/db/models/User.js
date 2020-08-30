const uuid = require('uuid');
const mongoose = require('mongoose');
const crypto = require('crypto');
const { sign } = require('jsonwebtoken');

const { AuthError } = require('../../constants/Errors');
const config = require('../../config');
const getExpiration = require('../../helpers/getExpiration');

const { Schema } = mongoose;

const User = new Schema({
  id: {
    type: Schema.Types.String,
    index: {
      unique: true,
    },
    default: uuid.v4,
  },
  username: {
    type: Schema.Types.String,
    required: true,
    index: {
      unique: true,
    },
  },
  password: {
    type: Schema.Types.String,
    required: true,
    select: false,
  },
  role: {
    type: Schema.Types.String,
  },
  tokenSalt: {
    type: [Schema.Types.String],
  },
}, {
  collection: 'users',
  timestamps: true,
});

User.methods.comparePassword = function comparePassword(pw) {
  const user = this;
  const hash = crypto.createHmac('sha256', config.jwt.adminJwtSecret)
    .update(pw)
    .digest('hex');
  if (hash !== user.password) {
    throw new AuthError();
  }
};

User.methods.generateToken = async function generateToken(expH, expD) {
  const user = this;

  const salt = uuid.v4();
  const data = {
    id: user.id,
    salt,
  };

  if (user.tokenSalt) {
    user.tokenSalt.push(salt);
  } else {
    user.tokenSalt = [salt];
  }
  await user.save(user);

  const exp = getExpiration(expH, expD);

  const tokenBody = { data };

  if (exp) {
    tokenBody.exp = exp;
  }

  const token = sign(tokenBody, config.jwt.adminJwtSecret);

  return Promise.resolve(token);
};

User.pre('save', function userSchemaPre(next) {
  const user = this;
  if (this.isModified('password') || this.isNew) {
    user.password = crypto.createHmac('sha256', config.jwt.adminJwtSecret)
      .update(user.password)
      .digest('hex');
    return next();
  } else {
    return next();
  }
});

module.exports = mongoose.model('User', User);
