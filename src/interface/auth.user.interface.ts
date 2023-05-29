interface ProfileRegister {
  picture: string;
  post: number;
  followers: number;
  followed: number;
  bio: string;
}
export interface IUserRegister {
  userName: string;
  fullName: string;
  provider: string;
  email: string;
  noHp: string;
  profile: ProfileRegister;
  password: string;
  birth: string;
}

export interface IFacebookData {
  accessToken: string;
  profile: {
    id: string;
    displayName: string;
    username: string;
    name: string;
    provider: string;
    emails: Array<string>;
    _json: {
      email: string;
      first_name: string;
      last_name: string;
      birthday: string;
    };
  };
}
