import init, * as ecies from "ecies-wasm";
import { Key } from "./zkl-kds/key";

init();

/**
 * Encrypts given data for the recipient
 *
 * @param {Key} publicKey The public key of the recipient
 * @param {Uint8Array} data The plaintext data
 * @returns {Uint8Array} The ciphertext data
 * @throws {TypeError} If arguments are of incorrect types
 */
export function encryptFile(publicKey, data) {
  if (!(publicKey instanceof Key)) {
    throw new TypeError("publicKey must be an instance of Key");
  }
  if (!(data instanceof Uint8Array)) {
    throw new TypeError("data must be an instance of Uint8Array");
  }
  return encrypt(publicKey, data);
}

/**
 * Decrypts given data with recipient's private key
 *
 * @param {Key} privateKey The private key of the recipient
 * @param {Uint8Array} data The ciphertext data
 * @returns {Uint8Array} The plaintext data
 * @throws {TypeError} If arguments are of incorrect types
 */
export function decryptFile(privateKey, data) {
  if (!(privateKey instanceof Key)) {
    throw new TypeError("privateKey must be an instance of Key");
  }
  if (!(data instanceof Uint8Array)) {
    throw new TypeError("data must be an instance of Uint8Array");
  }
  return decrypt(privateKey, data);
}

/**
 * Encrypts given string for the recipient
 *
 * @param {Key} publicKey The public key of the recipient
 * @param {string} string The plaintext
 * @returns {string} The ciphertext as hexadecimal string
 * @throws {TypeError} If arguments are of incorrect types
 */
export function encryptString(publicKey, string) {
  if (!(publicKey instanceof Key)) {
    throw new TypeError("publicKey must be an instance of Key");
  }
  if (typeof string !== "string") {
    throw new TypeError("string must be of type string");
  }

  const encoder = new TextEncoder();
  const byteArray = encoder.encode(string);
  const encryptedData = encrypt(publicKey, byteArray);
  return encryptedData.asHexString();
}

/**
 * Decrypts given string of ciphertext in hexadecimal
 *
 * @param {Key} privateKey The private key of the recipient
 * @param {string} string The ciphertext string in hexadecimal
 * @returns {string} The plaintext
 * @throws {TypeError} If arguments are of incorrect types
 */
export function decryptString(privateKey, string) {
  if (!(privateKey instanceof Key)) {
    throw new TypeError("privateKey must be an instance of Key");
  }
  if (typeof string !== "string") {
    throw new TypeError("string must be of type string");
  }
  if (!/^[0-9a-fA-F]+$/.test(string)) {
    console.warn("string does not seem to be a valid hexadecimal string");
  }

  const byteArray = Uint8Array.from(
    string.match(/.{1,2}/g).map((byte) => parseInt(byte, 16))
  );
  const decryptedData = decrypt(privateKey, byteArray);
  const decoder = new TextDecoder();
  return decoder.decode(decryptedData);
}

function encrypt(publicKey, plaintext) {
  if (!(publicKey instanceof Key)) {
    throw new TypeError("publicKey must be an instance of Key");
  }
  if (!(plaintext instanceof Uint8Array)) {
    throw new TypeError("plaintext must be an instance of Uint8Array");
  }
  return ecies.encrypt(publicKey.asByteArray, plaintext);
}

function decrypt(privateKey, ciphertext) {
  if (!(privateKey instanceof Key)) {
    throw new TypeError("privateKey must be an instance of Key");
  }
  if (!(ciphertext instanceof Uint8Array)) {
    throw new TypeError("ciphertext must be an instance of Uint8Array");
  }
  return ecies.decrypt(privateKey.asByteArray, ciphertext);
}

function asHexString() {
  return this.reduce(
    (str, byte) => str + byte.toString(16).padStart(2, "0"),
    ""
  );
}

if (!Uint8Array.prototype.asHexString) {
  Uint8Array.prototype.asHexString = asHexString;
} else {
  console.warn("asHexString method already exists on Uint8Array.prototype");
}
