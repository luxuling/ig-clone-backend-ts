import auth from '@config/auth';
import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';

import UserRepository from '@repository/user.repository';
import { IFacebookData, IUserLogin, IUserRegister } from '@interface/auth.user.interface';

export default class AuthService {
  private static readonly rounds = auth.round;

  private static readonly secret = auth.secret;

  private static readonly defaultJwtOptions: SignOptions = {
    algorithm: 'HS256',
    expiresIn: '30 days',
  };

  static hash(data: string | Buffer): string | never {
    const salt = bcrypt.genSaltSync(this.rounds);
    return bcrypt.hashSync(data, salt);
  }

  static compare(plainPassword: string | Buffer, encrypted: string) {
    return bcrypt.compareSync(plainPassword, encrypted);
  }

  static tokenize(data: string | object) {
    return jwt.sign(data, this.secret, this.defaultJwtOptions);
  }

  static async register(body: IUserRegister) {
    const userData = await UserRepository.create({
      userName: body.userName,
      fullName: body.fullName,
      provider: 'local',
      email: body.email,
      noHp: body.noHp,
      password: this.hash(body.password),
    });
    const tokinize = this.tokenize({ id: userData._id, email: userData.email });
    const userResponse = await UserRepository.update(userData._id, tokinize, userData.facebookId);
    return {
      fullName: userResponse?.fullName,
      userName: userResponse?.userName,
      email: userResponse?.email,
      noHp: userResponse?.noHp,
      token: userResponse?.token,
      createdAt: userResponse?.createdAt,
      updatedAt: userResponse?.updatedAt,
    };
  }

  static async login(body: IUserLogin) {
    const userData = await UserRepository.findOne({ email: body.email });
    if (userData === null) {
      throw new Error(`Could find user with email ${body.email}`);
    }
    const isPasswordMatch = this.compare(body.password, userData.password);
    if (isPasswordMatch) {
      const tokinize = this.tokenize({
        id: userData._id,
        email: userData.email,
      });
      const userResponse = await UserRepository.update(userData._id, tokinize, userData.facebookId);
      return {
        fullName: userResponse?.fullName,
        userName: userResponse?.userName,
        email: userResponse?.email,
        token: userResponse?.token,
        createdAt: userResponse?.createdAt,
        updatedAt: userResponse?.updatedAt,
      };
    }
    throw new Error(`Could not find user with password ${body.password}`);
  }

  static async facebookCallback(passportData: IFacebookData) {
    const currentUser = await UserRepository.findOne({
      facebookId: passportData.profile.id,
      provider: passportData.profile.provider,
    });
    if (!currentUser) {
      const userData = await UserRepository.create({
        userName: passportData.profile._json.first_name + passportData.profile._json.last_name,
        fullName: passportData.profile._json.first_name + passportData.profile._json.last_name,
        password: passportData.accessToken,
        provider: passportData.profile.provider,
        email: passportData.profile._json.email,
        noHp: '',
      });
      const userResponse = await UserRepository.update(
        userData._id,
        passportData.accessToken,
        passportData.profile.id,
      );
      return {
        facebookId: userResponse?.facebookId,
        fullName: userResponse?.fullName,
        userName: userResponse?.userName,
        email: userResponse?.email,
        token: userResponse?.token,
        createdAt: userResponse?.createdAt,
        updatedAt: userResponse?.updatedAt,
      };
    }
    return {
      fullName: currentUser?.fullName,
      userName: currentUser?.userName,
      email: currentUser?.email,
      token: currentUser?.token,
      createdAt: currentUser?.createdAt,
      updatedAt: currentUser?.updatedAt,
    };
  }
}
