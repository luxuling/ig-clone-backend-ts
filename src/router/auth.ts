import AuthController from '@controller/auth';
import { Router } from 'express';
import expressAsyncHandler from 'express-async-handler';
import passport from '@middleware/facebook.passport';

const router = Router();
router.post('/auth/register', expressAsyncHandler(AuthController.register));
router.post('/auth/login', expressAsyncHandler(AuthController.login));
router.get('/auth/facebook', passport.authenticate('facebook', { scope: ['profile'] }));
router.get('/auth/facebook/callback', passport.authenticate('facebook'), expressAsyncHandler(AuthController.facebookAuth));

export default router;
