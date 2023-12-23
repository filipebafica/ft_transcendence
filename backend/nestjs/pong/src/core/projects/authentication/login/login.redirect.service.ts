import { Injectable } from '@nestjs/common';
import { LoginResponseDTO } from './dto/response.dto';

@Injectable()
export class LoginRedirectService {
  execute(response: LoginResponseDTO): string {
    if (response.isTwoFactorAuthenticationEnabled) {
      return `http://localhost:3001/login/2fa?token=${response.token}`;
    } else {
      return `http://localhost:3001/home?token=${response.token}`;
    }
  }
}
