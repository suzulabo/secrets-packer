import * as fs from 'fs';
import JSZip from 'jszip';
import * as path from 'path';
import { SecretsConfig, SECRETS_DIR_DEFAULT, SECRETS_JSON_FILENAME } from './types';

export const unpackSecrets = async (config: SecretsConfig) => {
  const secretValues = process.env['SECRET_VALUES'];
  if (!secretValues) {
    throw 'missing SECRET_VALUES';
  }

  const secretsDir = config.secretsDir || SECRETS_DIR_DEFAULT;

  const zip = new JSZip();
  await zip.loadAsync(secretValues, { base64: true });

  if (!fs.existsSync(secretsDir)) {
    fs.mkdirSync(secretsDir);
  }

  if (config.files) {
    for (const [name] of config.files) {
      const f = zip.file(name);
      if (!f) {
        throw `missing ${name}`;
      }

      const filename = path.join(secretsDir, name);
      const data = await f.async('nodebuffer');
      if (fs.existsSync(filename)) {
        const cur = fs.readFileSync(filename);
        console.warn(`${name} already exist (${data.equals(cur) ? 'same' : 'updated'})`);
        continue;
      }

      console.info(`unpack: ${name}`);
      fs.writeFileSync(filename, data);
    }
  }

  if (config.secretsJSONKeys) {
    const secretsJson: Record<string, string> = JSON.parse(
      fs.readFileSync(path.join(secretsDir, SECRETS_JSON_FILENAME), 'utf-8'),
    );

    for (const key of config.secretsJSONKeys) {
      const v = secretsJson[key];
      if (!v) {
        throw `missing ${key}`;
      }
      console.log(`::set-output name=${key}::${v}`);
    }
  }
};
