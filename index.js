import { generateKeypair } from "./zkl-kds/key-derivation.js";
import {
  encryptFile,
  decryptFile,
  encryptString,
  decryptString,
} from "./crypto.js";

let keypair;
const el_fileInput = document.querySelector("#fileInput");

el_fileInput
  .addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = function (e) {
        const arrayBuffer = e.target.result;
        const byteArray = new Uint8Array(arrayBuffer);
        if (!keypair) {
          console.error("keypair not ready, skipping file enc/dec");
          return;
        }

        console.log('File to be encrypted:', el_fileInput.files[0].name);
        const cipherFile = encryptFile(keypair.pkey, el_fileInput.files[0].name, byteArray);
        console.log('Ciphertext bytes:', cipherFile);

        {
          const numPixels = cipherFile.length / 4;
          const width = Math.floor(Math.sqrt(numPixels));
          const height = Math.ceil(numPixels / width);

          const canvas = document.getElementById("bitmapCanvas");
          const context = canvas.getContext("2d");

          canvas.width = width;
          canvas.height = height;

          const imageData = context.createImageData(width, height);

          for (let i = 0; i < cipherFile.length; i++) {
            imageData.data[i] = cipherFile[i];
          }

          context.putImageData(imageData, 0, 0);
        }

        const plainFile = decryptFile(keypair.skey, cipherFile);
        console.log("Decrypted raw data:", plainFile.data);
        console.log("Decrypted decoded:", (new TextDecoder()).decode(plainFile.data));
        console.log("Decrypted file name:", plainFile.fileName);
      };

      reader.readAsArrayBuffer(file);
    } else {
      console.warn("No file selected");
    }
  });

// we wait for a second before executing this block
// because WASM module takes time to load
setTimeout(async () => {
  console.log("start");
  const mnemonic =
    "digital radio analyst fine casino have mass blood potato hat web capital prefer debate fee differ spray cloud";

  // for this time, skey means private key, and pkey is public
  const { publicKey: pkey, privateKey: skey } = await generateKeypair(mnemonic);
  keypair = { pkey, skey };

  const cipherText = encryptString(pkey, "message");
  console.log("encrypted string is", cipherText);
  console.log("decrypted string is", decryptString(skey, cipherText));
  console.log("end");
}, 1000);
