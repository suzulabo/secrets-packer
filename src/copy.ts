import * as fs from 'fs';
import * as path from 'path';
import { ROOT_DIR_DEFAULT, SecretsConfig, SECRETS_DIR_DEFAULT } from './types';

export const copySecrets = (config: SecretsConfig) => {
  const rootDir = config.rootDir || ROOT_DIR_DEFAULT;
  const secretsDir = config.secretsDir || SECRETS_DIR_DEFAULT;

  if (config.files) {
    for (const [name, location] of config.files) {
      if (!location) {
        continue;
      }

      const destFile = path.join(rootDir, location, name);

      console.info(`${name} -> ${destFile}`);

      if (fs.existsSync(destFile)) {
        console.info('skip');
        continue;
      }

      if (!fs.existsSync(location)) {
        fs.mkdirSync(location);
      }

      fs.copyFileSync(path.join(secretsDir, name), destFile);
    }
  }
};
