import { useState, useEffect, useCallback } from 'react';
import { addBrowsingHistory, getBrowsingHistory, clearBrowsingHistory, updateBrowsingHistory } from '../services/browsingHistory/indexedDB';
import { getAnonymousId } from '../services/browsingHistory/anonymousId';

export const useBrowsingHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadHistory = useCallback(async () => {
    try {
      const data = await getBrowsingHistory();
      setHistory(data);
    } catch (error) {
      console.error('Error loading browsing history:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const addToHistory = useCallback(async (item) => {
    connsole.log(item,"=====");
    try {
      const anonId = getAnonymousId();
      const historyItem = {
        ...item,
        anonId,
        timestamp: new Date().toISOString(),
      };

      // Check if product with same gspin exists
      const existingHistory = await getBrowsingHistory(100);
      const existingProduct = existingHistory.find(
        (entry) => entry.gspin === item.gspin && entry.type === 'product'
      );

      if (existingProduct) {
        // Update viewCount and timestamp
        const updatedProduct = {
          ...existingProduct,
          viewCount: (existingProduct.viewCount || 1) + 1,
          timestamp: new Date().toISOString(),
        };
        await updateBrowsingHistory(updatedProduct);
        setHistory((prev) => [updatedProduct, ...prev.filter((p) => p.gspin !== item.gspin)]);
      } else {
        // Insert new with viewCount: 1
        const newProduct = { ...historyItem, viewCount: 1 };
        await addBrowsingHistory(newProduct);
        setHistory((prev) => [newProduct, ...prev]);
      }
    } catch (error) {
      console.error('Error adding to browsing history:', error);
    }
  }, []);

  const clearHistory = useCallback(async () => {
    try {
      await clearBrowsingHistory();
      setHistory([]);
    } catch (error) {
      console.error('Error clearing browsing history:', error);
    }
  }, []);

  return {
    history,
    loading,
    addToHistory,
    clearHistory,
    refreshHistory: loadHistory,
  };
}; 