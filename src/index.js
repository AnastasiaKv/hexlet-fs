import path from 'path';
import errors from 'errno';
import Tree from './components/Tree.js';
import Dir from './components/Dir.js';
import File from './components/File.js';
import HexletFsError from './helpers/HexletFsError.js';

const getPathParts = (filepath) => filepath.split(path.sep).filter((part) => part !== '');

export default class {
  constructor() {
    this.tree = new Tree('/', new Dir('/'));
  }

  statSync(nodepath) {
    const current = this.findNode(nodepath);
    if (!current) {
      throw new HexletFsError(errors.code.ENOENT, nodepath);
    }
    return current.getMeta().getStats();
  }

  mkdirSync(dirpath) {
    const { base, dir } = path.parse(dirpath);
    const parent = this.findNode(dir);
    if (!parent) {
      throw new HexletFsError(errors.code.ENOENT, dir);
    }
    if (!parent.getMeta().isDirectory()) {
      throw new HexletFsError(errors.code.ENOTDIR, dir);
    }
    return parent.addChild(base, new Dir(base));
  }

  mkdirpSync(dirpath) {
    const current = this.findNode(dirpath);
    if (!current) {
      const { dir } = path.parse(dirpath);
      this.mkdirpSync(dir);
    } else if (!current.getMeta().isDirectory()) {
      throw new HexletFsError(errors.code.ENOTDIR, dirpath);
    }
    return this.mkdirSync(dirpath);
  }

  readdirSync(dirpath) {
    const current = this.findNode(dirpath);
    if (!current) {
      throw new HexletFsError(errors.code.ENOENT, dirpath);
    }
    if (!current.getMeta().isDirectory()) {
      throw new HexletFsError(errors.code.ENOTDIR, dirpath);
    }
    return current.getChildren().map((child) => child.getKey());
  }

  touchSync(filepath) {
    const { base, dir } = path.parse(filepath);
    const parent = this.findNode(dir);
    if (!parent) {
      throw new HexletFsError(errors.code.ENOENT, dir);
    }
    if (!parent.getMeta().isDirectory()) {
      throw new HexletFsError(errors.code.ENOTDIR, dir);
    }
    return parent.addChild(base, new File(base, ''));
  }

  rmdirSync(dirpath) {
    const current = this.findNode(dirpath);
    if (!current) {
      throw new HexletFsError(errors.code.ENOENT, dirpath);
    }
    if (!current.getMeta().isDirectory()) {
      throw new HexletFsError(errors.code.ENOTDIR, dirpath);
    }
    if (current.hasChildren()) {
      throw new HexletFsError(errors.code.ENOTEMPTY, dirpath);
    }
    return current.getParent().removeChild(current.getKey());
  }

  unlinkSync(filepath) {
    const current = this.findNode(filepath);
    if (!current) {
      throw new HexletFsError(errors.code.ENOENT, filepath);
    }
    if (!current.getMeta().isFile()) {
      throw new HexletFsError(errors.code.EPERM, filepath);
    }
    return current.getParent().removeChild(current.getKey());
  }

  writeFileSync(filepath, content) {
    const current = this.findNode(filepath);
    if (current && current.getMeta().isDirectory()) {
      throw new HexletFsError(errors.code.EISDIR, filepath);
    }
    const { base, dir } = path.parse(filepath);
    const parent = this.findNode(dir);
    if (!parent) {
      throw new HexletFsError(errors.code.ENOENT, dir);
    }
    if (!parent.getMeta().isDirectory()) {
      throw new HexletFsError(errors.code.ENOTDIR, dir);
    }
    return parent.addChild(base, new File(base, content));
  }

  readFileSync(filepath) {
    const current = this.findNode(filepath);
    if (!current) {
      throw new HexletFsError(errors.code.ENOENT, filepath);
    }
    if (current.getMeta().isDirectory()) {
      throw new HexletFsError(errors.code.EISDIR, filepath);
    }
    return current.getMeta().getBody();
  }

  copySync(src, dest) {
    const srcNode = this.findNode(src);
    if (!srcNode) {
      throw new HexletFsError(errors.code.ENOENT, src);
    }
    if (srcNode.getMeta().isDirectory()) {
      throw new HexletFsError(errors.code.EISDIR, src);
    }

    const { base, dir } = path.parse(dest);
    const destNode = this.findNode(dest);
    const destParentNode = this.findNode(dir);
    const content = srcNode.getMeta().getBody();

    if (!destParentNode || destParentNode.getMeta().isFile()) {
      throw new HexletFsError(errors.code.ENOENT, dir);
    }
    if (destNode && destNode.getMeta().isDirectory()) {
      const fileName = srcNode.getMeta().getName();
      return destNode.addChild(fileName, new File(fileName, content));
    }
    return destParentNode.addChild(base, new File(base, content));
  }

  findNode(nodepath) {
    const parts = getPathParts(nodepath);
    return !parts.length ? this.tree : this.tree.getDeepChild(parts);
  }
}
