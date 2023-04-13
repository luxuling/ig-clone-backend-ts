import type { Request, Response } from 'express';
import ErrorHandler from '@error/index';
import AuthService from '@service/auth.service';
import { IFacebookData } from '@interface/auth.user.interface';

export default class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const data = await AuthService.register(await req.body);
      res.json(data);
      res.status(201);
    } catch (error) {
      ErrorHandler.databaseErrorHandler(error, res);
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const data = await AuthService.login(await req.body);
      res.json(data);
    } catch (error) {
      ErrorHandler.databaseErrorHandler(error, res);
    }
  }

  static async facebookAuth(req: Request, res: Response) {
    try {
      const data = await AuthService.facebookCallback(
        req.user as IFacebookData
      );
      res.status(201);
      res.json(data);
    } catch (error) {
      ErrorHandler.databaseErrorHandler(error, res);
    }
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
    try {
      const response = await AuthService.validateOTP(
        req.body.userId,
        req.body.otp
      );
      res.status(200);
      res.json(response);
    } catch (error) {
      res.send(error);
      res.status(400);
    }
  }
}
