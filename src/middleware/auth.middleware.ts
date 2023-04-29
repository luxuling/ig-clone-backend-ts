import { NextFunction, Request, Response } from 'express';

export default class AuthMiddleware {
  static async register(req: Request, res: Response, next: NextFunction) {
    const shortPassword = {
      status: 400,
      data: {
        message: 'Passswort must be at least 6 characters.',
      },
    };

    if (req.body.password.length < 6) {
      res.status(shortPassword.status);
      res.json(shortPassword.data);
    } else {
      next();
    }
  }
}
