export interface IUserRegister {
  userName: string;
  fullName: string;
  provider: string;
  email: string;
  password: string;
}

export interface IUserLogin {
  email: string;
  password: string;
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
  };
}