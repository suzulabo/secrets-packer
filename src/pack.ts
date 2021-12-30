import * as fs from 'fs';
import JSZip from 'jszip';
import * as path from 'path';
import nacl from 'tweetnacl';
import { PACKED_FILENAME_DEFAULT, SignJSON, SIGN_FILENAME_DEFAULT } from '.';
import { SecretsConfig, SECRETS_DIR_DEFAULT, SECRETS_JSON_FILENAME } from './types';

export const packSecrets = async (config: SecretsConfig) => {
  const zip = new JSZip();

  const secretsDir = config.secretsDir || SECRETS_DIR_DEFAULT;
  if (!fs.existsSync(secretsDir)) {
    throw `missing secretsDir: ${secretsDir}`;
  }

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
    type: 'uint8array',
    compression: 'DEFLATE',
    compressionOptions: { level: 9 },
  });

  const signKey = (() => {
    const signFilename = config.signFile || path.join(secretsDir, SIGN_FILENAME_DEFAULT);

    if (fs.existsSync(signFilename)) {
      const json = JSON.parse(fs.readFileSync(signFilename, 'utf-8')) as SignJSON;
      const buf = Buffer.from(json.privateKey, 'base64');
      return new Uint8Array(buf);
    }
    const _keys = nacl.sign.keyPair();
    const keys: SignJSON = {
      privateKey: Buffer.from(_keys.secretKey).toString('base64'),
      publicKey: Buffer.from(_keys.publicKey).toString('base64'),
    };

    fs.writeFileSync(signFilename, JSON.stringify(keys, undefined, 2));

    return _keys.secretKey;
  })();

  const signed = nacl.sign(packed, signKey);
  const signedBase64 = Buffer.from(signed).toString('base64');

  const packedFilename = config.packedFile || path.join(secretsDir, PACKED_FILENAME_DEFAULT);

  fs.writeFileSync(packedFilename, signedBase64);
};
