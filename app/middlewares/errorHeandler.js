/**
 * @link https://stackoverflow.com/questions/49664134/express-and-async-await-shall-i-wrap-the-lot-with-try-catch
 */

/**
 * Handler to catch `async` operation errors.
 * Reduces having to write `try-catch` all the time.
 */
exports.catchErrors = (action) => (req, res, next) => action(req, res).catch(next);

/**
 * Show useful information to client in development.
 */
// eslint-disable-next-line no-unused-vars
exports.devErrorHandler = (err, req, res, next) => {
  console.log(err);
  // eslint-disable-next-line no-param-reassign
  err.stack = err.stack || '';
  // eslint-disable-next-line no-param-reassign
  err.status = err.status || 500;
  res.status(err.status);
  res.json({
    success: false,
    payload: {
      name: err.name,
      message: err.message,
      status: err.status,
      isPublic: err.isPublic,
      data: err.data,
      // stack: err.stack,
    },
  });
};
