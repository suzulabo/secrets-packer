export interface SecretsConfig {
  secretsJSONKeys?: string[];
  files?: [name: string, location?: string][];
  rootDir?: string;
  secretsDir?: string;
  valuesFile?: string;
  signFile?: string;
}

export const ROOT_DIR_DEFAULT = '.';
export const SECRETS_DIR_DEFAULT = './secrets';
export const VALUES_FILENAME_DEFAULT = 'SECRET_VALUES.txt';
export const SIGN_FILENAME_DEFAULT = 'secrets-sign.json';
export const SECRETS_JSON_FILENAME = 'secrets.json';

export interface SignJSON {
  privateKey: string;
  publicKey: string;
}
