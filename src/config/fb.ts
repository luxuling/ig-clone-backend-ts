import Env from '@lib/setup.env';

Env.set();

interface FacebookAuthConf {
  FACEBOOK_CLIENT_ID: string;
  FACEBOOK_SECRET: string;
  FACEBOOK_CALLBACK_URL: string;
}

const facebookAuthConf: FacebookAuthConf = {
  FACEBOOK_CLIENT_ID: process.env.FACEBOOK_CLIENT_ID as string,
  FACEBOOK_SECRET: process.env.FACEBOOK_SECRET as string,
  FACEBOOK_CALLBACK_URL: process.env.FACEBOOK_CALLBACK_URL as string,
};

export default facebookAuthConf;
