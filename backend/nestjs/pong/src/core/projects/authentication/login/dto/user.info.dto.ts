export class UserInfoDTO {
  constructor(
    readonly oAuthProviderId: number,
    readonly username: string,
    readonly nickname: string,
    readonly email: string,
  ) {}
}
