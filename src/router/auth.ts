import AuthController from '@controller/auth';
import { Router } from 'express';
import expressAsyncHandler from 'express-async-handler';
import passport from '@middleware/facebook.passport';
import AuthMiddleware from '@middleware/auth.middleware';

const router = Router();
router.post(
  '/auth/register',
  expressAsyncHandler(AuthMiddleware.register),
  expressAsyncHandler(AuthController.register)
);
router.post('/auth/login', expressAsyncHandler(AuthController.login));
router.post('/auth/otp', expressAsyncHandler(AuthController.otpAuth));
router.get(
  '/auth/facebook',
  passport.authenticate('facebook', { scope: 'email' })
);
router.get(
  '/auth/facebook/callback',
  passport.authenticate('facebook'),
  expressAsyncHandler(AuthController.facebookAuth)
);

export default router;
