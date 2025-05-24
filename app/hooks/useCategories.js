import { useState, useEffect } from 'react';
import { categoryApi } from '../redux/services/apiService';

export const useCategories = (version = 'v1') => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await categoryApi.getParentCategories(version);
        if (response.success) {
          setCategories(response.data);
        } else {
          setError('Failed to fetch categories');
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [version]);

  return { categories, loading, error };
}; 