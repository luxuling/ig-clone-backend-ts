import { User } from '@model/user.model';
import { NextFunction, Request, Response } from 'express';

export default class AuthMiddleware {
  static async register(req: Request, res: Response, next: NextFunction) {
    const duplicateMessage = {
      status: 400,
      data: {
        message: 'Duplicate issue, Please fill with different data.',
      },
    };

    const shortPassword = {
      status: 400,
      data: {
        message: 'Passswort must be at least 6 characters.',
      },
    };

    const isDuplicate = await User.findOne(
      {
        userName: req.body.userName,
      } || { email: req.body.email }
    );
    if (isDuplicate) {
      res.status(duplicateMessage.status);
      res.json(duplicateMessage.data);
    } else if (req.body.password.length < 6) {
      res.status(shortPassword.status);
      res.json(shortPassword.data);
    } else {
      next();
    }
  }
}
