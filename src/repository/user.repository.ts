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
    userName, fullName, email, password, provider, noHp,
  }: IUserRegister) {
    return User.create({
      userName,
      fullName,
      provider,
      email,
      noHp,
      password,
    });
  }

  static async update(id: any, token: string) {
    await User.updateOne(
      {
        _id: id,
      },
      {
        token,
        updatedAt: Date(),
      },
    );
    return this.findOne({ _id: id });
  }
}
