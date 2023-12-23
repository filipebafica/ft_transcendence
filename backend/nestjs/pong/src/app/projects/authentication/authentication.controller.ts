import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Res,
  UseGuards,
  Req,
  Logger,
} from '@nestjs/common';

import { Response, Request } from 'node_modules/@types/express/index';
import { AuthenticationService } from '../../../core/projects/authentication/authentication.service';
import { LoginService } from 'src/core/projects/authentication/login/login.service';
import { UserAdapter as UserAdapter } from './login/user.info.adapter';
import { EntityManager } from 'typeorm';
import { LoginResponseDTO } from 'src/core/projects/authentication/login/dto/response.dto';
import { JwtAdapter } from './login/jwt.adapter';
import { JwtService } from '@nestjs/jwt';
import { UserDTO as UserDTO } from 'src/core/projects/authentication/login/dto/user.info.dto';
import { FortyTwoAuthGuard } from './guards/forty.two.oauth.guard';
import { JwtAuthGuard } from './guards/jwt.guard';
import { LoginRedirectService } from 'src/core/projects/authentication/login/login.redirect.service';

@Controller('auth')
export class AuthenticationController {
  private readonly loginService: LoginService;
  private readonly loginRedirectService: LoginRedirectService;

  constructor(
    private readonly authenticationService: AuthenticationService,
    entityManager: EntityManager,
  ) {
    this.loginService = new LoginService(
      new JwtAdapter(new JwtService()),
      new UserAdapter(entityManager),
    );
    this.loginRedirectService = new LoginRedirectService();
  }

  @Get('login')
  @UseGuards(FortyTwoAuthGuard)
  loginOAuth() {
    return;
  }

  @Get('redirect')
  @UseGuards(FortyTwoAuthGuard)
  async redirect(@Req() req: Request, @Res() res: Response) {
    const user: any = req.user;
    const userDTO = new UserDTO(
      user.oAuthProviderId,
      user.name,
      user.nick_name,
      user.email,
    );
    const loginRes: LoginResponseDTO = await this.loginService.execute(userDTO);
    const redirectUrl = this.loginRedirectService.execute(loginRes);

    res.redirect(redirectUrl);
  }

  @Post('twoFactor/generate')
  @UseGuards(JwtAuthGuard)
  async register(@Res() res: Response, @Req() req: any) {
    const otpAuthUrl =
      await this.authenticationService.generateTwoFactorAuthenticationSecret(
        req.user,
      );

    return res.json(
      await this.authenticationService.generateQrCodeDataURL(otpAuthUrl),
    );
  }

  @Post('twoFactor/enable')
  @UseGuards(JwtAuthGuard)
  async enable(@Req() req, @Body() body: any) {
    return await this.authenticationService.enableTwoFactorAuthentication(
      req.user,
      body.twoFactorAuthenticationCode,
    );
  }

  @Post('twoFactor/login')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async login2fa(@Req() req, @Body() body: any) {
    return this.authenticationService.loginWith2fa(
      req.user,
      body.twoFactorAuthenticationCode,
    );
  }
}
