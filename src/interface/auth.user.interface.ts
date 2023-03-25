export interface IUserRegister {
  userName: string;
  fullName: string;
  provider: string;
  email: string;
  noHp: string;
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
    _json: {
      email: string;
      first_name: string;
      last_name: string;
    }
  };
}
