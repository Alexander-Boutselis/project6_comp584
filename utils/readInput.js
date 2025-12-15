"use strict";

/*********************************************************
 * readInput utilities for AoC.
 *
 * Node docs:
 * - fs.readFileSync: https://nodejs.org/api/fs.html#fsreadfilesyncpath-options
 * - path.resolve: https://nodejs.org/api/path.html#pathresolvepaths
 *
 * MDN docs:
 * - String.prototype.replace: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String/replace
 * - String.prototype.trimEnd: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String/trimEnd
 * - String.prototype.split: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String/split
 *********************************************************/

const fs = require("fs");
const path = require("path");

/*********************************************************
 * Read file as text, normalize Windows newlines to "\n", and trim only the end.
 * AoC inputs might end with a newline; trimming the end avoids accidental empty lines.
 *********************************************************/
function readInputRaw(filePath) {
  const absolutePath = path.resolve(filePath);
  return fs.readFileSync(absolutePath, "utf8").replace(/\r\n/g, "\n").trimEnd();
}

/*********************************************************
 * Read input and split into lines.
 *********************************************************/
function readInputLines(filePath) {
  const raw = readInputRaw(filePath);
  if (raw.length === 0) return [];
  return raw.split("\n");
}

/*********************************************************
 * Read input and split into blank-line separated blocks
 *********************************************************/
function readInputBlocks(filePath) {
  const raw = readInputRaw(filePath);
  if (raw.length === 0) return [];
  return raw.split("\n\n");
}

module.exports = { readInputRaw, readInputLines, readInputBlocks };
