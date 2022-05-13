import path from 'path';
import errors from 'errno';
import Tree from './Tree.js';

import Dir from './Dir.js';
import File from './File.js';

const getPathParts = (filepath) => filepath.split(path.sep).filter((part) => part !== '');

export default class {
  constructor() {
    this.tree = new Tree('/', new Dir('/'));
  }

  statSync(nodepath) {
    const current = this.findNode(nodepath);
    if (!current) {
      return [null, errors.code.ENOENT];
    }
    return [current.getMeta().getStats(), null];
  }

  mkdirSync(dirpath) {
    const current = this.findNode(dirpath);
    if (current) {
      return [null, errors.code.EEXIST];
    }
    const { base, dir } = path.parse(dirpath);
    const parent = this.findNode(dir);
    if (!parent) {
      return [null, errors.code.ENOENT];
    }
    if (!parent.getMeta().isDirectory()) {
      return [null, errors.code.ENOTDIR];
    }
    return [parent.addChild(base, new Dir(base)), null];
  }

  mkdirpSync(dirpath) {
    const current = this.findNode(dirpath);
    if (!current) {
      const { dir } = path.parse(dirpath);
      this.mkdirpSync(dir);
    } else if (!current.getMeta().isDirectory()) {
      return [null, errors.code.ENOTDIR];
    }
    return [this.mkdirSync(dirpath), null];
  }

  readdirSync(dirpath) {
    const current = this.findNode(dirpath);
    if (!current) {
      return [null, errors.code.ENOENT];
    }
    if (!current.getMeta().isDirectory()) {
      return [null, errors.code.ENOTDIR];
    }
    return [current.getChildren().map((child) => child.getKey()), null];
  }

  touchSync(filepath) {
    const { base, dir } = path.parse(filepath);
    const parent = this.findNode(dir);
    if (!parent) {
      return [null, errors.code.ENOENT];
    }
    if (!parent.getMeta().isDirectory()) {
      return [null, errors.code.ENOTDIR];
    }
    return [parent.addChild(base, new File(base, '')), null];
  }

  rmdirSync(dirpath) {
    const { base } = path.parse(dirpath);
    const current = this.findNode(dirpath);
    if (!current) {
      return [null, errors.code.ENOENT];
    }
    if (!current.getMeta().isDirectory()) {
      return [null, errors.code.ENOTDIR];
    }
    if (current.hasChildren()) {
      return [null, errors.code.ENOTEMPTY];
    }
    return [current.getParent().removeChild(base), null];
  }

  unlinkSync(filepath) {
    const current = this.findNode(filepath);
    if (!current) {
      return [null, errors.code.ENOENT];
    }
    if (!current.getMeta().isFile()) {
      return [null, errors.code.EPERM];
    }
    return [current.getParent().removeChild(current.getKey()), null];
  }

  writeFileSync(filepath, content) {
    const current = this.findNode(filepath);
    if (current && current.getMeta().isDirectory()) {
      return [null, errors.code.EISDIR];
    }
    const { base, dir } = path.parse(filepath);
    const parent = this.findNode(dir);
    if (!parent) {
      return [null, errors.code.ENOENT];
    }
    if (!parent.getMeta().isDirectory()) {
      return [null, errors.code.ENOTDIR];
    }
    return [parent.addChild(base, new File(base, content)), null];
  }

  readFileSync(filepath) {
    const current = this.findNode(filepath);
    if (!current) {
      return [null, errors.code.ENOENT];
    }
    if (current.getMeta().isDirectory()) {
      return [null, errors.code.EISDIR];
    }
    return [current.getMeta().getBody(), null];
  }

  // ok
  findNode(nodepath) {
    const parts = getPathParts(nodepath);
    return parts.length === 0 ? this.tree : this.tree.getDeepChild(parts);
  }
}
