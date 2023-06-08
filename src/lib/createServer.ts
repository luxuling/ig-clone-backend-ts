/* eslint-disable import/no-extraneous-dependencies */
import http from 'http';
import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import sessionMiddleware from '@middleware/session.middleware';
import passport from '@middleware/facebook.passport';
import router from '../router/auth';
import corsMiddleware from '@middleware/cors.middleware';

const createServer = () => {
  const app = express();
  app.use(corsMiddleware);
  mongoose.connect('mongodb://localhost:27017/ig-database');
  app.use(bodyParser.json());

  app.use(cookieParser());
  app.use(sessionMiddleware);

  app.use(passport.initialize());
  app.use(passport.session());

  app.use(router);
  return new http.Server(app);
};

export default createServer;
