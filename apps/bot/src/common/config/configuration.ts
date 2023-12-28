export interface Config {
  port: number;
  ip?: string;

  botUrl: string;
  bptfManagerUrl: string;

  bptfAccessToken: string;

  operator: Operator;

  rabbitmq: RabbitMQConfig;
  storage: S3StorageConfig | LocalStorageConfig;
  redis: RedisConfig;
}

export interface Operator {
  steam: string;
}

export interface RedisConfig {
  host: string;
  port: number;
  password?: string;
  db?: number;
  keyPrefix?: string;
}

export interface RabbitMQConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  vhost: string;
}

export type StorageConfig = S3StorageConfig | LocalStorageConfig;

export interface S3StorageConfig extends BaseStorageConfig {
  type: 's3';
  endpoint: string;
  port: number;
  useSSL: boolean;
  bucket: string;
  directory: string;
  accessKeyId: string;
  secretAccessKey: string;
}

export interface LocalStorageConfig extends BaseStorageConfig {
  type: 'local';
  directory: string;
}

interface BaseStorageConfig {
  type: unknown;
}

export default (): Config => {
  return {
    port: parseInt(process.env.PORT as string, 10),
    ip: process.env.IP_ADDRESS as string | undefined,

    botUrl: process.env.BOT_URL as string,
    bptfManagerUrl: process.env.BPTF_MANAGER_URL as string,

    bptfAccessToken: process.env.BPTF_ACCESS_TOKEN as string,

    operator: JSON.parse(process.env.OPERATOR),

    rabbitmq: {
      host: process.env.RABBITMQ_HOST as string,
      port: parseInt(process.env.RABBITMQ_PORT as string, 10),
      username: process.env.RABBITMQ_USERNAME as string,
      password: process.env.RABBITMQ_PASSWORD as string,
      vhost: process.env.RABBITMQ_VHOST as string,
    },
    storage: getStorageConfig(),
    redis: {
      host: process.env.REDIS_HOST as string,
      port: parseInt(process.env.REDIS_PORT as string, 10),
      password: process.env.REDIS_PASSWORD,
      db:
        process.env.REDIS_DB !== undefined
          ? parseInt(process.env.REDIS_DB, 10)
          : undefined,
      keyPrefix: process.env.REDIS_PREFIX ?? 'tf2-automatic',
    },
  };
};

function getStorageConfig(): StorageConfig {
  const storageType = process.env.STORAGE_TYPE as 's3' | 'local';

  if (storageType === 'local') {
    return {
      type: storageType,
      directory: process.env.STORAGE_LOCAL_PATH as string,
    } satisfies LocalStorageConfig;
  } else if (storageType === 's3') {
    return {
      type: storageType,
      directory: process.env.STORAGE_S3_PATH as string,
      endpoint: process.env.STORAGE_S3_ENDPOINT as string,
      port: parseInt(process.env.STORAGE_S3_PORT as string, 10),
      useSSL: process.env.STORAGE_S3_USE_SSL === 'true',
      bucket: process.env.STORAGE_S3_BUCKET as string,
      accessKeyId: process.env.STORAGE_S3_ACCESS_KEY_ID as string,
      secretAccessKey: process.env.STORAGE_S3_SECRET_ACCESS_KEY as string,
    } satisfies S3StorageConfig;
  } else {
    throw new Error('Unknown task type: ' + storageType);
  }
}
