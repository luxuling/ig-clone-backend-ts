import { Date } from 'mongoose';

export interface UserType {
  facebookId: string;
  userName: string;
  fullName: string;
  provider: string;
  email: string;
  noHp: string;
  birth: string;
  profile: object;
  password: string;
  token: string;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface OtpType {
  userId: string;
  tokenOTP: string;
}

export interface ProfileType {
  picture: string;
  post: number;
  followers: number;
  followed: number;
  bio: string;
}
