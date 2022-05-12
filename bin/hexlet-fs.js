import HexletFs from '../src/HexletFs.js';

const files = new HexletFs();

files.mkdirSync('/etc');
console.log(files.isDirectory('/etc'));
