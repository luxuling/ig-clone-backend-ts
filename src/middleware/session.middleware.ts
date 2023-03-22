import { Request, Response, NextFunction } from 'express';
import session from 'express-session';

const sessionMiddleware = (req: Request, res: Response, nex: NextFunction) => session({
  secret: 'kontol',
  resave: false,
  saveUninitialized: true,
})(req, res, nex);

export default sessionMiddleware;
