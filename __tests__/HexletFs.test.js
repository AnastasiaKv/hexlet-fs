import HexletFs from '../src/index.js';

describe('FS', () => {
  let files;

  beforeEach(() => {
    files = new HexletFs();
    files.mkdirpSync('/etc/nginx');
    files.mkdirpSync('/opt');
    files.touchSync('/opt/file.txt');
    files.mkdirpSync('/etc/nginx/conf.d');
    files.writeFileSync('/etc/nginx/nginx.conf', 'directives');
  });

  it('#copySync', () => {
    expect(() => files.copySync('undefined', '/etc'))
      .toThrow(/ENOENT/);

    expect(() => files.copySync('/opt', '/etc'))
      .toThrow(/EISDIR/);

    expect(() => files.copySync('/op/file.txt', '/etc/file.txt/inner'))
      .toThrow(/ENOENT/);

    expect(() => files.copySync('/opt/file.txt', '/etc/undefined/inner'))
      .toThrow(/ENOENT/);

    files.copySync('/opt/file.txt', '/etc');
    expect(files.statSync('/etc/file.txt').isFile())
      .toBeTruthy();

    files.copySync('/opt/file.txt', '/etc/nginx/nginx.conf');
    expect(files.readFileSync('/etc/nginx/nginx.conf'))
      .toBe('');
  });

  it('#copySync2', () => {
    files.writeFileSync('/opt/file.txt', 'body');
    files.copySync('/opt/file.txt', '/etc/nginx/nginx.conf');
    expect(files.readFileSync('/etc/nginx/nginx.conf'))
      .toBe('body');

    files.copySync('/opt/file.txt', '/etc');
    expect(files.readFileSync('/etc/file.txt'))
      .toBe('body');

    files.copySync('/opt/file.txt', '/opt/newfile');
    expect(files.readFileSync('/opt/newfile'))
      .toBe('body');
  });

  it('#copySync3', () => {
    files.mkdirpSync('/etc/nginx/conf.d');
    files.touchSync('/etc/nginx/nginx.conf');
    files.writeFileSync('/opt/file.txt', 'body');
    expect(() => files.copySync('/opt/file.txt', '/etc/nginx/nginx.conf/testFile'))
      .toThrow(/ENOENT/);
  });

  it('#mkdirpSync', () => {
    expect(() => files.mkdirpSync('/etc/nginx/nginx.conf/wrong'))
      .toThrow(/ENOTDIR/);
  });

  it('#mkdirSync', () => {
    expect(() => files.mkdirSync('/etc/nginx/nginx.conf/wrong'))
      .toThrow(/ENOTDIR/);

    expect(() => files.mkdirSync('/opt/folder/inner'))
      .toThrow(/ENOENT/);

    expect(files.statSync('/opt').isDirectory())
      .toBe(true);
  });

  it('#touchSync', () => {
    expect(() => files.touchSync('/etc/nginx/nginx.conf/wrong'))
      .toThrow(/ENOTDIR/);

    expect(() => files.touchSync('/opt/folder/inner'))
      .toThrow(/ENOENT/);

    expect(files.statSync('/opt/file.txt').isFile())
      .toBe(true);
  });

  it('#writeFileSync', () => {
    expect(() => files.writeFileSync('/etc/unknown/file', 'body'))
      .toThrow(/ENOENT/);

    expect(() => files.writeFileSync('/etc', 'body'))
      .toThrow(/EISDIR/);

    expect(() => files.writeFileSync('/opt/file.txt/file2.txt', 'body'))
      .toThrow(/ENOTDIR/);
  });

  it('#readdirSync', () => {
    expect(files.readdirSync('/etc/nginx'))
      .toEqual(['conf.d', 'nginx.conf']);

    expect(() => files.readdirSync('/etc/nginx/undefined'))
      .toThrow(/ENOENT/);

    expect(() => files.readdirSync('/etc/nginx/nginx.conf'))
      .toThrow(/ENOTDIR/);
  });

  it('#readFileSync', () => {
    expect(files.readFileSync('/etc/nginx/nginx.conf'))
      .toEqual('directives');

    expect(() => files.readFileSync('/etc/nginx'))
      .toThrow(/EISDIR/);

    expect(() => files.readFileSync('/etc/unknown'))
      .toThrow(/ENOENT/);
  });

  it('#unlinkSync', () => {
    files.unlinkSync('/etc/nginx/nginx.conf');
    expect(files.readdirSync('/etc/nginx'))
      .toEqual(['conf.d']);

    expect(() => files.unlinkSync('/etc/nginx/undefined.txt'))
      .toThrow(/ENOENT/);

    expect(() => files.unlinkSync('/etc/nginx'))
      .toThrow(/EPERM/);
  });

  it('#rmdirSync', () => {
    files.rmdirSync('/etc/nginx/conf.d');
    expect(files.readdirSync('/etc/nginx'))
      .toEqual(['nginx.conf']);

    expect(() => files.rmdirSync('/etc/unknown'))
      .toThrow(/ENOENT/);

    expect(() => files.rmdirSync('/etc/nginx'))
      .toThrow(/ENOTEMPTY/);

    expect(() => files.rmdirSync('/etc/nginx/nginx.conf'))
      .toThrow(/ENOTDIR/);
  });

  it('#statSync', () => {
    expect(files.statSync('/etc/nginx').isDirectory())
      .toBe(true);

    expect(files.statSync('/etc/nginx').isFile())
      .toBe(false);

    expect(files.statSync('/etc/nginx/nginx.conf').isDirectory())
      .toBe(false);

    expect(files.statSync('/etc/nginx/nginx.conf').isFile())
      .toBe(true);

    expect(() => files.statSync('/etc/unknown'))
      .toThrow(/ENOENT/);
  });
});
