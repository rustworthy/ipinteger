/**
 * function calls count:    1e6           1e3           1
 *
 * (string -> int)
 * ipV4ToInt (js):          129.5ms      0.144ms       0.001ms
 * ipV4ToInt (wasm):        469.0ms      0.424ms       0.003ms
 *
 * (int -> string)
 * intToIpV4 (js):          178.4ms      0.175ms       0.002ms
 * intToIpV4 (wasm):        975.2ms      0.897ms       0.003ms
 *
 */

const { hrtime } = require("node:process");
const { ipV4ToInt, intToIpV4 } = require("../pkg/nodejs/ipinteger");
const { ipV4ToIntJS, intToIpV4JS } = require("./unit.test");

const TESTRUNS_COUNT = 1e3;
const FUNCTION_CALLS_COUNT = 1e3;
const NANOS_TO_MILLIS_COEF = 1 / 1e6;

const timeIt = (testName, fn, args, loopsCount = TESTRUNS_COUNT) => {
  console.log(`Running test: ${testName}`);
  let totalMillis = 0;
  for (let i = 0; i < loopsCount; i++) {
    const start = hrtime.bigint();
    for (let j = 0; j < FUNCTION_CALLS_COUNT; j++) fn(...args);
    const end = hrtime.bigint();
    totalMillis += Number(end - start) * NANOS_TO_MILLIS_COEF;
  }
  const result = totalMillis / loopsCount;
  console.log(`${FUNCTION_CALLS_COUNT} calls took \t\t ${result} millis`);
  console.log(`Finished test: ${testName}`);
  console.log("==========================");
  return result;
};

const run = () => {
  timeIt("ipV4ToInt", ipV4ToInt, ["127.0.0.1"]);
  timeIt("ipV4ToIntJS", ipV4ToIntJS, ["127.0.0.1"]);
  timeIt("intToIpV4", intToIpV4, [0x7f000001]);
  timeIt("intToIpV4JS", intToIpV4JS, [0x7f000001]);
};

run();
