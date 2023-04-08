import Env from '@lib/setup.env';

interface NodemailerConf {
  from_options: string;
  service: string;
  user: string;
  password: string;
}

const nodemailerConf: NodemailerConf = {
  from_options: process.env.NM_FROM_OPTIONS as string,
  service: process.env.NM_SERVICE as string,
  user: process.env.NM_USER as string,
  password: process.env.NM_PASSWORD as string,
};

export default nodemailerConf;
