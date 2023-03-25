import { Schema, model } from 'mongoose';
import { UserType } from './type.model';

const UserSchema = new Schema<UserType>({
  facebookId: {
    default: 'not set',
    type: String,
  },
  userName: {
    required: true,
    unique: true,
    type: String,
  },
  fullName: {
    required: true,
    type: String,
  },
  email: {
    type: String,
    default: undefined,
  },
  noHp: {
    type: String,
    default: undefined,
  },
  password: {
    required: true,
    type: String,
  },
  provider: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: () => Date(),
  },
  updatedAt: {
    type: Date,
    default: () => Date(),
  },
});

export const User = model('users', UserSchema);
