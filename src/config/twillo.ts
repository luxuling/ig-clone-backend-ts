import Env from '@lib/setup.env';

interface TwilloConf {
  authToken: string;
  accountSID: string;
  number: string;
}

const twilloConf: TwilloConf = {
  authToken: process.env.TW_TOKEN as string,
  accountSID: process.env.TW_ACCOUNT_SID as string,
  number: process.env.TW_NUMBER as string,
};

export default twilloConf;
