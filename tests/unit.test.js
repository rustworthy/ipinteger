const { test } = require("node:test");
const assert = require("node:assert");

const { ipV4ToInt, intToIpV4 } = require("../pkg/nodejs/ipinteger");

test("ipV4ToInt", () => {
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
    const got = ipV4ToInt(ip);
    assert.equal(got, expected);
  }
});

test("intToIpV4", () => {
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
    const got = intToIpV4(int);
    assert.equal(got, expected);
  }
});
