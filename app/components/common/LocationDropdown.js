import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

const LOCATION_KEY = 'user_location';
const LOCATION_EXPIRY_DAYS = 30;

const saveLocationToLocalStorage = (location) => {
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + LOCATION_EXPIRY_DAYS);

  const data = {
    location,
    expiresAt: expiry.toISOString()
  };

  localStorage.setItem(LOCATION_KEY, JSON.stringify(data));
};

const getLocationFromLocalStorage = () => {
  const data = localStorage.getItem(LOCATION_KEY);
  if (!data) return null;

  try {
    const parsed = JSON.parse(data);
    if (new Date(parsed.expiresAt) > new Date()) {
      return parsed.location;
    } else {
      localStorage.removeItem(LOCATION_KEY); // Clean expired data
    }
  } catch {
    localStorage.removeItem(LOCATION_KEY); // Malformed
  }

  return null;
};

export { getLocationFromLocalStorage };

const LocationDropdown = () => {
  const [open, setOpen] = useState(false);
  const [location, setLocation] = useState({
    city: 'Unknown',
    pincode: 'Unknown'  
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load saved location if available
    const storedLocation = getLocationFromLocalStorage();
    if (storedLocation) {
      setLocation(storedLocation);
    }

    // Load Google Maps script
    const loadGoogleMapsScript = () => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    };

    if (!window.google?.maps) {
      loadGoogleMapsScript();
    }
  }, []);

  const handleDetectLocation = async () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setLoading(true);

    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const { latitude, longitude } = position.coords;

      const geocoder = new window.google.maps.Geocoder();
      const response = await new Promise((resolve, reject) => {
        geocoder.geocode(
          { location: { lat: latitude, lng: longitude } },
          (results, status) => {
            if (status === 'OK') {
              resolve(results);
            } else {
              reject(new Error('Geocoding failed'));
            }
          }
        );
      });

      const addressComponents = response[0].address_components;
      let city = '';
      let pincode = '';

      addressComponents.forEach((component) => {
        if (component.types.includes('locality')) {
          city = component.long_name;
        }
        if (component.types.includes('postal_code')) {
          pincode = component.long_name;
        }
      });

      const newLocation = {
        city: city || 'Unknown',
        pincode: pincode || 'Unknown',
        latitude: latitude,
        longitude: longitude
      };

      setLocation(newLocation);
      saveLocationToLocalStorage(newLocation); // Save with new fields

    } catch (error) {
      console.error('Error getting location:', error);
      alert('Failed to get your location. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative text-sm">
      <div
        className="flex items-center cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <span className="text-gray-500 mr-1">Delivering to</span>
        <span className="text-gray-700 mr-1">{location.city}, {location.pincode}</span>
        <ChevronDown className="w-4 h-4 text-gray-500" />
      </div>

      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-50 p-4">
          <p className="text-gray-700 text-sm mb-2">
            Full Address: 123, Raja Park, {location.city}, Rajasthan, {location.pincode}
          </p>
          <button
            onClick={handleDetectLocation}
            disabled={loading}
            className={`bg-red-600 text-white px-3 py-1 rounded hover:bg-indigo-700 text-sm ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Detecting Location...' : 'Detect My Location'}
          </button>
        </div>
      )}
    </div>
  );
};

export default LocationDropdown;
