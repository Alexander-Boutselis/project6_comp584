"use strict";

/**
 * Advent of Code 2020 - Day 11 (Seating System)
 *
 * Node docs:
 * - process.argv: https://nodejs.org/api/process.html#processargv
 * - path.join: https://nodejs.org/api/path.html#pathjoinpaths
 * - path.resolve: https://nodejs.org/api/path.html#pathresolvepaths
 *
 * MDN docs:
 * - Array.from: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/from
 * - Array.prototype.slice: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/slice
 * - String.prototype.split: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String/split
 * - Map: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map
 */

const path = require("path");
const { readInputLines } = require("../utils/readInput");

const DIRECTIONS = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1],
];

function parseGrid(lines) {
  return lines.map((line) => line.split(""));
}

/**
 * Optimization idea:
 * Instead of simulating on every cell (including floor),
 * we index only the seats (L/#) and precompute neighbor lists.
 */
function buildSeatIndex(grid) {
  const seatPositions = [];          // seatIndex -> [row, col]
  const seatIndexByCoord = new Map(); // "row,col" -> seatIndex

  for (let row = 0; row < grid.length; row += 1) {
    for (let col = 0; col < grid[row].length; col += 1) {
      if (grid[row][col] !== ".") {
        const key = `${row},${col}`;
        const index = seatPositions.length;
        seatPositions.push([row, col]);
        seatIndexByCoord.set(key, index);
      }
    }
  }

  return { seatPositions, seatIndexByCoord };
}

/**
 * Part 1 neighbor rule:
 * For each seat, neighbors are the immediately adjacent seats.
 */
function precomputeAdjacentNeighbors(grid, seatPositions, seatIndexByCoord) {
  const neighbors = Array.from({ length: seatPositions.length }, () => []);

  for (let i = 0; i < seatPositions.length; i += 1) {
    const [row, col] = seatPositions[i];

    for (const [dRow, dCol] of DIRECTIONS) {
      const r = row + dRow;
      const c = col + dCol;

      if (r < 0 || r >= grid.length) continue;
      if (c < 0 || c >= grid[0].length) continue;

      const key = `${r},${c}`;
      if (seatIndexByCoord.has(key)) {
        neighbors[i].push(seatIndexByCoord.get(key));
      }
    }
  }

  return neighbors;
}

/**
 * Part 2 neighbor rule:
 * For each direction, look outward until we hit the first seat (not floor).
 */
function precomputeVisibleNeighbors(grid, seatPositions, seatIndexByCoord) {
  const neighbors = Array.from({ length: seatPositions.length }, () => []);

  for (let i = 0; i < seatPositions.length; i += 1) {
    const [row, col] = seatPositions[i];

    for (const [dRow, dCol] of DIRECTIONS) {
      let r = row + dRow;
      let c = col + dCol;

      while (r >= 0 && r < grid.length && c >= 0 && c < grid[0].length) {
        if (grid[r][c] !== ".") {
          neighbors[i].push(seatIndexByCoord.get(`${r},${c}`));
          break;
        }
        r += dRow;
        c += dCol;
      }
    }
  }

  return neighbors;
}

/**
 * Apply update rules until stable.
 * leaveThreshold is 4 for Part 1, 5 for Part 2.
 */
function simulateUntilStable(initialSeatStates, neighborList, leaveThreshold) {
  let currentStates = initialSeatStates.slice();

  while (true) {
    const nextStates = currentStates.slice();
    let didChange = false;

    for (let i = 0; i < currentStates.length; i += 1) {
      const seatState = currentStates[i];

      let occupiedNeighborCount = 0;
      for (const neighborIndex of neighborList[i]) {
        if (currentStates[neighborIndex] === "#") occupiedNeighborCount += 1;
      }

      // Rules:
      // - Empty seat becomes occupied if no occupied neighbors
      // - Occupied seat becomes empty if occupied neighbors >= threshold
      if (seatState === "L" && occupiedNeighborCount === 0) {
        nextStates[i] = "#";
        didChange = true;
      } else if (seatState === "#" && occupiedNeighborCount >= leaveThreshold) {
        nextStates[i] = "L";
        didChange = true;
      }
    }

    if (!didChange) return nextStates;
    currentStates = nextStates;
  }
}

function solve(lines) {
  const grid = parseGrid(lines);

  const { seatPositions, seatIndexByCoord } = buildSeatIndex(grid);

  // Initial seat state array contains only seats (no floors)
  const initialSeatStates = seatPositions.map(([row, col]) => grid[row][col]);

  // Part 1
  const adjacentNeighbors = precomputeAdjacentNeighbors(grid, seatPositions, seatIndexByCoord);
  const stablePart1 = simulateUntilStable(initialSeatStates, adjacentNeighbors, 4);
  const part1 = stablePart1.filter((ch) => ch === "#").length;

  // Part 2
  const visibleNeighbors = precomputeVisibleNeighbors(grid, seatPositions, seatIndexByCoord);
  const stablePart2 = simulateUntilStable(initialSeatStates, visibleNeighbors, 5);
  const part2 = stablePart2.filter((ch) => ch === "#").length;

  return { part1, part2 };
}

function main() {
  const defaultInputPath = path.join(__dirname, "input.txt");
  const inputPath = process.argv[2] ? path.resolve(process.argv[2]) : defaultInputPath;

  const lines = readInputLines(inputPath);
  const { part1, part2 } = solve(lines);

  console.log("Day 11");
  console.log("Part 1:", part1);
  console.log("Part 2:", part2);
}

main();
