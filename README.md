# zkl-crypto

Cryptographic functions provider and example repository.

This module provides encryption and decryption functions for handling both binary data and strings using public and private keys. It utilizes `ecies-wasm` for the underlying cryptographic operations.

## Functions

### `encryptString(publicKey: Key, string: string): string`

Encrypts the given string with the recipient's public key. Returns the ciphertext as a hexadecimal string.

### `decryptString(privateKey: Key, string: string): string`

Decrypts the given ciphertext string (in hexadecimal format) with the recipient's private key. Returns the plaintext string.

### `encryptFile(publicKey: Key, data: Uint8Array): Uint8Array`

Encrypts the given binary data (`Uint8Array`) with the recipient's public key. Returns the ciphertext as a `Uint8Array`.

### `decryptFile(privateKey: Key, data: Uint8Array): Uint8Array`

Decrypts the given ciphertext data (`Uint8Array`) with the recipient's private key. Returns the plaintext data as a `Uint8Array`.

## Usage

```javascript
import { Key } from "./zkl-kds/key";
import { encryptString, decryptString, encryptFile, decryptFile } from "./crypto";

// Example usage:

const publicKey = new Key(/* ... */);
const privateKey = new Key(/* ... */);

// Encrypt a string
const plaintext = "Hello, World!";
const encryptedString = encryptString(publicKey, plaintext);

// Decrypt the string
const decryptedString = decryptString(privateKey, encryptedString);

console.log(decryptedString); // "Hello, World!"

// Encrypt binary data
const data = new Uint8Array([/* ... */]);
const encryptedData = encryptFile(publicKey, data);

// Decrypt the binary data
const decryptedData = decryptFile(privateKey, encryptedData);

console.log(decryptedData); // Uint8Array
```

## Example

To launch the example webpage:

```bash
pnpm install
npx webpack # use npx, pnpm - webpack integration is broken
```

then navigate to index.html.

## Error Handling

This module performs type checks on its inputs. It throws `TypeError` if arguments are not of the expected types. Additionally, the `decryptString` function issues a warning if the provided ciphertext string does not appear to be a valid hexadecimal string.

## Notes

- The `asHexString` method is added to `Uint8Array.prototype` if it does not already exist. This method converts a `Uint8Array` to a hexadecimal string representation.
- Ensure that your public and private keys are instances of the `Key` class provided by `zkl-kds/key`.

## License

This project is licensed under the GNU Lesser General Public License, version 2.1.

Yigid BALABAN, <fyb@fybx.dev>
