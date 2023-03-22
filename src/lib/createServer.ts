import http from 'http';
import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import sessionMiddleware from '@middleware/session.middleware';
import passport from '@middleware/facebook.passport';
import router from '../router/auth';

const createServer = () => {
  const aplication = express();
  mongoose.connect('mongodb://localhost:27017/ig-database');
  aplication.use(bodyParser.json());

  aplication.use(cookieParser());
  aplication.use(sessionMiddleware);

  aplication.use(passport.initialize());
  aplication.use(passport.session());

  aplication.use(router);
  return new http.Server(aplication);
};

export default createServer;
