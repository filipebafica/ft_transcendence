import { IsBase64, IsBoolean, IsEmail, IsString } from 'class-validator';

export class UpdateUserDTO {
  @IsString()
  readonly name?: string;

  @IsString()
  readonly nick_name?: string;

  @IsEmail()
  @IsString()
  readonly email?: string;

  @IsBoolean()
  readonly isTwoFactorAuthenticationEnabled?: boolean;

  @IsBase64()
  @IsString()
  readonly avatar?: string;

  constructor(
    name?: string,
    nick_name?: string,
    email?: string,
    isTwoFactorAuthenticationEnabled?: boolean,
    avatar?: string,
  ) {
    this.name = name;
    this.nick_name = nick_name;
    this.email = email;
    this.isTwoFactorAuthenticationEnabled = isTwoFactorAuthenticationEnabled;
    this.avatar = avatar;
  }
}
