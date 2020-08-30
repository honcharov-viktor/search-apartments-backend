
const Joi = require('joi');

const allowedEnvironments = [
  'test',
  'local',
  'development',
  'review',
  'staging',
  'production',
];

// define validation for all the env vars
const envVarsSchema = Joi.object({
  NODE_ENV: Joi.string().allow(allowedEnvironments).default('development'),
  PORT: Joi.number().default(8080),

  DEBUG: Joi.string(),

  MONGODB_HOST: Joi.string().required(),
  MONGODB_NAME: Joi.string().required(),
  MONGODB_USER: Joi.string().required(),
  MONGODB_PASS: Joi.string().required(),

  MONGODB_OPTIONS_USE_MONGO_CLIENT: Joi.boolean().default(true),
  MONGODB_OPTIONS_AUTOINDEX: Joi.boolean().default(false),

  MONGOOSE_DEBUG: Joi.boolean().default(false),

  DEFAULT_ADMIN_USERNAME: Joi.string().required(),
  DEFAULT_ADMIN_PASSWORD: Joi.string().required(),
  ADMIN_TOKEN_FILED: Joi.string().default('token'),
  ADMIN_JWT_SECRET: Joi.string().default('token'),
}).unknown()
  .required();

const { error, value: envVars } = Joi.validate(process.env, envVarsSchema);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  debug: envVars.DEBUG,
  mongooseDebug: envVars.MONGOOSE_DEBUG,
  mongodbUrl: `mongodb://${envVars.MONGODB_HOST}/${envVars.MONGODB_NAME}`,
  mongodbOptions: {
    autoIndex: envVars.MONGODB_OPTIONS_AUTOINDEX,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  jwt: {
    adminTokenFiled: envVars.ADMIN_TOKEN_FILED,
    adminJwtSecret: envVars.ADMIN_JWT_SECRET,
  },
  admin: {
    username: envVars.DEFAULT_ADMIN_USERNAME,
    password: envVars.DEFAULT_ADMIN_PASSWORD,
  },
};

console.log('======================== Config ========================');
console.log(config);
console.log('========================================================');

module.exports = config;
