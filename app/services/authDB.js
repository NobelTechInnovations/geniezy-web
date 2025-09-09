import { openDB } from './indexedDB';
import { encryptUser, decryptUser } from './cryptoUtils';

const DB_NAME = 'authDB';
const STORE_NAME = 'auth';

export const saveAuthToDB = async (token, user) => {
  const db = await openDB();
  const tx = db.transaction('auth', 'readwrite');
  const store = tx.objectStore('auth');
  const encryptedUser = encryptUser(user);
  if (encryptedUser) {
    store.put({ key: 'token', value: token });
    store.put({ key: 'user', value: encryptedUser });
  } else {
    // Handle encryption failure, maybe clear auth or show error
    console.error('Failed to encrypt user data for saving.');
    // Optionally clear existing data or throw error
  }
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = (e) => reject(e);
  });
};

export const getAuthFromDB = async () => {
  const db = await openDB();
  const tx = db.transaction('auth', 'readonly');
  const store = tx.objectStore('auth');
  const tokenReq = store.get('token');
  const userReq = store.get('user');
  return new Promise((resolve, reject) => {
    tokenReq.onsuccess = () => {
      userReq.onsuccess = () => {
        const encryptedUser = userReq.result?.value;
        const decryptedUser = decryptUser(encryptedUser);
        resolve({
          token: tokenReq.result?.value,
          user: decryptedUser,
        });
      };
    };
    tx.onerror = (e) => reject(e);
  });
};

export const clearAuthDB = async () => {
  const db = await openDB();
  const tx = db.transaction('auth', 'readwrite');
  const store = tx.objectStore('auth');
  store.clear();
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = (e) => reject(e);
  });
};
