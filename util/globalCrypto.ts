import { createHash } from 'crypto';

export class GlobalCrypto {
  // hashes a string with teh sha512 algorithm and Node's Crypto API
  static hashString(input: string) {
    const salt: string = '$#LB1';
    const hash = createHash('sha512');
    if (input) {
      hash.update(input + salt);
      return hash.digest('hex');
    } else {
      throw new Error('Null or undefined input.');
    }
  }
}
