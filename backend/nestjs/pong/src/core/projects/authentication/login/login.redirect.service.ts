import { Injectable } from '@nestjs/common';
import { LoginResponseDTO } from './dto/response.dto';

@Injectable()
export class LoginRedirectService {
  private readonly baseURL: string;

  constructor() {
    const protocol: string = process.env.REACT_PROTOCOL || 'http';
    const domain: string = process.env.REACT_DOMAIN || 'localhost';
    const port: string = process.env.REACT_PORT || '3001';

    this.baseURL = `${protocol}://${domain}:${port}`;
  }
  execute(response: LoginResponseDTO): string {
    if (response.isTwoFactorAuthenticationEnabled) {
      return `${this.baseURL}/login/2fa?token=${response.token}`;
    } else {
      return `${this.baseURL}/home?token=${response.token}`;
    }
  }
}
