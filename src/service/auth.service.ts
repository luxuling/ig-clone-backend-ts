import auth from '@config/auth';
import bcrypt from 'bcrypt';
import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';
import nodemailer from 'nodemailer';
// eslint-disable-next-line import/no-extraneous-dependencies
import twillo from 'twilio';
import UserRepository from '@repository/user.repository';
import { IFacebookData, IUserRegister } from '@interface/auth.user.interface';
import { User } from '@model/user.model';
import nodemailerConf from '@config/otp';
import twilloConf from '@config/twillo';
import convertPhoneNumber from '@utils/convert.number';
import { OTPdb } from '@model/otp.model';
import databaseErrorHandler from '@error/database.error';
export default class AuthService {
  private static readonly rounds = auth.round;

  private static readonly secret = auth.secret;

  private static readonly defaultJwtOptions: SignOptions = {
    algorithm: 'HS256',
    expiresIn: '3 day',
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

  static verify(data: string) {
    return jwt.verify(data, this.secret);
  }

  static async register(body: IUserRegister) {
    try {
      const userData = await UserRepository.create({
        userName: body.userName,
        fullName: body.fullName,
        provider: 'local',
        email: body.email,
        noHp: body.noHp,
        password: this.hash(body.password),
        birth: body.birth,
      });
      const tokinize = this.tokenize({
        id: userData._id,
        email: userData.email,
      });
      await UserRepository.update(userData._id, tokinize, userData.facebookId);

      if (userData.email !== undefined) {
        await this.sendEmailOTP(userData.email, userData._id);
      } else {
        await this.sendSmsOTP(userData.noHp, userData._id);
      }
      return {
        status: 200,
        data: {
          id: userData._id,
          message: 'OTP is sent successfully, wait for authentication',
        },
      };
    } catch (error: any) {
      const findedError = databaseErrorHandler(error);
      return findedError;
    }
  }

  static async login(body: any) {
    const dinamicKey: any = Object.keys(body)[0];
    const userData = await User.findOne()
      .where(dinamicKey)
      .equals(body[dinamicKey]);
    if (userData === null) {
      return {
        status: 400,
        data: {
          message: 'Could not find user.',
        },
      };
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
        status: 200,
        data: {
          data: {
            fullName: userResponse?.fullName,
            userName: userResponse?.userName,
            email: userResponse?.email,
            noHp: userResponse?.noHp,
            birth: userResponse?.birth,
            token: userResponse?.token,
            createdAt: userResponse?.createdAt,
            updatedAt: userResponse?.updatedAt,
          },
          message: 'Successfully login.',
        },
      };
    }
    return {
      status: 400,
      data: {
        message: 'Your password is incorrect',
      },
    };
  }

  static async validateUserFunction(token: string) {
    interface DecodedType extends JwtPayload {
      id: string;
    }
    try {
      const decoded: DecodedType = this.verify(token) as DecodedType;
      const currentUser = await UserRepository.findOne({ _id: decoded.id });
      return {
        status: 200,
        data: {
          data: {
            fullName: currentUser?.fullName,
            userName: currentUser?.userName,
            email: currentUser?.email,
            noHp: currentUser?.noHp,
            birth: currentUser?.birth,
            token: currentUser?.token,
            createdAt: currentUser?.createdAt,
            updatedAt: currentUser?.updatedAt,
          },
          message: 'Successfully Authorization.',
        },
      };
    } catch (error) {
      return {
        status: 401,
        data: {
          message: 'Your session is expired. Please login again!',
        },
      };
    }
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
        status: 200,
        data: {
          data: {
            facebookId: userResponse?.facebookId,
            fullName: userResponse?.fullName,
            userName: userResponse?.userName,
            email: userResponse?.email,
            token: userResponse?.token,
            createdAt: userResponse?.createdAt,
            updatedAt: userResponse?.updatedAt,
          },
          message: 'Successfully Login',
        },
      };
    }
    return {
      status: 200,
      data: {
        fullName: currentUser?.fullName,
        userName: currentUser?.userName,
        email: currentUser?.email,
        token: currentUser?.token,
        createdAt: currentUser?.createdAt,
        updatedAt: currentUser?.updatedAt,
      },
      message: 'Successfully Login',
    };
  }

  static async sendEmailOTP(email: string, userId: any) {
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

    await OTPdb.create({
      userId: userId,
      tokenOTP: this.hash(String(OTP)),
    });

    await transporter.sendMail(mailOptions);
  }

  static async sendSmsOTP(number: string, userId: any) {
    const OTP = Math.floor(100000 + Math.random() * 900000);
    const accountSid = twilloConf.accountSID;
    const authToken = twilloConf.authToken;
    const client = twillo(accountSid, authToken);

    const message = await client.messages.create({
      body: `Your OTP is ${OTP}. It will expire in 10 minutes.`,
      from: twilloConf.number,
      to: convertPhoneNumber(number),
    });

    await OTPdb.create({
      userId: userId,
      tokenOTP: this.hash(String(OTP)),
    });

    return message.sid;
  }

  static async validateOTP(userId: string, tokenOTP: string) {
    const currentOTP = await OTPdb.findOne({ userId: userId });
    if (currentOTP === null) {
      return {
        status: 400,
        data: {
          message: 'OTP not found, please try again',
        },
      };
    }
    const isOtpValid = this.compare(tokenOTP, currentOTP?.tokenOTP as string);
    if (isOtpValid) {
      await UserRepository.verify(userId);
      const currentUser = await UserRepository.findOne({ _id: userId });
      return {
        status: 201,
        data: {
          id: currentUser?._id,
          token: currentUser?.token,
          message: 'OTP valid',
        },
      };
    } else {
      return {
        status: 400,
        data: {
          message: 'Invalid tokenOTP please try again',
        },
      };
    }
  }
}
