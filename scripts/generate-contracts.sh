#!/usr/bin/env sh

mkdir -p ./contracts/src/verifiers

for f in $(find ./circuits/dist -name *.zkey); do
  filename=$(basename $f .zkey)
  filenamePascal=""
  for split in $(echo ${filename} | sed -r 's/_/ /g'); do
    filenamePascal="${filenamePascal}$(tr '[:lower:]' '[:upper:]' <<< ${split:0:1})${split:1}"
  done

  tempfile=$(mktemp -t generated-verifier)


  yarn run snarkjs zkey export solidityverifier ${f} "${tempfile}"

  # Change the solidity version.
  # Remove the Pairing code.
  # Import the Pairing.sol file.
  sed -e 's/0.6.11/0.8.0/' -e 's/contract/library/' -e "s/Verifier/${filenamePascal}Verifier/" -e $'16 i\\\nimport {Pairing} from \"./Pairing.sol\";\\\n' -e '15,163d' \
    "${tempfile}" > "./contracts/src/verifiers/${filenamePascal}Verifier.sol"

  rm "${tempfile}"
done
