export interface TokenPayload {
  iat: number;
  exp: number;
  sub: number;
  email: string;
  username: string;
  isTwoFactorAuthenticated: boolean;
  isTwoFactorAuthenticationEnabled: boolean;
}
