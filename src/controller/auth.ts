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

  static async otpAuth(req: Request, res: Response) {
    try {
      await AuthService.sendOtp(req.body.email as string);
      res.status(200);
      res.send('success');
    } catch (error) {
      res.send(error);
      res.status(400);
    }
  }
}
