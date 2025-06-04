import api from '@/app/redux/services/apiService';
import { addToCart, getCartItems, updateCartItemQuantity, removeFromCart as removeLocalCartItem } from '../indexedDB';

// Simple event to notify components of cart updates
const CART_UPDATE_EVENT = 'cartUpdate';

const dispatchCartUpdateEvent = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(CART_UPDATE_EVENT));
  }
};

export const cartService = {
  addToCart: async (productData) => {
    const { gspin, pid, p_sku, type, quantity } = productData;
    
    // Check if user is logged in by looking for token
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    
    if (token) {
      // User is logged in, use API
      try {
        const endpoint = api.getVersionedEndpoint('v1', 'shop', 'cart/items');
        const response = await api.post(endpoint, {
          productId: gspin, // Assuming gspin maps to productId in the API payload
          quantity: quantity,
          sku: p_sku,
          type: type === 'simple' ? 'simple' : 'variable_combination'
        });
        if (response.data?.success) {
          dispatchCartUpdateEvent(); // Dispatch event on success
        }
        return response.data;
      } catch (error) {
        console.error('Error adding to cart via API:', error);
        return {
          success: false,
          message: error.response?.data?.message || 'Failed to add item to cart'
        };
      }
    } else {
      // User is not logged in, use IndexedDB
      try {
        const cartItem = {
          gspin,
          pid,
          p_sku,
          type,
          quantity,
          productData: {
            title: productData.title,
            price: productData.price, // Default to top-level price
            image: productData.images?.[0], // Default to top-level image
            brand: productData.brand
          }
        };

        // For variable products, add additional details and update price/image from selected_combination
        if (productData.type === 'variable' && productData.selected_combination) {
          cartItem.productData.additional = productData.selected_combination.variant || {}; // Use variant for additional details

           // Update price and image from the selected combination
           cartItem.productData.price = productData.selected_combination.price?.$numberDecimal || productData.selected_combination.price;
           if (productData.selected_combination.images?.[0]?.url) {
              cartItem.productData.image = productData.selected_combination.images[0].url;
           }
        } else if (productData.type === 'simple') {
           // Ensure simple product price and image are from top level if not already set
            cartItem.productData.price = productData.price?.$numberDecimal || productData.price;;
            if (productData.images?.[0]) {
               cartItem.productData.image = productData.images[0];
            }
        }

        const result = await addToCart(cartItem);
        dispatchCartUpdateEvent(); // Dispatch event on success
        return { 
          success: true, 
          message: 'Added to cart successfully',
          data: result
        };
      } catch (error) {
        console.error('Error adding to local cart:', error);
        return {
          success: false,
          message: 'Failed to add item to local cart'
        };
      }
    }
  },

  updateQuantity: async (id, quantity) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    
    if (token) {
      // User is logged in, use API
      try {
         // Use the api service to construct the endpoint
        const endpoint = api.getVersionedEndpoint('v1', 'shop', `cart/items/${id}`);
        const response = await api.put(endpoint, { quantity });
        if (response.data?.success) {
          dispatchCartUpdateEvent(); // Dispatch event on success
        }
        return response.data;
      } catch (error) {
        console.error('Error updating cart quantity via API:', error);
        return {
          success: false,
          message: error.response?.data?.message || 'Failed to update quantity'
        };
      }
    } else {
      // User is not logged in, use IndexedDB
      try {
        const result = await updateCartItemQuantity(id, quantity);
        dispatchCartUpdateEvent(); // Dispatch event on success
        return {
          success: true,
          message: 'Quantity updated successfully',
          data: result
        };
      } catch (error) {
        console.error('Error updating local cart quantity:', error);
        return {
          success: false,
          message: 'Failed to update quantity'
        };
      }
    }
  },

  removeItem: async (id) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    if (token) {
      // User is logged in, use API
      try {
        // Use the api service to construct the endpoint
        const endpoint = api.getVersionedEndpoint('v1', 'shop', `cart/items/${id}`);
        const response = await api.delete(endpoint);
        if (response.data?.success) {
          dispatchCartUpdateEvent(); // Dispatch event on success
        }
        return response.data;
      } catch (error) {
        console.error('Error removing item via API:', error);
        return {
          success: false,
          message: error.response?.data?.message || 'Failed to remove item'
        };
      }
    } else {
      // User is not logged in, use IndexedDB
      try {
        await removeLocalCartItem(id);
        dispatchCartUpdateEvent(); // Dispatch event on success
        return {
          success: true,
          message: 'Item removed from local cart',
        };
      } catch (error) {
        console.error('Error removing local cart item:', error);
        return {
          success: false,
          message: 'Failed to remove item from local cart'
        };
      }
    }
  },

  getCartItems: async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    
    if (token) {
      // User is logged in, fetch from API
      try {
        // Use the api service to construct the endpoint
        const endpoint = api.getVersionedEndpoint('v1', 'shop', 'cart/items');
        const response = await api.get(endpoint);
        return response.data;
      } catch (error) {
        console.error('Error fetching cart from API:', error);
        return {
          success: false,
          message: error.response?.data?.message || 'Failed to fetch cart items'
        };
      }
    } else {
      // User is not logged in, fetch from IndexedDB
      try {
        const items = await getCartItems();
        return { 
          success: true, 
          data: items 
        };
      } catch (error) {
        console.error('Error fetching local cart:', error);
        return {
          success: false,
          message: 'Failed to fetch local cart items'
        };
      }
    }
  }
}; 