import * as Joi from 'joi';

const whenS3 = {
  is: 's3',
  then: Joi.required(),
};

const whenLocal = {
  is: 'local',
  then: Joi.required(),
};

const validation = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').required(),

  DEBUG: Joi.boolean().optional(),

  PORT: Joi.number().port().required(),
  IP_ADDRESS: Joi.string().ip().optional(),

  BOT_URL: Joi.string()
    .uri({
      scheme: ['http', 'https'],
    })
    .required(),
  BPTF_MANAGER_URL: Joi.string()
    .uri({
      scheme: ['http', 'https'],
    })
    .required(),

  BPTF_ACCESS_TOKEN: Joi.string().required(),

  CUSTOM_USERAGENT_HEADER: Joi.string().optional(),

  DISCORD_BOT_TOKEN: Joi.string().required(),

  OPERATOR: Joi.string().required(),
  PREFIX: Joi.string().optional(),

  RABBITMQ_HOST: Joi.string().required(),
  RABBITMQ_PORT: Joi.number().required(),
  RABBITMQ_USERNAME: Joi.string().required(),
  RABBITMQ_PASSWORD: Joi.string().required(),
  RABBITMQ_VHOST: Joi.string().allow('').required(),
  STORAGE_TYPE: Joi.string().valid('local', 's3').required(),
  STORAGE_LOCAL_PATH: Joi.string().when('STORAGE_TYPE', whenLocal),
  STORAGE_S3_ENDPOINT: Joi.string().when('STORAGE_TYPE', whenS3),
  STORAGE_S3_PORT: Joi.number().when('STORAGE_TYPE', whenS3),
  STORAGE_S3_USE_SSL: Joi.boolean().when('STORAGE_TYPE', whenS3),
  STORAGE_S3_PATH: Joi.string().when('STORAGE_TYPE', whenS3),
  STORAGE_S3_ACCESS_KEY_ID: Joi.string().when('STORAGE_TYPE', whenS3),
  STORAGE_S3_SECRET_ACCESS_KEY: Joi.string().when('STORAGE_TYPE', whenS3),
  STORAGE_S3_BUCKET: Joi.string().when('STORAGE_TYPE', whenS3),
  REDIS_HOST: Joi.string().required(),
  REDIS_PORT: Joi.number().integer().required(),
  REDIS_PASSWORD: Joi.string().optional(),
  REDIS_DB: Joi.number().positive().optional(),
  REDIS_PREFIX: Joi.string().optional(),
});

export { validation };
