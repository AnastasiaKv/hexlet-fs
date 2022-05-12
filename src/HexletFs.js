import path from 'path';
import Tree from './Tree.js';

const getPathParts = (filepath) => filepath.split(path.sep).filter((part) => part);

export default class {
  constructor() {
    this.tree = new Tree('/', { type: 'dir' });
  }

  isDirectory(filepath) {
    const subtree = this.findNode(filepath);
    return subtree?.getMeta().type === 'dir';
  }

  isFile(filepath) {
    const subtree = this.findNode(filepath);
    return subtree?.getMeta().type === 'file';
  }

  mkdirSync(filepath) {
    const parsedPath = path.parse(filepath);
    if (this.isDirectory(parsedPath.dir)) {
      const subtree = this.findNode(parsedPath.dir);
      subtree.addChild(parsedPath.base, { type: 'dir' });
    }
  }

  touchSync(filepath) {
    const parsedPath = path.parse(filepath);
    if (this.isDirectory(parsedPath.dir)) {
      const subtree = this.findNode(parsedPath.dir);
      subtree.addChild(parsedPath.base, { type: 'file' });
    }
  }

  findNode(filepath) {
    const parts = getPathParts(filepath);
    return parts.length === 0 ? this.tree : this.tree.getDeepChild(parts);
  }
}
