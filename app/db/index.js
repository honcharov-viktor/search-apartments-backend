
const mongoose = require('mongoose');

const config = require('../config');

let isConnected = false; // Readiness status

mongoose.set('debug', config.mongooseDebug);

function connect() {
  // eslint-disable-next-line consistent-return
  return new Promise((resolve, reject) => {
    if (isConnected) return resolve();

    mongoose.connect(config.mongodbUrl, config.mongodbOptions);

    mongoose.connection.on('connected', () => {
      isConnected = true;
      console.info('mongoose connected with pid', process.pid);
      return resolve();
    });
    mongoose.connection.on('error', (err) => {
      isConnected = false;
      console.info('mongoose connection error:', err);
      return reject();
    });
    mongoose.connection.on('disconnected', () => {
      isConnected = false;
      console.info('mongoose disconnected');
      return reject();
    });
  });
}

function testConnection() {
  // eslint-disable-next-line consistent-return
  return new Promise((resolve, reject) => {
    if (!isConnected) return reject();

    mongoose.connection.db.admin()
      // eslint-disable-next-line prefer-promise-reject-errors
      .ping((err, result) => ((err || !result) ? reject('no ping result') : resolve(true)));
  });
}

function disconnect() {
  return new Promise((resolve) => {
    mongoose.connection.close(() => {
      console.info('mongoose disconnected through app termination pid', process.pid);
      resolve();
    });
  });
}

module.exports.isConnected = testConnection;
module.exports.disconnect = disconnect;
module.exports.connect = connect;
module.exports.mongoose = mongoose;
