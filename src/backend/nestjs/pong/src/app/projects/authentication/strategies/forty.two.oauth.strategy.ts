import { Strategy } from 'passport-42';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UserDTO } from 'src/core/projects/authentication/login/dto/user.dto';

type DoneCallback = (err: Error, user: UserDTO) => void;

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      clientID: process.env.FORTYTWO_CLIENT_ID,
      clientSecret: process.env.FORTYTWO_CLIENT_SECRET,
      callbackURL: `${process.env.NGINX_BASE_URL}/auth/redirect`,
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
