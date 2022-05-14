/* eslint-disable class-methods-use-this */
import Node from './Node.js';

export default class extends Node {
  isDirectory() {
    return true;
  }

  isFile() {
    return false;
  }
}
