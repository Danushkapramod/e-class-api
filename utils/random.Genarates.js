import crypto from "crypto"

export function generateUniqueString(length) {
    return crypto.randomBytes(Math.ceil(length / 2))
        .toString('hex') // Convert to hexadecimal format
        .slice(0, length); // Return required number of characters
}


export function generate10DigitID() {
    const min = 1000000000; // Smallest 10-digit number
    const max = 9999999999; // Largest 10-digit number
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }