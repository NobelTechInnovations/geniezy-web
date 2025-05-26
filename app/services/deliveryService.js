import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export const deliveryService = {
  // Fetch food items
  getFoodItems: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/delivery/food`);
      return response.data;
    } catch (error) {
      console.error('Error fetching food items:', error);
      throw error;
    }
  },

  // Fetch grocery items
  getGroceryItems: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/delivery/grocery`);
      return response.data;
    } catch (error) {
      console.error('Error fetching grocery items:', error);
      throw error;
    }
  },

  // Add item to cart
  addToCart: async (itemId, quantity = 1) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/cart/add`, {
        itemId,
        quantity,
      });
      return response.data;
    } catch (error) {
      console.error('Error adding item to cart:', error);
      throw error;
    }
  },
}; 