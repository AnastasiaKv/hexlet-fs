export default class extends Error {
  constructor({ code, errno, description }, path) {
    super(`${code}: ${description}, ${path}`);
    this.code = code;
    this.errno = errno;
    this.path = path;
  }
}
