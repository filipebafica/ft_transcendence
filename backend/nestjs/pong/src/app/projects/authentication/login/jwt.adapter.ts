import { JwtService } from '@nestjs/jwt';
import {
  TokenGateway,
  TokenType,
} from 'src/core/projects/authentication/gateway/token.gateway';

export class JwtAdapter implements TokenGateway {
  constructor(private jwtService: JwtService) {
    this.jwtService = new JwtService({
      secret: process.env.JWT_SECRET,
    });
  }

  async tokenizer(payload: object): Promise<TokenType> {
    const access_token: TokenType = await this.jwtService.signAsync(payload, {
      expiresIn: '1d',
    });

    return access_token;
  }

  decoder<T = any>(token: TokenType): T {
    const tokenWithoutBearer = token.replace('Bearer ', '');

    return this.jwtService.decode(tokenWithoutBearer);
  }

  async validator<T extends object = any>(token: TokenType): Promise<T> {
    return await this.jwtService.verifyAsync(token);
  }
}
