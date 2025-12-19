"use strict";

/**
 * AoC 2020 - Day 01 (Report Repair)
 *
 * Node docs:
 * - process.argv: https://nodejs.org/api/process.html#processargv
 * - path.join: https://nodejs.org/api/path.html#pathjoinpaths
 * - path.resolve: https://nodejs.org/api/path.html#pathresolvepaths
 *
 * MDN docs:
 * - Number: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number
 * - Set: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Set
 * - Array.prototype.map: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/map
 */

const path = require("path");
const { readInputLines } = require("../utils/readInput");

const TARGET_SUM = 2020;

function solvePart1(numbers) {
  // Use a Set for O(1) lookups: for each n, check if (TARGET_SUM - n) exists.
  const seen = new Set();

  for (const n of numbers) {
    const needed = TARGET_SUM - n;
    if (seen.has(needed)) {
      return n * needed;
    }
    seen.add(n);
  }

  return null; // if not found
}

function solvePart2(numbers) {
  // For each i, reduce to a 2-sum problem on the rest: O(n^2)
  for (let i = 0; i < numbers.length; i += 1) {
    const first = numbers[i];
    const remainingTarget = TARGET_SUM - first;

    const seen = new Set();
    for (let j = i + 1; j < numbers.length; j += 1) {
      const second = numbers[j];
      const needed = remainingTarget - second;
      if (seen.has(needed)) {
        return first * second * needed;
      }
      seen.add(second);
    }
  }

  return null;
}

function main() {
  const defaultInputPath = path.join(__dirname, "input.txt");
  const inputPath = process.argv[2] ? path.resolve(process.argv[2]) : defaultInputPath;

  const numbers = readInputLines(inputPath).map((line) => Number(line));

  console.log("Day 01");
  console.log("Part 1:", solvePart1(numbers));
  console.log("Part 2:", solvePart2(numbers));
}

main();
