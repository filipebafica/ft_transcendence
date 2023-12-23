export class UserDTO {
  constructor(
    readonly oAuthProviderId: number,
    readonly name: string,
    readonly nick_name: string,
    readonly email: string,
  ) {}
}
