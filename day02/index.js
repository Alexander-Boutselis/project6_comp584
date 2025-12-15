"use strict";

/**
 * Advent of Code 2020 - Day 02 (Password Philosophy)
 *
 * Node docs:
 * - process.argv: https://nodejs.org/api/process.html#processargv
 * - path.join: https://nodejs.org/api/path.html#pathjoinpaths
 * - path.resolve: https://nodejs.org/api/path.html#pathresolvepaths
 *
 * MDN docs:
 * - RegExp: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/RegExp
 * - String.prototype.match: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String/match
 * - Array.prototype.map: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/map
 * - Array.prototype.filter: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
 */

const path = require("path");
const { readInputLines } = require("../utils/readInput");

/**
 * Parse one line like:
 *   "1-3 a: abcde"
 *
 * We extract:
 * - minimum (or first position)
 * - maximum (or second position)
 * - required character
 * - password text
 */
function parseLine(line) {
  const match = line.match(/^(\d+)-(\d+)\s+([a-zA-Z]):\s+(.+)$/);
  if (!match) {
    throw new Error(`Invalid line format: ${line}`);
  }

  return {
    firstNumber: Number(match[1]),
    secondNumber: Number(match[2]),
    policyCharacter: match[3],
    password: match[4],
  };
}

/**
 * Part 1 rule:
 * policyCharacter must appear in the password between firstNumber and secondNumber times (inclusive).
 */
function isValidPart1(entry) {
  let count = 0;
  for (const ch of entry.password) {
    if (ch === entry.policyCharacter) count += 1;
  }
  return count >= entry.firstNumber && count <= entry.secondNumber;
}

/**
 * Part 2 rule:
 * firstNumber and secondNumber are 1-indexed positions.
 * Exactly ONE of those positions must contain policyCharacter.
 */
function isValidPart2(entry) {
  const firstIndex = entry.firstNumber - 1;
  const secondIndex = entry.secondNumber - 1;

  const firstMatches = entry.password[firstIndex] === entry.policyCharacter;
  const secondMatches = entry.password[secondIndex] === entry.policyCharacter;

  // XOR (exclusive-or): true when exactly one is true
  return (firstMatches || secondMatches) && !(firstMatches && secondMatches);
}

function solve(lines) {
  const entries = lines.map(parseLine);

  const part1 = entries.filter(isValidPart1).length;
  const part2 = entries.filter(isValidPart2).length;

  return { part1, part2 };
}

function main() {
  // Default input is day02/input.txt, but allow override:
  // node day02/index.js path/to/file.txt
  const defaultInputPath = path.join(__dirname, "input.txt");
  const inputPath = process.argv[2] ? path.resolve(process.argv[2]) : defaultInputPath;

  const lines = readInputLines(inputPath);
  const { part1, part2 } = solve(lines);

  console.log("Day 02");
  console.log("Part 1:", part1);
  console.log("Part 2:", part2);
}

main();
