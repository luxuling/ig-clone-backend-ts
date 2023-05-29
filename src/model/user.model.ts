import { Schema, model } from 'mongoose';
import { UserType } from './type.model';
import UserProfile from './profile.model';

const UserSchema = new Schema<UserType>({
  facebookId: {
    default: undefined,
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
    min: 6,
  },
  birth: {
    type: String,
    default: undefined,
  },
  provider: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    default: '',
  },
  profile: UserProfile,
  verified: {
    type: Boolean,
    default: false,
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
