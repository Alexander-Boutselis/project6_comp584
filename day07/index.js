"use strict";

/**
 * Advent of Code 2020 - Day 07 (Handy Haversacks)
 *
 * Node docs:
 * - process.argv: https://nodejs.org/api/process.html#processargv
 * - path.join: https://nodejs.org/api/path.html#pathjoinpaths
 * - path.resolve: https://nodejs.org/api/path.html#pathresolvepaths
 *
 * MDN docs:
 * - Map: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map
 * - Set: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Set
 * - String.prototype.match: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String/match
 * - Array.prototype.split: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/split
 */

const path = require("path");
const { readInputLines } = require("../utils/readInput");

/**
 * Parse one rule line into:
 * - outerColor (string)
 * - contents: array of { count: number, innerColor: string }
 */
function parseRule(line) {
  // Example:
  // "light red bags contain 1 bright white bag, 2 muted yellow bags."
  const match = line.match(/^(.+?) bags contain (.+)\.$/);
  if (!match) throw new Error(`Bad rule line: ${line}`);

  const outerColor = match[1];
  const contentsText = match[2];

  if (contentsText === "no other bags") {
    return { outerColor, contents: [] };
  }

  const parts = contentsText.split(", ");
  const contents = parts.map((part) => {
    // "2 muted yellow bags"
    const innerMatch = part.match(/^(\d+)\s+(.+?) bag/);
    if (!innerMatch) throw new Error(`Bad contents token: ${part}`);
    return { count: Number(innerMatch[1]), innerColor: innerMatch[2] };
  });

  return { outerColor, contents };
}

/**
 * Build two graphs:
 * 1) containsGraph: outer -> [{count, innerColor}, ...]
 * 2) containedByGraph: inner -> Set of outers that can contain it directly
 *
 * containedByGraph makes Part 1 easy (walk “up” the containment chain).
 */
function buildGraphs(lines) {
  const containsGraph = new Map();
  const containedByGraph = new Map();

  for (const line of lines) {
    const { outerColor, contents } = parseRule(line);
    containsGraph.set(outerColor, contents);

    for (const { innerColor } of contents) {
      if (!containedByGraph.has(innerColor)) {
        containedByGraph.set(innerColor, new Set());
      }
      containedByGraph.get(innerColor).add(outerColor);
    }
  }

  return { containsGraph, containedByGraph };
}

/**
 * Part 1:
 * Starting from the target color, walk reverse edges to find all colors that
 * can eventually contain it (directly or indirectly).
 */
function countColorsThatCanEventuallyContain(targetColor, containedByGraph) {
  const visited = new Set();
  const stack = [targetColor];

  while (stack.length > 0) {
    const current = stack.pop();
    const directParents = containedByGraph.get(current);
    if (!directParents) continue;

    for (const parentColor of directParents) {
      if (!visited.has(parentColor)) {
        visited.add(parentColor);
        stack.push(parentColor);
      }
    }
  }

  return visited.size;
}

/**
 * Part 2:
 * Count total bags inside a given color.
 * If a bag contains N of some color X, then it contributes:
 *   N * (1 + bagsInside(X))
 *
 * Use memoization so repeated subproblems are fast.
 */
function countTotalBagsInside(color, containsGraph, memo) {
  if (memo.has(color)) return memo.get(color);

  const contents = containsGraph.get(color) || [];
  let total = 0;

  for (const { count, innerColor } of contents) {
    total += count * (1 + countTotalBagsInside(innerColor, containsGraph, memo));
  }

  memo.set(color, total);
  return total;
}

function solve(lines) {
  const { containsGraph, containedByGraph } = buildGraphs(lines);

  const part1 = countColorsThatCanEventuallyContain("shiny gold", containedByGraph);
  const part2 = countTotalBagsInside("shiny gold", containsGraph, new Map());

  return { part1, part2 };
}

function main() {
  const defaultInputPath = path.join(__dirname, "input.txt");
  const inputPath = process.argv[2] ? path.resolve(process.argv[2]) : defaultInputPath;

  const lines = readInputLines(inputPath);
  const { part1, part2 } = solve(lines);

  console.log("Day 07");
  console.log("Part 1:", part1);
  console.log("Part 2:", part2);
}

main();
