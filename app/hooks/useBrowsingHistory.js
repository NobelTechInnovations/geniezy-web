import { useState, useEffect, useCallback } from 'react';
import { addBrowsingHistory, getBrowsingHistory, clearBrowsingHistory } from '../services/browsingHistory/indexedDB';
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
    try {
      const anonId = getAnonymousId();
      const historyItem = {
        ...item,
        anonId,
        timestamp: new Date().toISOString(),
      };
      await addBrowsingHistory(historyItem);
      setHistory(prev => [historyItem, ...prev]);
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