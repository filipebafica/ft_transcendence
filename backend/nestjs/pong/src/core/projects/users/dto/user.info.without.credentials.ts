export interface UserInfoWithoutCredentials {
  id: number;
  username: string;
  nickname: string;
  email: string;
  isTwoFactorAuthenticationEnabled: boolean;
  avatar: string;
}
