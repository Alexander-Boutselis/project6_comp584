"use strict";

/**
 * Advent of Code 2020 - Day 12 (Rain Risk)
 *
 * Node docs:
 * - process.argv: https://nodejs.org/api/process.html#processargv
 * - path.join: https://nodejs.org/api/path.html#pathjoinpaths
 * - path.resolve: https://nodejs.org/api/path.html#pathresolvepaths
 *
 * MDN docs:
 * - String.prototype.slice: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String/slice
 * - Number: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number
 * - Math.abs: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Math/abs
 */

const path = require("path");
const { readInputLines } = require("../utils/readInput");

function parseInstruction(line) {
  // Example: "F10" -> { action: "F", value: 10 }
  return { action: line[0], value: Number(line.slice(1)) };
}

function manhattanDistance(x, y) {
  return Math.abs(x) + Math.abs(y);
}

// Rotate a point (x, y) 90 degrees around origin
function rotateRight90(x, y) {
  // (x, y) -> (y, -x)
  return [y, -x];
}

function rotateLeft90(x, y) {
  // (x, y) -> (-y, x)
  return [-y, x];
}

function rotateWaypoint(wx, wy, direction, degrees) {
  const turns = (degrees / 90) % 4;
  let x = wx;
  let y = wy;

  for (let i = 0; i < turns; i += 1) {
    if (direction === "R") [x, y] = rotateRight90(x, y);
    else [x, y] = rotateLeft90(x, y);
  }

  return [x, y];
}

function solvePart1(instructions) {
  // We'll represent the ship direction using an index in [E, S, W, N]
  // so rotating is just adding/subtracting steps of 90 degrees.
  const headings = ["E", "S", "W", "N"];
  let headingIndex = 0; // start facing East

  let shipX = 0; // east-west axis (east is +)
  let shipY = 0; // north-south axis (north is +)

  for (const { action, value } of instructions) {
    if (action === "N") shipY += value;
    else if (action === "S") shipY -= value;
    else if (action === "E") shipX += value;
    else if (action === "W") shipX -= value;
    else if (action === "L") headingIndex = (headingIndex - value / 90 + 4) % 4;
    else if (action === "R") headingIndex = (headingIndex + value / 90) % 4;
    else if (action === "F") {
      const heading = headings[headingIndex];
      if (heading === "N") shipY += value;
      else if (heading === "S") shipY -= value;
      else if (heading === "E") shipX += value;
      else shipX -= value; // "W"
    } else {
      throw new Error(`Unknown action: ${action}`);
    }
  }

  return manhattanDistance(shipX, shipY);
}

function solvePart2(instructions) {
  let shipX = 0;
  let shipY = 0;

  // Waypoint starts 10 east and 1 north of the ship
  let waypointX = 10;
  let waypointY = 1;

  for (const { action, value } of instructions) {
    if (action === "N") waypointY += value;
    else if (action === "S") waypointY -= value;
    else if (action === "E") waypointX += value;
    else if (action === "W") waypointX -= value;
    else if (action === "L" || action === "R") {
      [waypointX, waypointY] = rotateWaypoint(waypointX, waypointY, action, value);
    } else if (action === "F") {
      // Move ship toward waypoint value times
      shipX += waypointX * value;
      shipY += waypointY * value;
    } else {
      throw new Error(`Unknown action: ${action}`);
    }
  }

  return manhattanDistance(shipX, shipY);
}

function main() {
  const defaultInputPath = path.join(__dirname, "input.txt");
  const inputPath = process.argv[2] ? path.resolve(process.argv[2]) : defaultInputPath;

  const lines = readInputLines(inputPath);
  const instructions = lines.map(parseInstruction);

  console.log("Day 12");
  console.log("Part 1:", solvePart1(instructions));
  console.log("Part 2:", solvePart2(instructions));
}

main();
