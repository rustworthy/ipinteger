const { test } = require("node:test");
const assert = require("node:assert");

const { ipV4ToInt, intToIpV4 } = require("../pkg/nodejs/ipinteger");

// for performance comparison
const ipV4ToIntJS = (ip) => {
  let result = 0;
  for (const octet of ip.split(".")) {
    const octet_int = parseInt(octet, 10);
    if (isNaN(octet_int)) return undefined;
    result = result * 256 + octet_int;
  }
  return result;
};

test("ipV4ToInt + ipV4ToIntJS", () => {
  const cases = [
    ["0.0.0.0", 0],
    ["0.0.0.1", 1],
    ["0.0.1.0", 0x0000100],
    ["0.1.0.0", 0x0010000],
    ["1.0.0.0", 0x1000000],
    ["8.8.8.8", 0x08080808],
    ["10.0.0.1", 0x0a000001],
    ["127.0.0.1", 0x7f000001],
    ["192.168.1.10", 0xc0a8010a],
    ["165.225.133.150", 0xa5e18596],
    ["0.0.0.255", 0x000000ff],
    ["0.0.255.0", 0x0000ff00],
    ["0.255.0.0", 0x00ff0000],
    ["255.0.0.0", 0xff000000],
    ["255.255.255.255", 0xffffffff],
    ["wrong-string", undefined],
    ["", undefined],
  ];
  for (const [ip, expected] of cases) {
    const res = ipV4ToInt(ip);
    assert.equal(res, expected, `assert ${res}===${expected} for ${ip}`);
    const resJS = ipV4ToIntJS(ip);
    assert.equal(resJS, expected, `assert ${resJS}===${expected} for ${ip}`);
  }
});

// for performance comparison
const intToIpV4JS = (int) => {
  const octets = [];
  for (let i = 0; i < 4; i++) {
    const octet = (int >> (i * 8)) & 0xff;
    octets.push(octet);
  }
  return octets.reverse().join(".");
};

test("intToIpV4 + intToIpV4JS", () => {
  const cases = [
    [0, "0.0.0.0"],
    [1, "0.0.0.1"],
    [0x00000100, "0.0.1.0"],
    [0x00010000, "0.1.0.0"],
    [0x01000000, "1.0.0.0"],
    [0x08080808, "8.8.8.8"],
    [0x0a000001, "10.0.0.1"],
    [0x7f000001, "127.0.0.1"],
    [0xc0a8010a, "192.168.1.10"],
    [0xa5e18596, "165.225.133.150"],
    [0x000000ff, "0.0.0.255"],
    [0x0000ff00, "0.0.255.0"],
    [0x00ff0000, "0.255.0.0"],
    [0xff000000, "255.0.0.0"],
    [0xffffffff, "255.255.255.255"],
  ];
  for (const [int, expected] of cases) {
    const res = intToIpV4(int);
    assert.equal(res, expected);
    const resJS = intToIpV4JS(int);
    assert.equal(resJS, expected);
  }
});

module.exports = { ipV4ToIntJS, intToIpV4JS };
