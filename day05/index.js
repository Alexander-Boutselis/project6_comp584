"use strict";

/**
 * Advent of Code 2020 - Day 05 (Binary Boarding)
 *
 * Node docs:
 * - process.argv: https://nodejs.org/api/process.html#processargv
 * - path.join: https://nodejs.org/api/path.html#pathjoinpaths
 * - path.resolve: https://nodejs.org/api/path.html#pathresolvepaths
 *
 * MDN docs:
 * - String.prototype.replace: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String/replace
 * - parseInt (radix): https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/parseInt
 * - Math.max: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Math/max
 * - Array.prototype.sort: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
 */

const path = require("path");
const { readInputLines } = require("../utils/readInput");

/**
 * Convert a boarding pass code into a seat ID.
 *
 * Trick:
 * - Treat F and L as binary 0
 * - Treat B and R as binary 1
 *
 * The resulting 10-bit binary number equals: row * 8 + column
 */
function seatIdFromCode(boardingPassCode) {
  const binaryString = boardingPassCode
    .replace(/[FL]/g, "0")
    .replace(/[BR]/g, "1");

  return parseInt(binaryString, 2);
}

function solve(lines) {
  const seatIds = lines.map(seatIdFromCode);

  // Part 1: highest seat ID
  const part1 = Math.max(...seatIds);

  // Part 2: sort IDs and look for a gap of 2 (missing ID in the middle)
  seatIds.sort((a, b) => a - b);

  let part2 = null;
  for (let i = 1; i < seatIds.length; i += 1) {
    const previousId = seatIds[i - 1];
    const currentId = seatIds[i];

    if (currentId - previousId === 2) {
      part2 = previousId + 1;
      break;
    }
  }

  return { part1, part2 };
}

function main() {
  const defaultInputPath = path.join(__dirname, "input.txt");
  const inputPath = process.argv[2] ? path.resolve(process.argv[2]) : defaultInputPath;

  const lines = readInputLines(inputPath);
  const { part1, part2 } = solve(lines);

  console.log("Day 05");
  console.log("Part 1:", part1);
  console.log("Part 2:", part2);
}

main();
