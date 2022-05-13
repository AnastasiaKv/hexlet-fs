import HexletFs from '../src/HexletFs.js';

describe('FS', () => {
  let files;

  beforeEach(() => {
    files = new HexletFs();
    files.mkdirpSync('/etc');
    files.mkdirpSync('/opt');
    files.touchSync('/opt/file.txt');
    files.mkdirpSync('/etc/nginx/conf.d');
  });

  it('#writeFileSync', () => {
    const [data, err] = files.writeFileSync('/etc/unknown/file', 'body');
    expect(data).toBe(null);
    expect(err.code).toBe('ENOENT');

    const [data2, err2] = files.writeFileSync('/etc', 'body');
    expect(data2).toBe(null);
    expect(err2.code).toBe('EISDIR');

    const [data3, err3] = files.writeFileSync('/opt/file.txt/wrong', 'body');
    expect(data3).toBe(null);
    expect(err3.code).toBe('ENOTDIR');
  });

  it('#readFileSync', () => {
    files.writeFileSync('/etc/nginx/nginx.conf', 'directives');
    const [data, err] = files.readFileSync('/etc/nginx/nginx.conf');
    expect(data).toBe('directives');
    expect(err).toBe(null);

    const [data2, err2] = files.readFileSync('/etc/nginx');
    expect(data2).toBe(null);
    expect(err2.code).toBe('EISDIR');

    const [data3, err3] = files.readFileSync('/etc/unknown');
    expect(data3).toBe(null);
    expect(err3.code).toBe('ENOENT');
  });

  it('#unlinkSync', () => {
    files.writeFileSync('/etc/nginx/nginx.conf', 'directives');
    files.unlinkSync('/etc/nginx/nginx.conf');
    const [data, err] = files.readdirSync('/etc/nginx');
    expect(err).toBe(null);
    expect(data).toEqual(['conf.d']);

    const [data2, err2] = files.unlinkSync('/etc/nginx');
    expect(data2).toBe(null);
    expect(err2.code).toBe('EPERM');

    const [data3, err3] = files.unlinkSync('/etc/nginx/unexist.file');
    expect(data3).toBe(null);
    expect(err3.code).toBe('ENOENT');
  });

  it('#writeFileSync&readFileSync', () => {
    const [data, err] = files.writeFileSync('/opt/another-file.txt', 'body');
    expect(data.getMeta().getName()).toBe('another-file.txt');
    expect(err).toBe(null);
    const [data2, err2] = files.readFileSync('/opt/another-file.txt');
    expect(data2).toBe('body');
    expect(err2).toBe(null);
  });
});
