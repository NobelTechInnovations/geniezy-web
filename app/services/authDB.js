import { openDB } from './indexedDB';

const DB_NAME = 'authDB';
const STORE_NAME = 'auth';

export const saveAuthToDB = async (token, user) => {
  const db = await openDB();
  const tx = db.transaction('auth', 'readwrite');
  const store = tx.objectStore('auth');
  store.put({ key: 'token', value: token });
  store.put({ key: 'user', value: user });
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
        resolve({
          token: tokenReq.result?.value,
          user: userReq.result?.value,
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