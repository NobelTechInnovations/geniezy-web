const DB_NAME = 'geniezyDB';
const DB_VERSION = 1; // Increment if you add new object stores

export function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      // Create all needed object stores here
      if (!db.objectStoreNames.contains('auth')) {
        db.createObjectStore('auth', { keyPath: 'key' });
      }
      if (!db.objectStoreNames.contains('gspin')) {
        db.createObjectStore('gspin', { keyPath: 'id', autoIncrement: true });
      }
      // Add more stores as needed
    };
    request.onsuccess = (event) => resolve(event.target.result);
    request.onerror = (e) => reject(e);
  });
} 