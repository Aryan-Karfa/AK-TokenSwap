export interface SupportedToken {
  code: string;
  issuer?: string;
  name: string;
  symbol: string;
  decimals: number;
  color: string;
  isNative: boolean;
}
