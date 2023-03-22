import Env from '@lib/setup.env';
import type { Secret } from 'jsonwebtoken';

Env.set();

interface AuthConfig {
  round: number;
  secret: Secret;
}

const auth: AuthConfig = {
  round: 8,
  secret: process.env.APP_SECRET as Secret,
};

export default auth;
