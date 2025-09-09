import api from '@/app/redux/services/apiService';
import { addToCart, getCartItems, updateCartItemQuantity, removeFromCart as removeLocalCartItem, clearCart } from '../indexedDB';

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
    const token = typeof window !== 'undefined' ? localStorage.getItem('geniezy_token') : null;
    
    if (token) {
      // User is logged in, use API
      try {
        const response = await api.post('/v1/shop/cart/items', {
          productId: gspin,
          quantity: quantity,
          sku: p_sku,
          type: type === 'simple' ? 'simple' : 'variable_combination',
          ...(type === 'variable' && productData.selected_combination && {
            selected_combination: productData.selected_combination
          })
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (response.data?.success) {
          dispatchCartUpdateEvent();
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
            price: productData.price,
            image: productData.images?.[0],
            brand: productData.brand
          }
        };

        // For variable products, add additional details and update price/image from selected_combination
        if (productData.type === 'variable' && productData.selected_combination) {
          cartItem.productData.additional = productData.selected_combination.variant || {};
          cartItem.productData.price = productData.selected_combination.price?.$numberDecimal || productData.selected_combination.price;
          if (productData.selected_combination.images?.[0]?.url) {
            cartItem.productData.image = productData.selected_combination.images[0].url;
          }
        } else if (productData.type === 'simple') {
          cartItem.productData.price = productData.price?.$numberDecimal || productData.price;
          if (productData.images?.[0]) {
            cartItem.productData.image = productData.images[0];
          }
        }

        const result = await addToCart(cartItem);
        dispatchCartUpdateEvent();
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
    const token = typeof window !== 'undefined' ? localStorage.getItem('geniezy_token') : null;
    
    if (token) {
      // User is logged in, use API
      try {
        const response = await api.put(`/v1/shop/cart/items/${id}`, { quantity }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (response.data?.success) {
          dispatchCartUpdateEvent();
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
        dispatchCartUpdateEvent();
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
    const token = typeof window !== 'undefined' ? localStorage.getItem('geniezy_token') : null;

    if (token) {
      // User is logged in, use API
      try {
        const response = await api.delete(`/v1/shop/cart/items/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (response.data?.success) {
          dispatchCartUpdateEvent();
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
        dispatchCartUpdateEvent();
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
    const token = typeof window !== 'undefined' ? localStorage.getItem('geniezy_token') : null;
    
    if (token) {
      // User is logged in, fetch from API
      try {
        const response = await api.get('/v1/shop/cart', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
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
  },

  // New method to sync local cart with API after login
  syncCartAfterLogin: async (token) => {
    try {
      // Get local cart items
      const localCartItems = await getCartItems();
      
      if (localCartItems && localCartItems.length > 0) {
        // Prepare items for API
        const cartPayload = localCartItems.map(item => ({
          productId: item.gspin,
          quantity: item.quantity,
          sku: item.p_sku,
          type: item.type === 'simple' ? 'simple' : 'variable_combination',
          ...(item.type === 'variable' && item.productData?.additional && {
            selected_combination: {
              variant: item.productData.additional
            }
          })
        }));

        // Send cart to API
        const response = await api.post('/v1/shop/cart/items', cartPayload, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.data?.success) {
          // Clear local cart after successful sync
          await clearCart();
          dispatchCartUpdateEvent();
          return {
            success: true,
            message: 'Cart synced successfully'
          };
        }
      }
      return {
        success: true,
        message: 'No items to sync'
      };
    } catch (error) {
      console.error('Error syncing cart after login:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to sync cart'
      };
    }
  }
}; 