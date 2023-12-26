import { TokenType } from '../../gateway/token.gateway';

export class LoginResponseDTO {
  constructor(
    readonly token: TokenType,
    readonly isTwoFactorAuthenticationEnabled: boolean,
  ) {}
}
