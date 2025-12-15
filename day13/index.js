"use strict";

/**
 * Advent of Code 2020 - Day 13 (Shuttle Search)
 *
 * Node docs:
 * - process.argv: https://nodejs.org/api/process.html#processargv
 * - path.join: https://nodejs.org/api/path.html#pathjoinpaths
 * - path.resolve: https://nodejs.org/api/path.html#pathresolvepaths
 *
 * MDN docs:
 * - BigInt: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/BigInt
 * - Array.prototype.filter: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
 * - Array.prototype.map: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/map
 * - String.prototype.split: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String/split
 */

const path = require("path");
const { readInputLines } = require("../utils/readInput");

/**
 * Greatest common divisor (GCD) for BigInt values.
 * Used for LCM computation in part 2.
 */
function gcdBigInt(a, b) {
  let x = a < 0n ? -a : a;
  let y = b < 0n ? -b : b;

  while (y !== 0n) {
    const temp = x % y;
    x = y;
    y = temp;
  }
  return x;
}

/**
 * Least common multiple (LCM) for BigInt values.
 * If two constraints are satisfied, stepping by LCM keeps both satisfied.
 */
function lcmBigInt(a, b) {
  return (a / gcdBigInt(a, b)) * b;
}

/**
 * Part 1:
 * For each bus ID, compute wait time:
 * wait = (busId - (earliest % busId)) % busId
 * Choose smallest wait.
 */
function solvePart1(earliestTimestamp, busIds) {
  let bestBusId = null;
  let bestWait = Infinity;

  for (const busId of busIds) {
    const wait = (busId - (earliestTimestamp % busId)) % busId;
    if (wait < bestWait) {
      bestWait = wait;
      bestBusId = busId;
    }
  }

  return bestBusId * bestWait;
}

/**
 * Part 2:
 * Incremental CRT-style approach.
 *
 * We build the solution one bus at a time:
 * - Maintain a time value that satisfies all constraints so far.
 * - Maintain a step size that preserves those constraints (LCM of included bus IDs).
 *
 * For a busId at offset i, we need: (time + i) % busId === 0
 * We increase time by step until this new constraint is satisfied.
 */
function solvePart2(scheduleTokens) {
  let time = 0n;
  let step = 1n;

  for (let offset = 0; offset < scheduleTokens.length; offset += 1) {
    const token = scheduleTokens[offset];
    if (token === "x") continue;

    const busId = BigInt(token);
    const offsetBig = BigInt(offset);

    while ((time + offsetBig) % busId !== 0n) {
      time += step;
    }

    // Once aligned, update step so we keep all constraints aligned going forward
    step = lcmBigInt(step, busId);
  }

  return time.toString();
}

function main() {
  const defaultInputPath = path.join(__dirname, "input.txt");
  const inputPath = process.argv[2] ? path.resolve(process.argv[2]) : defaultInputPath;

  const lines = readInputLines(inputPath);

  const earliestTimestamp = Number(lines[0]);
  const scheduleTokens = lines[1].split(",");

  const busIds = scheduleTokens.filter((t) => t !== "x").map(Number);

  console.log("Day 13");
  console.log("Part 1:", solvePart1(earliestTimestamp, busIds));
  console.log("Part 2:", solvePart2(scheduleTokens));
}

main();
