'use client';

import { useState } from 'react';
import { saveLocationToLocalStorage } from './LocationDropdown';
import api from '@/app/redux/services/apiService';

// Blocking, one-time location capture — same UX pattern as Zomato/Blinkit:
// buyers must set a location before browsing, captured once via the browser
// geolocation API (or a manual pincode fallback) and cached (see
// LocationDropdown's 30-day localStorage cache), never polled continuously.
const LocationGateModal = ({ onResolved }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [pincode, setPincode] = useState('');

  const finishWithLocation = (location) => {
    saveLocationToLocalStorage(location);
    onResolved(location);
  };

  const handleDetectLocation = async () => {
    if (!navigator.geolocation) {
      setError('Your browser does not support location detection. Please enter your pincode instead.');
      setShowManualEntry(true);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 10000 });
      });
      const { latitude, longitude } = position.coords;

      // Reverse-geocoding to a human-readable city/pincode is a nice-to-have
      // display detail, not required for the actual proximity filtering —
      // the raw coordinates are all that matters there. If it fails (e.g.
      // the Maps API key/project has an issue), we still save the working
      // coordinates rather than blocking the whole flow on a cosmetic step.
      let city = 'Current Location';
      let pincode_ = '';
      try {
        if (window.google?.maps) {
          const geocoder = new window.google.maps.Geocoder();
          const results = await new Promise((resolve, reject) => {
            geocoder.geocode({ location: { lat: latitude, lng: longitude } }, (res, status) => {
              if (status === 'OK') resolve(res);
              else reject(new Error('Geocoding failed'));
            });
          });
          const components = results[0]?.address_components || [];
          components.forEach((c) => {
            if (c.types.includes('locality')) city = c.long_name;
            if (c.types.includes('postal_code')) pincode_ = c.long_name;
          });
        }
      } catch {
        // Silently keep the generic label — coordinates are still valid.
      }

      finishWithLocation({ city, pincode: pincode_, latitude, longitude });
    } catch (err) {
      // PERMISSION_DENIED, TIMEOUT, or POSITION_UNAVAILABLE
      setError('Could not detect your location. Please enter your pincode instead.');
      setShowManualEntry(true);
    } finally {
      setLoading(false);
    }
  };

  const handleManualResolve = async () => {
    if (!pincode || pincode.trim().length < 4) {
      setError('Please enter a valid pincode.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/v1/shop/gz/location/resolve', { pincode: pincode.trim() });
      const { latitude, longitude } = response.data.data;
      finishWithLocation({ city: `Pincode ${pincode.trim()}`, pincode: pincode.trim(), latitude, longitude });
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Could not resolve that pincode right now. Please try again in a moment.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-1">Set your delivery location</h2>
        <p className="text-sm text-gray-500 mb-5">
          We only show products from sellers who can deliver to you.
        </p>

        {error && (
          <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2 mb-4">
            {error}
          </p>
        )}

        {!showManualEntry ? (
          <>
            <button
              onClick={handleDetectLocation}
              disabled={loading}
              className="w-full bg-[#004bad] text-white font-semibold py-2.5 rounded-full text-sm hover:bg-blue-800 transition disabled:opacity-60"
            >
              {loading ? 'Detecting…' : 'Use my current location'}
            </button>
            <button
              onClick={() => setShowManualEntry(true)}
              className="w-full text-[#004bad] text-sm font-medium py-2.5 mt-2 hover:underline"
            >
              Enter pincode manually
            </button>
          </>
        ) : (
          <>
            <input
              type="text"
              inputMode="numeric"
              placeholder="Enter your pincode"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-[#004bad]"
            />
            <button
              onClick={handleManualResolve}
              disabled={loading}
              className="w-full bg-[#004bad] text-white font-semibold py-2.5 rounded-full text-sm hover:bg-blue-800 transition disabled:opacity-60"
            >
              {loading ? 'Setting location…' : 'Continue'}
            </button>
            <button
              onClick={() => { setShowManualEntry(false); setError(null); }}
              className="w-full text-gray-500 text-sm py-2.5 mt-1 hover:underline"
            >
              Back
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default LocationGateModal;
