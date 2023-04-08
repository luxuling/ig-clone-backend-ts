import auth from '@config/auth';
import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import nodemailer from 'nodemailer';
// eslint-disable-next-line import/no-extraneous-dependencies
import twillo from 'twilio';
import UserRepository from '@repository/user.repository';
import { IFacebookData, IUserRegister } from '@interface/auth.user.interface';
import { User } from '@model/user.model';
import nodemailerConf from '@config/otp';
import twilloConf from '@config/twillo';

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
      birth: body.birth,
    });
    const tokinize = this.tokenize({ id: userData._id, email: userData.email });
    const userResponse = await UserRepository.update(
      userData._id,
      tokinize,
      userData.facebookId
    );
    return {
      fullName: userResponse?.fullName,
      userName: userResponse?.userName,
      email: userResponse?.email,
      noHp: userResponse?.noHp,
      birth: userResponse?.birth,
      token: userResponse?.token,
      createdAt: userResponse?.createdAt,
      updatedAt: userResponse?.updatedAt,
    };
  }

  static async login(body: any) {
    const dinamicKey: any = Object.keys(body)[0];
    const userData = await User.findOne()
      .where(dinamicKey)
      .equals(body[dinamicKey]);
    if (userData === null) {
      throw new Error(`Could find user with email ${body.email}`);
    }
    const isPasswordMatch = this.compare(body.password, userData.password);
    if (isPasswordMatch) {
      const tokinize = this.tokenize({
        id: userData._id,
        email: userData.email,
      });
      const userResponse = await UserRepository.update(
        userData._id,
        tokinize,
        userData.facebookId
      );
      return {
        fullName: userResponse?.fullName,
        userName: userResponse?.userName,
        email: userResponse?.email,
        token: userResponse?.token,
        birth: userResponse?.birth,
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
        userName:
          passportData.profile._json.first_name +
          passportData.profile._json.last_name,
        fullName:
          passportData.profile._json.first_name +
          passportData.profile._json.last_name,
        password: passportData.accessToken,
        provider: passportData.profile.provider,
        birth: passportData.profile._json.birthday,
        email: passportData.profile._json.email,
        noHp: '',
      });
      const userResponse = await UserRepository.update(
        userData._id,
        passportData.accessToken,
        passportData.profile.id
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

  static async sendEmailOTP(email: string) {
    const OTP = Math.floor(100000 + Math.random() * 900000);

    const mailOptions = {
      from: nodemailerConf.from_options,
      to: email,
      subject: 'Your OTP for our app',
      text: `Your OTP is ${OTP}. It will expire in 10 minutes.`,
    };
    const transporter = nodemailer.createTransport({
      service: nodemailerConf.service,
      auth: {
        user: nodemailerConf.user,
        pass: nodemailerConf.password,
      },
    });
    await transporter.sendMail(mailOptions);
  }

  static async sendSmsOTP(number: string) {
    const OTP = Math.floor(100000 + Math.random() * 900000);
    const accountSid = twilloConf.accountSID;
    const authToken = twilloConf.authToken;
    const client = twillo(accountSid, authToken);

    const message = await client.messages.create({
      body: `Your OTP is ${OTP}. It will expire in 10 minutes.`,
      from: twilloConf.number,
      to: '+6287819444100',
    });
    return message.sid;
  }
}
