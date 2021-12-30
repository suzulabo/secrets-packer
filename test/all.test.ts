import { fs, vol } from 'memfs';
import { packSecrets, SecretsConfig, unpackSecrets } from '../src';

jest.mock('fs', () => fs);

describe('all', () => {
  beforeEach(() => {
    vol.reset();
  });

  it('ok', async () => {
    vol.mkdirpSync('./secrets');
    vol.writeFileSync('./secrets/a.json', 'aaa');
    vol.writeFileSync('./secrets/b.json', 'bbb');
    vol.writeFileSync('./secrets/secrets.json', JSON.stringify({ A: 'AA', B: 'BB' }));

    const config: SecretsConfig = {
      files: [['a.json'], ['b.json']],
      secretsJSONKeys: ['A', 'B'],
    };

    await packSecrets(config);

    const packed = vol.readFileSync('./secrets/PACKED.txt', { encoding: 'utf8' }) as string;
    const keysJSON = JSON.parse(
      vol.readFileSync('./secrets/.secrets-sign.json', { encoding: 'utf8' }) as string,
    );

    vol.reset();
    vol.mkdirpSync('.');

    process.env['SECRET_PACKED'] = packed;
    process.env['SECRET_PACKED_SIGN'] = keysJSON.publicKey;

    const consoleSpy = jest.spyOn(console, 'log');

    await unpackSecrets(config);

    expect(consoleSpy).toHaveBeenNthCalledWith(1, '::set-output name=A::AA');
    expect(consoleSpy).toHaveBeenNthCalledWith(2, '::set-output name=B::BB');
  });
});
