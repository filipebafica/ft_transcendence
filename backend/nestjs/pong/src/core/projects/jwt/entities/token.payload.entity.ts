export interface TokenPayload {
  iat: number;
  exp: number;
  sub: number;
  email: string;
  name: string;
  isTwoFactorAuthenticated: boolean;
  isTwoFactorAuthenticationEnabled: boolean;
}
