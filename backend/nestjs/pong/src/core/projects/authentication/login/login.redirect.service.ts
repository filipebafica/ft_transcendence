import { Injectable } from '@nestjs/common';
import { LoginResponseDTO } from './dto/response.dto';

@Injectable()
export class LoginRedirectService {
  private readonly baseURL: string;

  constructor() {
    this.baseURL = process.env.REACT_BASE_URL;
  }
  execute(response: LoginResponseDTO): string {
    if (response.isTwoFactorAuthenticationEnabled) {
      return `${this.baseURL}/login/2fa?token=${response.token}`;
    } else {
      return `${this.baseURL}/home?token=${response.token}`;
    }
  }
}
