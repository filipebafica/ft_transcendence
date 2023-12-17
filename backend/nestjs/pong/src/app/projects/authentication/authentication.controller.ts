import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Res,
  UseGuards,
  Req,
} from '@nestjs/common';

import { Response, Request } from 'node_modules/@types/express/index';
import { AuthenticationService } from '../../../core/projects/authentication/authentication.service';
import { LoginService } from 'src/core/projects/authentication/login/login.service';
import { UserInfoAdapter } from './login/user.info.adapter';
import { EntityManager } from 'typeorm';
import { LoginResponseDTO } from 'src/core/projects/authentication/login/dto/response.dto';
import { JwtAdapter } from './login/jwt.adapter';
import { JwtService } from '@nestjs/jwt';
import { UserInfoDTO } from 'src/core/projects/authentication/login/dto/user.info.dto';
import { FortyTwoAuthGuard } from './guards/forty.two.oauth.guard';
import { JwtAuthGuard } from './guards/jwt.guard';

@Controller('auth')
export class AuthenticationController {
  private loginService: LoginService;

  constructor(
    private readonly authenticationService: AuthenticationService,
    entityManager: EntityManager,
  ) {
    this.loginService = new LoginService(
      new JwtAdapter(new JwtService()),
      new UserInfoAdapter(entityManager),
    );
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
    const userDTO = new UserInfoDTO(
      user.oAuthProviderId,
      user.username,
      user.nickname,
      user.email,
    );
    const loginRes: LoginResponseDTO = await this.loginService.execute(userDTO);

    // res.header('authorization', loginRes.token);
    // res.redirect('http://localhost:3000/home');
    res.json(loginRes);
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
