import { Schema } from 'mongoose';
import { ProfileType } from './type.model';

const UserProfile = new Schema<ProfileType>({
  picture: {
    type: String,
  },
  bio: { type: String, default: '' },
  followed: { type: Number, default: 0 },
  followers: { type: Number, default: 0 },
  post: { type: Number, default: 0 },
});

export default UserProfile;
