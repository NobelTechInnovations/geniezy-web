import { encryptData, decryptData } from './cryptoUtils';

const DB_NAME = 'geniezyDB';
const DB_VERSION = 2; // Increment version to trigger upgrade

// Helper function to parse price which might be an object with $numberDecimal
const parsePrice = (price) => {
  if (typeof price === 'object' && price !== null && price.$numberDecimal !== undefined) {
    return parseFloat(price.$numberDecimal);
  } else if (typeof price === 'string') {
     return parseFloat(price);
  }
  return price;
};

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
      if (!db.objectStoreNames.contains('cart')) {
        const cartStore = db.createObjectStore('cart', { keyPath: 'id', autoIncrement: true });
        cartStore.createIndex('gspin', 'gspin', { unique: false });
        cartStore.createIndex('pid', 'pid', { unique: false });
        cartStore.createIndex('p_sku', 'p_sku', { unique: false });
        cartStore.createIndex('unique_product', ['gspin', 'pid', 'p_sku'], { unique: true });
      }
    };
    request.onsuccess = (event) => resolve(event.target.result);
    request.onerror = (e) => reject(e);
  });
}

// Cart operations
export const addToCart = async (item) => {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['cart'], 'readwrite');
      const store = transaction.objectStore('cart');
      const index = store.index('unique_product');
      
      // Check if item already exists
      const getRequest = index.get([item.gspin, item.pid, item.p_sku]);
      
      getRequest.onsuccess = () => {
        const existingItem = getRequest.result;
        
        if (existingItem) {
          // Decrypt existing item
          const decryptedExistingItem = decryptData(existingItem.encryptedData);

          // Update quantity and timestamp
          decryptedExistingItem.quantity += item.quantity;
          decryptedExistingItem.timestamp = new Date().toISOString();

          // Encrypt updated item
          const encryptedUpdatedItem = encryptData(decryptedExistingItem);
          
          const updateRequest = store.put({ id: existingItem.id, encryptedData: encryptedUpdatedItem });
          updateRequest.onsuccess = () => resolve(decryptedExistingItem);
          updateRequest.onerror = (event) => {
            console.error('Error updating cart item:', event.target.error);
            reject(event.target.error);
          };
        } else {
          // Encrypt new item
          const encryptedNewItem = encryptData({
            ...item,
            timestamp: new Date().toISOString(),
          });
          
          const addRequest = store.add({ encryptedData: encryptedNewItem });
          
          addRequest.onsuccess = () => resolve(item); // Resolve with original item data
          addRequest.onerror = (event) => {
            console.error('Error adding to cart:', event.target.error);
            reject(event.target.error);
          };
        }
      };
      
      getRequest.onerror = (event) => {
        console.error('Error checking existing item:', event.target.error);
        reject(event.target.error);
      };
    });
  } catch (error) {
    console.error('Error in addToCart:', error);
    throw error;
  }
};

export const getCartItems = async () => {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['cart'], 'readonly');
      const store = transaction.objectStore('cart');
      const request = store.getAll();

      request.onsuccess = () => {
        const decryptedItems = request.result.map(item => {
          // Decrypt each item
          const decryptedData = decryptData(item.encryptedData);
          
          // Parse price after decryption
          if (decryptedData?.productData?.price !== undefined) {
              decryptedData.productData.price = parsePrice(decryptedData.productData.price);
          }
          if (decryptedData?.price !== undefined) {
               decryptedData.price = parsePrice(decryptedData.price);
          }

          return { id: item.id, ...decryptedData }; // Include the IndexedDB key
        });
        resolve(decryptedItems);
      };
      request.onerror = (event) => {
        console.error('Error getting cart items:', event.target.error);
        reject(event.target.error);
      };
    });
  } catch (error) {
    console.error('Error in getCartItems:', error);
    throw error;
  }
};

export const updateCartItemQuantity = async (id, quantity) => {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['cart'], 'readwrite');
      const store = transaction.objectStore('cart');
      
      const getRequest = store.get(id);
      
      getRequest.onsuccess = () => {
        const itemRecord = getRequest.result;
        if (itemRecord) {
          // Decrypt item
          const item = decryptData(itemRecord.encryptedData);

          item.quantity = quantity;
          item.timestamp = new Date().toISOString();
          
          // Encrypt updated item
          const updatedEncryptedData = encryptData(item);

          const updateRequest = store.put({ id: itemRecord.id, encryptedData: updatedEncryptedData });
          updateRequest.onsuccess = () => resolve(item); // Resolve with decrypted data
          updateRequest.onerror = (event) => {
            console.error('Error updating cart item quantity:', event.target.error);
            reject(event.target.error);
          };
        } else {
          reject(new Error('Item not found'));
        }
      };
      
      getRequest.onerror = (event) => {
        console.error('Error getting cart item:', event.target.error);
        reject(event.target.error);
      };
    });
  } catch (error) {
    console.error('Error in updateCartItemQuantity:', error);
    throw error;
  }
};

export const removeFromCart = async (id) => {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['cart'], 'readwrite');
      const store = transaction.objectStore('cart');
      // IndexedDB uses the keyPath (id) for deletion
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = (event) => {
        console.error('Error removing from cart:', event.target.error);
        reject(event.target.error);
      };
    });
  } catch (error) {
    console.error('Error in removeFromCart:', error);
    throw error;
  }
};

export const clearCart = async () => {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['cart'], 'readwrite');
      const store = transaction.objectStore('cart');
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = (event) => {
        console.error('Error clearing cart:', event.target.error);
        reject(event.target.error);
      };
    });
  } catch (error) {
    console.error('Error in clearCart:', error);
    throw error;
  }
}; 