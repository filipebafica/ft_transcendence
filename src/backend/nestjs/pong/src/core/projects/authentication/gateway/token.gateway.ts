export interface TokenGateway {
  tokenizer(payload: object): Promise<TokenType>;
  decoder<T = any>(token: TokenType): T;
  validator<T extends object = any>(token: TokenType): Promise<T>;
}

export type TokenType = string;
