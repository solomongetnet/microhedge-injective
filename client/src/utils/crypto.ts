// encryption helpers
const SECRET_KEY = "MY_SUPER_SECRET_KEY"; // ⚠️ move to env var in production
import CryptoJS from 'crypto-js';

export const encryptData = (data: unknown) => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
};

export const decryptData = (ciphertext: string) => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
  const decrypted = bytes.toString(CryptoJS.enc.Utf8);
  return decrypted ? JSON.parse(decrypted) : null;
};
