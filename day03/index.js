"use strict";

/**
 * AoC 2020 - Day 03 (Toboggan Trajectory)
 *
 * Node docs:
 * - process.argv: https://nodejs.org/api/process.html#processargv
 * - path.join: https://nodejs.org/api/path.html#pathjoinpaths
 * - path.resolve: https://nodejs.org/api/path.html#pathresolvepaths
 *
 * MDN docs:
 * - Array.prototype.length: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/length
 * - String.prototype.length: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String/length
 */

const path = require("path");
const { readInputLines } = require("../utils/readInput");

function countTreesOnSlope(mapLines, rightStep, downStep) {
  const mapHeight = mapLines.length;
  const rowWidth = mapLines[0].length;

  let row = 0;
  let col = 0;
  let treeCount = 0;

  while (row < mapHeight) {
    const cell = mapLines[row][col % rowWidth];
    if (cell === "#") treeCount += 1;

    row += downStep;
    col += rightStep;
  }

  return treeCount;
}

function main() {
  const defaultInputPath = path.join(__dirname, "input.txt");
  const inputPath = process.argv[2] ? path.resolve(process.argv[2]) : defaultInputPath;

  const mapLines = readInputLines(inputPath);

  console.log("Day 03");

  const part1 = countTreesOnSlope(mapLines, 3, 1);
  console.log("Part 1:", part1);

  const slopes = [
    [1, 1],
    [3, 1],
    [5, 1],
    [7, 1],
    [1, 2],
  ];

  let product = 1;
  for (const [r, d] of slopes) {
    product *= countTreesOnSlope(mapLines, r, d);
  }

  console.log("Part 2:", product);
}

main();
