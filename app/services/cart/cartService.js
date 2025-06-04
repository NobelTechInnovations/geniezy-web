import api from '@/app/redux/services/apiService';
import { addToCart, getCartItems, updateCartItemQuantity } from '../indexedDB';

export const cartService = {
  addToCart: async (productData) => {
    const { gspin, pid, p_sku, type, quantity } = productData;
    
    // Check if user is logged in by looking for token
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    
    if (token) {
      // User is logged in, use API
      try {
        const response = await api.post('/v1/shop/cart/add', {
          gspin,
          pid,
          p_sku,
          type,
          quantity
        });
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
            price: productData.price,
            image: productData.images?.[0],
            brand: productData.brand
          }
        };
        const result = await addToCart(cartItem);
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
        const response = await api.put(`/v1/shop/cart/${id}`, { quantity });
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

  getCartItems: async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    
    if (token) {
      // User is logged in, fetch from API
      try {
        const response = await api.get('/v1/shop/cart');
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