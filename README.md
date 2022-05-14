# Hexlet File System

[![tests-check](https://github.com/AnastasiaKv/hexlet-fs/actions/workflows/tests-check.yml/badge.svg)](https://github.com/AnastasiaKv/hexlet-fs/actions/workflows/tests-check.yml)
[![Maintainability](https://api.codeclimate.com/v1/badges/ab5b5ff2c2da6ebc101f/maintainability)](https://codeclimate.com/github/AnastasiaKv/hexlet-fs/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/ab5b5ff2c2da6ebc101f/test_coverage)](https://codeclimate.com/github/AnastasiaKv/hexlet-fs/test_coverage)

## Setup

- Install packages `make install`
- Run tests `make test`
- Show test-coverage `make test-coverage`
- Run linter `make lint`
- Publish `make publish`

## Usage

```sh
  const fs = new HexletFs();
  // Make directory
  fs.mkdirSync('/dirname');
  // Make nested directories
  fs.mkdirpSync('/dir1/dir2/dir3');
  // Remove directory
  fs.rmdirSync('/dirname');
  // Touch file
  fs.touchSync('/dir1/dir2/file.txt');
  fs.touchSync('/dir1/data');
  // Read directory
  fs.readdirSync('/dir1/dir2'); // ['file.txt', 'dir3']
  // Unlink file
  fs.unlinkSync('/dir1/dir2/file.txt');
  // Get file stat
  fs.statSync('/dir1/data').isFile(); // true
  fs.statSync('/dir1').isDirectory(); // true
  // Write file
  fs.writeFileSync('/dir1/data', 'content');
  // Read file
  fs.readFileSync('/dir1/data'); // 'content'
  // Copy file
  fs.copySync('/dir1/data', '/dir1/dir2');
  fs.readdirSync('/dir1/dir2'); // [ 'data', 'dir3' ]
```

```

```
