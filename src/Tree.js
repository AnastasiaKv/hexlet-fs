class Tree {
  constructor(key, meta, parent) {
    this.key = key;
    this.meta = meta;
    this.parent = parent;
    this.children = new Map();
  }

  getKey() {
    return this.key;
  }

  getMeta() {
    return this.meta;
  }

  getParent() {
    return this.parent;
  }

  getChild(key) {
    return this.children.get(key);
  }

  getChildren() {
    return [...this.children.values()];
  }

  getDeepChild(keys) {
    const [key, ...restKeys] = keys;
    const child = this.getChild(key);
    if (!restKeys.length || !child) return child;
    return child.getDeepChild(restKeys);
  }

  hasChild(key) {
    return this.children.has(key);
  }

  hasChildren() {
    return this.children.size > 0;
  }

  addChild(key, meta) {
    const child = new Tree(key, meta, this);
    this.children.set(key, child);
    return child;
  }

  removeChild(key) {
    return this.children.delete(key);
  }
}

export default Tree;
