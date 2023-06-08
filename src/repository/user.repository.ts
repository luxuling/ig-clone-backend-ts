import { User } from '@model/user.model';
import { IUserRegister } from '@interface/auth.user.interface';

export default class UserRepository {
  static model = User;

  static async findAll() {
    return this.model.find();
  }

  static async findOne(query: object) {
    return this.model.findOne(query);
  }

  static async create({
    userName,
    fullName,
    email,
    password,
    profile,
    provider,
    noHp,
    birth,
  }: IUserRegister) {
    return User.create({
      userName,
      fullName,
      provider,
      profile,
      email,
      noHp,
      password,
      birth,
    });
  }

  static async update(id: any, token: string, facebookId: string) {
    await User.updateOne(
      {
        _id: id,
      },
      {
        facebookId,
        token,
        updatedAt: Date(),
      }
    );
    return this.findOne({ _id: id });
  }

  static async verify(id: string) {
    await User.updateOne(
      { _id: id },
      {
        verified: true,
      }
    );
  }
}
