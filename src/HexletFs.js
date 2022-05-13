import path from 'path';
import Tree from './Tree.js';

import Dir from './Dir.js';
import File from './File.js';

const getPathParts = (filepath) => filepath.split(path.sep).filter((part) => part !== '');

export default class {
  constructor() {
    this.tree = new Tree('/', new Dir('/'));
  }

  statSync(filepath) {
    const current = this.findNode(filepath);
    if (!current) {
      return null;
    }
    return current.getMeta().getStats();
  }

  mkdirSync(filepath) {
    const current = this.findNode(filepath);
    if (current) {
      return false;
    }
    const { base, dir } = path.parse(filepath);
    const parent = this.findNode(dir);
    if (!parent || !parent.getMeta().isDirectory()) {
      return false;
    }
    parent.addChild(base, new Dir(base));
    return true;
  }

  mkdirpSync(filepath) {
    const current = this.findNode(filepath);
    if (!current) {
      const { dir } = path.parse(filepath);
      this.mkdirpSync(dir);
    } else if (!current.getMeta().isDirectory()) {
      return false;
    }
    return this.mkdirSync(filepath);
  }

  readdirSync(filepath) {
    const current = this.findNode(filepath);
    if (!current || !current.getMeta().isDirectory()) {
      return false;
    }
    return current.getChildren()
      .map((child) => child.getKey());
  }

  touchSync(filepath) {
    const { base, dir } = path.parse(filepath);
    const parent = this.findNode(dir);
    if (!parent) {
      return false;
    }
    if (!parent.getMeta().isDirectory()) {
      return false;
    }
    parent.addChild(base, new File(base, ''));
    return true;
  }

  rmdirSync(filepath) {
    const { base } = path.parse(filepath);
    const current = this.findNode(filepath);
    if (!current) {
      return false;
    }
    if (!current.getMeta().isDirectory() || current.hasChildren()) {
      return false;
    }
    current.getParent().removeChild(base);
    return true;
  }

  findNode(filepath) {
    const parts = getPathParts(filepath);
    return parts.length === 0 ? this.tree : this.tree.getDeepChild(parts);
  }
}
