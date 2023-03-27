#!/usr/bin/env sh
#
mkdir -p dist && find ./src -name '*.circom' -maxdepth 1 -exec circom '{}' --wasm --r1cs --output dist \;
