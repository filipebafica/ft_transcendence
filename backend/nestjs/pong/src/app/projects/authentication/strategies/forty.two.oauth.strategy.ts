import { Strategy } from 'passport-42';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UserInfoDTO } from 'src/core/projects/authentication/login/dto/user.info.dto';

type DoneCallback = (err: Error, user: UserInfoDTO) => void;

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      clientID: process.env.FORTYTWO_APP_ID,
      clientSecret: process.env.FORTYTWO_APP_SECRET,
      callbackURL: 'http://localhost:8080/auth/redirect',
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    done: DoneCallback,
  ) {
    const {
      username: nickname,
      displayName: username,
      emails,
      id: oAuthProviderId,
    } = profile;

    const oAuthUser: UserInfoDTO = {
      username,
      nickname,
      oAuthProviderId: oAuthProviderId,
      email: emails[0].value,
    };
    done(null, oAuthUser);
    return oAuthUser;
  }
}
