// eslint-disable-next-line max-classes-per-file
const {
  INTERNAL_SERVER_ERROR,
  UNPROCESSABLE_ENTITY,
  UNAUTHORIZED,
  NOT_FOUND,
} = require('http-status');

/**
 * @extends Error
 */
class ExtendableError extends Error {
  constructor(message, status, isPublic, data) {
    super(message);
    this.message = message;
    this.status = status;
    this.isPublic = isPublic;
    this.data = data;

    /**
     * @link https://github.com/Microsoft/TypeScript/issues/14099
     */
    this.name = ExtendableError.name;
    Object.setPrototypeOf(this, ExtendableError.prototype);
  }
}

/**
 * Class representing an API error.
 * @extends ExtendableError
 */
class APIError extends ExtendableError {
  /**
   * Creates an API error.
   * @param {string} [message] - Error message.
   * @param {number} [status] - HTTP status code of error.
   * @param {boolean} [isPublic] - Whether the message should be visible to user or not.
   * @param {object} [data] - Some error data.
   */
  constructor(message, status, isPublic, data) {
    super(message || 'INTERNAL_SERVER_ERROR', status || INTERNAL_SERVER_ERROR, isPublic, data);
    /**
     * @link https://github.com/Microsoft/TypeScript/issues/14099
     */
    this.name = APIError.name;
    Object.setPrototypeOf(this, APIError.prototype);
  }
}

/**
 * Class representing an Validation error.
 * @extends ExtendableError
 */
class ValidationError extends ExtendableError {
  /**
   * Creates an Validation error.
   * @param {string} [message] - Error message.
   * @param {number} [status] - HTTP status code of error.
   * @param {boolean} [isPublic] - Whether the message should be visible to user or not.
   */
  constructor(message, status, isPublic) {
    super(message || 'UNPROCESSABLE_ENTITY', status || UNPROCESSABLE_ENTITY, isPublic);
    /**
     * @link https://github.com/Microsoft/TypeScript/issues/14099
     */
    this.name = ValidationError.name;
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

/**
 * Class representing an User authorization error.
 * @extends ExtendableError
 */
class AuthError extends ExtendableError {
  /**
   * Creates an Auth error.
   * @param {string} [message] - Error message.
   * @param {number} [status] - HTTP status code of error.
   * @param {boolean} [isPublic] - Whether the message should be visible to user or not.
   */
  constructor(message, status, isPublic) {
    super(message || 'UNAUTHORIZED', status || UNAUTHORIZED, isPublic);
    /**
     * @link https://github.com/Microsoft/TypeScript/issues/14099
     */
    this.name = AuthError.name;
    Object.setPrototypeOf(this, AuthError.prototype);
  }
}

/**
 * Class representing an NotFoundError error.
 * @extends ExtendableError
 */
class NotFoundError extends ExtendableError {
  /**
   * Creates an NotFoundError error.
   * @param {string} [message] - Error message.
   * @param {number} [status] - HTTP status code of error.
   * @param {boolean} [isPublic] - Whether the message should be visible to user or not.
   */
  constructor(message, status, isPublic) {
    super(message || 'NOT_FOUND', status || NOT_FOUND, isPublic);
    /**
     * @link https://github.com/Microsoft/TypeScript/issues/14099
     */
    this.name = NotFoundError.name;
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

module.exports = {
  APIError,
  ValidationError,
  AuthError,
  NotFoundError,
};
