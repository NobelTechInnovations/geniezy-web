import CryptoJS from 'crypto-js';

// !!! WARNING: This is for demonstration only. Storing the key in client-side code is INSECURE.
// A real-world solution requires a robust key management strategy.
const SECRET_KEY = 'geniezy-secret-key24'; // Replace with a different, but still insecure, key if you must

export const encryptUser = (user) => {
  if (!user) return null;
  try {
    const jsonString = JSON.stringify(user);
    const ciphertext = CryptoJS.AES.encrypt(jsonString, SECRET_KEY).toString();
    return ciphertext;
  } catch (e) {
    console.error('Encryption failed:', e);
    return null;
  }
};

export const decryptUser = (ciphertext) => {
  if (!ciphertext) return null;
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
    const decryptedJsonString = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedJsonString);
  } catch (e) {
    console.error('Decryption failed:', e);
    return null;
  }
}; 