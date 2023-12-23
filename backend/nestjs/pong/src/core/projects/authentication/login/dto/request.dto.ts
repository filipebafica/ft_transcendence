export class LoginRequestDTO {
  constructor(
    readonly id: number,
    readonly username: string,
    readonly nickname: string,
    readonly email: string,
  ) {}
}
