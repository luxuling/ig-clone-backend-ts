import { Date } from 'mongoose';

export interface UserType {
  facebookId: string;
  userName: string;
  fullName: string;
  provider: string;
  email: string;
  noHp: string;
  password: string;
  token: string;
  createdAt: Date;
  updatedAt: Date;
}
