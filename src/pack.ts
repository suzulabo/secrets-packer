import * as fs from 'fs';
import JSZip from 'jszip';
import * as path from 'path';
import {
  SecretsConfig,
  SECRETS_DIR_DEFAULT,
  SECRETS_JSON_FILENAME,
  VALUES_FILENAME_DEFAULT,
} from './types';

export const packSecrets = async (config: SecretsConfig) => {
  const zip = new JSZip();

  const secretsDir = config.secretsDir || SECRETS_DIR_DEFAULT;

  if (config.files) {
    for (const [name] of config.files) {
      const p = path.join(secretsDir, name);
      if (!fs.existsSync(p)) {
        throw `missing ${p}`;
      }
      zip.file(name, fs.createReadStream(p));
    }
  }

  if (!(SECRETS_JSON_FILENAME in zip.files)) {
    const p = path.join(secretsDir, SECRETS_JSON_FILENAME);
    if (fs.existsSync(p)) {
      zip.file(SECRETS_JSON_FILENAME, fs.createReadStream(p));
    }
  }

  const packed = await zip.generateAsync({
    type: 'base64',
    compression: 'DEFLATE',
    compressionOptions: { level: 9 },
  });

  const valuesFilename = config.valuesFilename || VALUES_FILENAME_DEFAULT;

  fs.writeFileSync(path.join(secretsDir, valuesFilename), packed);
};
