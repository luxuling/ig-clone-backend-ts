import auth from '@config/auth';
import { Request, Response, NextFunction } from 'express';
import session from 'express-session';

const sessionMiddleware = (req: Request, res: Response, nex: NextFunction) =>
  session({
    secret: auth.secret as string,
    resave: false,
    saveUninitialized: true,
  })(req, res, nex);

export default sessionMiddleware;
