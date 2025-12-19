"use strict";

/**
 * AoC 2020 - Day 06 (Custom Customs)
 *
 * Node docs:
 * - process.argv: https://nodejs.org/api/process.html#processargv
 * - path.join: https://nodejs.org/api/path.html#pathjoinpaths
 * - path.resolve: https://nodejs.org/api/path.html#pathresolvepaths
 *
 * MDN docs:
 * - Set: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Set
 * - String.prototype.split: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String/split
 * - Array.prototype.reduce: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce
 */

const path = require("path");
const { readInputBlocks } = require("../utils/readInput");

function countUnionYes(groupBlock) {
  // groupBlock has multiple lines, each a person's string of answers
  const people = groupBlock.split("\n").filter((line) => line.length > 0);

  const yesSet = new Set();
  for (const personAnswers of people) {
    for (const ch of personAnswers) yesSet.add(ch);
  }
  return yesSet.size;
}

function countIntersectionYes(groupBlock) {
  const people = groupBlock.split("\n").filter((line) => line.length > 0);
  if (people.length === 0) return 0;

  // Start with first person’s set, then intersect with each next person
  let common = new Set(people[0].split(""));

  for (let i = 1; i < people.length; i += 1) {
    const currentSet = new Set(people[i].split(""));
    common = new Set([...common].filter((ch) => currentSet.has(ch)));
  }

  return common.size;
}

function main() {
  const defaultInputPath = path.join(__dirname, "input.txt");
  const inputPath = process.argv[2] ? path.resolve(process.argv[2]) : defaultInputPath;

  const groupBlocks = readInputBlocks(inputPath);

  const part1 = groupBlocks.reduce((sum, block) => sum + countUnionYes(block), 0);
  const part2 = groupBlocks.reduce((sum, block) => sum + countIntersectionYes(block), 0);

  console.log("Day 06");
  console.log("Part 1:", part1);
  console.log("Part 2:", part2);
}

main();
