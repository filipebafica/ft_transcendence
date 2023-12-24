import { Strategy } from 'passport-42';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UserDTO } from 'src/core/projects/authentication/login/dto/user.dto';

type DoneCallback = (err: Error, user: UserDTO) => void;

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy) {
  constructor() {
    const protocol: string = process.env.NGROK_PROTOCOL || 'http';
    const domain: string = process.env.NGROK_DOMAIN || 'localhost';
    const port: string = process.env.NGROK_PORT || '8080';

    super({
      clientID: process.env.FORTYTWO_APP_ID,
      clientSecret: process.env.FORTYTWO_APP_SECRET,
      callbackURL: `https://b0a9-45-226-73-46.ngrok-free.app/auth/redirect`,
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    done: DoneCallback,
  ) {
    const {
      username: nick_name,
      displayName: name,
      emails,
      id: oAuthProviderId,
    } = profile;

    const oAuthUser: UserDTO = {
      name,
      nick_name,
      oAuthProviderId,
      email: emails[0].value,
    };
    done(null, oAuthUser);
    return oAuthUser;
  }
}
