export interface PasswordGateway {
  isValid(plainPassword: string, encryptedPassword: string): boolean;
  encrypt(plainPassword: string): string;
}
