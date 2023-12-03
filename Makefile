default: build

build:
	wasm-pack build --target nodejs --out-dir ./pkg/nodejs

lint:
	cargo clippy

check_wasm32:
	cargo check --target wasm32-unknown-unknown

test:
	cargo test

check: lint check_wasm32 test

