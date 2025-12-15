"use strict";

/**
 * Advent of Code 2020 - Day 04 (Passport Processing)
 *
 * Node docs:
 * - process.argv: https://nodejs.org/api/process.html#processargv
 * - path.join: https://nodejs.org/api/path.html#pathjoinpaths
 * - path.resolve: https://nodejs.org/api/path.html#pathresolvepaths
 *
 * MDN docs:
 * - String.prototype.split: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String/split
 * - Array.prototype.every: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/every
 * - RegExp: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/RegExp
 */

const path = require("path");
const { readInputRaw } = require("../utils/readInput");

// Required fields (cid is intentionally not required)
const REQUIRED_FIELDS = ["byr", "iyr", "eyr", "hgt", "hcl", "ecl", "pid"];

/**
 * Convert the raw input into an array of passport objects.
 * Each passport becomes: { byr: '1980', iyr: '2012', ... }
 */
function parsePassports(rawText) {
  // Passports are separated by blank lines
  const passportBlocks = rawText.split("\n\n");

  return passportBlocks.map((block) => {
    // Fields inside a passport can be separated by spaces OR newlines
    const tokens = block.split(/\s+/);

    const passport = {};
    for (const token of tokens) {
      const [key, value] = token.split(":");
      passport[key] = value;
    }
    return passport;
  });
}

function hasAllRequiredFields(passport) {
  // Use a safe hasOwnProperty call (avoids edge cases with overridden keys)
  return REQUIRED_FIELDS.every((field) =>
    Object.prototype.hasOwnProperty.call(passport, field)
  );
}

// ---- Field validators for Part 2 ----

function isValidYear(value, min, max) {
  // Year must be exactly 4 digits and within range.
  if (!/^\d{4}$/.test(value)) return false;
  const year = Number(value);
  return year >= min && year <= max;
}

function isValidHeight(value) {
  // Height must be a number followed by "cm" or "in"
  const match = value.match(/^(\d+)(cm|in)$/);
  if (!match) return false;

  const amount = Number(match[1]);
  const unit = match[2];

  if (unit === "cm") return amount >= 150 && amount <= 193;
  return amount >= 59 && amount <= 76; // in
}

function isValidHairColor(value) {
  // hcl: '#' followed by exactly 6 hex digits
  return /^#[0-9a-f]{6}$/.test(value);
}

function isValidEyeColor(value) {
  // ecl must be one of these
  return ["amb", "blu", "brn", "gry", "grn", "hzl", "oth"].includes(value);
}

function isValidPassportId(value) {
  // pid: exactly 9 digits
  return /^\d{9}$/.test(value);
}

function isStrictlyValid(passport) {
  // Must have required fields AND each must pass its rule
  if (!hasAllRequiredFields(passport)) return false;

  return (
    isValidYear(passport.byr, 1920, 2002) &&
    isValidYear(passport.iyr, 2010, 2020) &&
    isValidYear(passport.eyr, 2020, 2030) &&
    isValidHeight(passport.hgt) &&
    isValidHairColor(passport.hcl) &&
    isValidEyeColor(passport.ecl) &&
    isValidPassportId(passport.pid)
  );
}

function solve(rawText) {
  const passports = parsePassports(rawText);

  const part1 = passports.filter(hasAllRequiredFields).length;
  const part2 = passports.filter(isStrictlyValid).length;

  return { part1, part2 };
}

function main() {
  const defaultInputPath = path.join(__dirname, "input.txt");
  const inputPath = process.argv[2] ? path.resolve(process.argv[2]) : defaultInputPath;

  const raw = readInputRaw(inputPath);
  const { part1, part2 } = solve(raw);

  console.log("Day 04");
  console.log("Part 1:", part1);
  console.log("Part 2:", part2);
}

main();
