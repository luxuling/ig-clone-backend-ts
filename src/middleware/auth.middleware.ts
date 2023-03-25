import { User } from '@model/user.model';
import { NextFunction, Request, Response } from 'express';

export default class AuthMiddleware {
  static async register(req: Request, res: Response, next: NextFunction) {
    const isDuplicate = await User.findOne({
      userName: req.body.userName,
    } || { email: req.body.email });
    if (isDuplicate) {
      res.status(400);
      res.send('duplicate issue');
    } else if (req.body.password.length < 6) {
      res.status(400);
      res.send('password must be at least 6 characters');
    } else {
      next();
    }
  }
}
