#!/usr/bin/env sh
cd dist
for f in $(find . -name '*.r1cs'); do
	filename=$(basename "$f" .r1cs)
  echo $filename
	yarn run snarkjs g16s "${filename}".r1cs ../ptau/powersOfTau28_hez_final_21.ptau "${filename}"_0.zkey
  yarn run snarkjs zkey contribute "${filename}"_0.zkey "${filename}".zkey --name="elementals contributor"
  # Remove phase 1 key.
  rm "${filename}"_0.zkey

  mv "${filename}"_js/"${filename}".wasm .
  rm -rf "${filename}"_js/
done
