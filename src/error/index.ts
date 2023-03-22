import { Response } from 'express';

class ErrorHandler {
  static databaseErrorHandler(err: any, res: Response) {
    res.status(400);
    if (err.code === 11000) {
      res.json({
        error: 'Duplicate error',
        duplocatedAt: err.keyValue,
      });
    } else {
      res.json(err.message);
    }
  }
}
export default ErrorHandler;
