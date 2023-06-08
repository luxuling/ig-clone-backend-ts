import Env from '@lib/setup.env';

Env.set();

type NODE_ENV = 'test' | 'development' | 'production';

interface AppConfig {
  NAME: string;
  PORT: number | string;
  ENV: NODE_ENV;
  URL: string;
}

const app: AppConfig = {
  NAME: process.env.APP_NAME as string,
  PORT: process.env.APP_PORT || 8080,
  ENV: (process.env.APP_ENV as NODE_ENV) || 'development',
  URL: process.env.APP_URL as string,
};

export default app;
