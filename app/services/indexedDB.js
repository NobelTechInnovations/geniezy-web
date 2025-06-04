const DB_NAME = 'geniezyDB';
const DB_VERSION = 2; // Increment version to trigger upgrade

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
          // Update quantity if item exists
          existingItem.quantity += item.quantity;
          existingItem.timestamp = new Date().toISOString();
          
          const updateRequest = store.put(existingItem);
          updateRequest.onsuccess = () => resolve(existingItem);
          updateRequest.onerror = (event) => {
            console.error('Error updating cart item:', event.target.error);
            reject(event.target.error);
          };
        } else {
          // Add new item if it doesn't exist
          const addRequest = store.add({
            ...item,
            timestamp: new Date().toISOString(),
          });
          
          addRequest.onsuccess = () => resolve(addRequest.result);
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

      request.onsuccess = () => resolve(request.result);
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
        const item = getRequest.result;
        if (item) {
          item.quantity = quantity;
          item.timestamp = new Date().toISOString();
          
          const updateRequest = store.put(item);
          updateRequest.onsuccess = () => resolve(item);
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