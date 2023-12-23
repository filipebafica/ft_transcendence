export interface UserWithoutCredentials {
  id: number;
  name: string;
  nick_name: string;
  email: string;
  isTwoFactorAuthenticationEnabled: boolean;
  avatar: string;
}
