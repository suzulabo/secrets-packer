export interface SecretsConfig {
  files?: [name: string, location?: string][];
  secretsJSONKeys?: string[];
  rootDir?: string;
  secretsDir?: string;
  packedFile?: string;
  signFile?: string;
}

export const ROOT_DIR_DEFAULT = '.';
export const SECRETS_DIR_DEFAULT = './secrets';
export const PACKED_FILENAME_DEFAULT = 'PACKED.txt';
export const SIGN_FILENAME_DEFAULT = '.secrets-sign.json';
export const SECRETS_JSON_FILENAME = 'secrets.json';

export interface SignJSON {
  privateKey: string;
  publicKey: string;
}
