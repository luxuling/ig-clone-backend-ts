import type { NextFunction, Request, Response } from 'express';
import AuthService from '@service/auth.service';
import { IFacebookData } from '@interface/auth.user.interface';

export default class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    const response = await AuthService.register(await req.body);
    res.status(response.status);
    res.json(response.data);
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    const response = await AuthService.login(await req.body);
    res.status(response.status);
    res.json(response.data);
  }

  static async facebookAuth(req: Request, res: Response, next: NextFunction) {
    const response = await AuthService.facebookCallback(
      req.user as IFacebookData
    );
    res.status(response.status);
    res.json(response.data);
  }

  static async emailOTP(req: Request, res: Response) {
    try {
      await AuthService.sendEmailOTP(
        req.body.email as string,
        req.body.userId as string
      );
      res.status(200);
      res.send('success');
    } catch (error) {
      res.send(error);
      res.status(400);
    }
  }

  static async smsOTP(req: Request, res: Response) {
    try {
      const response = await AuthService.sendSmsOTP(
        req.body.number as string,
        req.body.userId
      );
      res.status(200);
      res.send(`Successfully sent OTP with sid : ${response}`);
    } catch (error) {
      res.status(400);
      res.send(error);
    }
  }

  static async validateOTPresponse(req: Request, res: Response) {
    const response = await AuthService.validateOTP(
      req.body.userId,
      req.body.otp
    );
    res.status(response.status);
    res.json(response.data);
  }
}
