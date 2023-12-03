## Ipinteger

Rust and [Wasm-pack](https://github.com/rustwasm/wasm-pack) powered IP address parser. See exposed functions description [here](pkg/nodejs/ipinteger.d.ts)

## Usage (Nodejs land)

```js
const { ipV4ToInt, intToIpV4 } = require("ipinteger"); // './pkg/nodejs/ipinteger'
const ipInt = ipV4ToInt("8.8.8.8");
const ipStr = intToIpV4(0x08080808);
```

## Test & Build (Rust land)

```bash
make check
make build
```

## Project Layout

The layout of this crate is generated with `wasm-pack new <NAME>`
