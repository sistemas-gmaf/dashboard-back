import * as crypto from 'crypto';
import { SECRET } from '../configs/app.js';

export const encrypt = (text) => {
  const iv = crypto.randomBytes(16); // Initialization vector
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(SECRET), iv);
  let encrypted = cipher.update(text, 'utf-8', 'hex');
  encrypted += cipher.final('hex');
  return `${iv.toString('hex')}:${encrypted}`
}

export const decrypt = (encryptedText) => {
  const [iv, encryptedData] = encryptedText.split(':');
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(SECRET), Buffer.from(iv, 'hex'));
  let decrypted = decipher.update(encryptedData, 'hex', 'utf-8');
  decrypted += decipher.final('utf-8');
  return decrypted;

}