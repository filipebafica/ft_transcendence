import { IsBase64, IsBoolean, IsEmail, IsString } from 'class-validator';

export class UpdateUserDTO {
  @IsString()
  readonly username?: string;

  @IsString()
  readonly nickname?: string;

  @IsEmail()
  @IsString()
  readonly email?: string;

  @IsBoolean()
  readonly isTwoFactorAuthenticationEnabled?: boolean;

  @IsString()
  readonly twoFactorAuthenticationSecret?: string;

  @IsBase64()
  @IsString()
  readonly avatar?: string;
}
