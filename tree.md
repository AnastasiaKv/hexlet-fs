# Tree

Class that represent an arbitary tree

## Parameters

- key **string**
- meta **any?**
- parent **Tree?**

## getKey

Get node's key

#### Examples

```sh
const tree = new Tree('/');
const node = tree.addChild('etc');
node.getKey(); // etc
```

Returns **string**

## getMeta

Get node's meta

#### Examples

```sh
const tree = new Tree('/', 'root directory');
tree.getMeta(); // root directory
```

## addChild

Add child to node's children list

#### Parameters

- key **string**
- meta **any?**

#### Examples

```sh
const tree = new Tree('/');
const node = tree.addChild('etc', { writable: false });
```

Returns **Tree**

## hasChild

Check if node has child by key

#### Parameters

- key **string**

#### Examples

```sh
const tree = new Tree('/');
tree.addChild('etc');
tree.hasChild('etc'); // true
```

Returns **boolean**

## getParent

Get node's parent node

#### Examples

```sh
const tree = new Tree('/');
const node = tree.addChild('etc');
node.getParent() === tree; // true
```

Returns **Tree?**

## removeChild

remove child from tree

#### Parameters

- key **string**

#### Examples

```sh
const tree = new Tree('/');
tree.addChild('etc');
tree.removeChild('etc');
tree.hasChild('etc'); // false
```

Returns **boolean**

## hasChildren

Check if node has children

#### Examples

```sh
const tree = new Tree('/');
tree.hasChildren(); // false
tree.addChild('etc');
tree.hasChildren(); // true
```

Returns **boolean**

## getChild

Get tree's child by key

#### Parameters

- key **string**

#### Examples

```sh
const tree = new Tree('/');
const node = tree.addChild('etc');
node === tree.getChild('etc'); // true
```

## getDeepChild

Get tree's deep child

#### Parameters

- keys **Array<string>**

#### Examples

```sh
const tree = new Tree('/');
const etcNode = tree.addChild('etc');
const libNode = etcNode.addChild('lib');
libNode === tree.getDeepChild(['etc', 'lib']);
etcNode === tree.getDeepChild(['etc']);
tree.getDeepChild(['etc', 'lalala']); // undefined
```

Returns **Tree?**

## getChildren

Get node's children

Returns **Array<Tree>**
