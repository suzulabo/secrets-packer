export interface SecretsConfig {
  secretsJSONKeys?: string[];
  files?: [name: string, location?: string][];
  rootDir?: string;
  secretsDir?: string;
  valuesFilename?: string;
}

export const ROOT_DIR_DEFAULT = '.';
export const SECRETS_DIR_DEFAULT = './secrets';
export const VALUES_FILENAME_DEFAULT = 'SECRET_VALUES.txt';
export const SECRETS_JSON_FILENAME = 'secrets.json';
