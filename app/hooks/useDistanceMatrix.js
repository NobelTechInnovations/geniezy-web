import { useState, useEffect } from 'react';

/**
 * Custom hook to calculate distance and time between two points using Google Distance Matrix API
 * @param {Object} origin - Origin coordinates {latitude, longitude}
 * @param {Object} destination - Destination coordinates {latitude, longitude}
 * @returns {Object} - { distance, duration, loading, error }
 */
const useDistanceMatrix = (origin, destination) => {
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const calculateDistance = async () => {
      // Reset states when coordinates change
      setDistance(null);
      setDuration(null);
      setError(null);

      // Check if we have both origin and destination coordinates
      if (!origin?.latitude || !origin?.longitude || !destination?.latitude || !destination?.longitude) {
        setError('Missing coordinates');
        return;
      }

      // Check if Google Maps API is loaded
      if (!window.google || !window.google.maps) {
        setError('Google Maps API not loaded');
        return;
      }

      setLoading(true);

      try {
        const service = new google.maps.DistanceMatrixService();
        const originLatLng = new google.maps.LatLng(origin.latitude, origin.longitude);
        const destLatLng = new google.maps.LatLng(destination.latitude, destination.longitude);

        const response = await new Promise((resolve, reject) => {
          service.getDistanceMatrix(
            {
              origins: [originLatLng],
              destinations: [destLatLng],
              travelMode: google.maps.TravelMode.DRIVING,
            },
            (response, status) => {
              if (status === 'OK') {
                resolve(response);
              } else {
                reject(new Error(`Google API error: ${status}`));
              }
            }
          );
        });

        const element = response.rows[0].elements[0];

        if (element.status === 'OK') {
            setDistance({
              text: element.distance.text,
              value: element.distance.value // in meters
            });
          
            // Add 10 minutes (600 seconds) buffer
            const bufferedDurationValue = element.duration.value + 600;
          
            setDuration({
              text: `${Math.ceil(bufferedDurationValue / 60)} mins`, // optional: can format better
              value: bufferedDurationValue
            });
          } else {
            throw new Error(`Route not found: ${element.status}`);
          }
          
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    calculateDistance();
  }, [origin?.latitude, origin?.longitude, destination?.latitude, destination?.longitude]);

  return {
    distance,
    duration,
    loading,
    error
  };
};

export default useDistanceMatrix; 