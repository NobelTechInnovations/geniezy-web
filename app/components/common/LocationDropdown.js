import { useState } from 'react';
import { ChevronDown } from 'lucide-react'; // or use a custom SVG if not using lucide

const LocationDropdown = () => {
  const [open, setOpen] = useState(false);

  const handleDetectLocation = () => {
    // Add geolocation detection logic here
    console.log('Detecting location...');
  };

  return (
    <div className="relative text-sm">
      {/* Clickable header */}
      <div
        className="flex items-center cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <span className="text-gray-500 mr-1">Delivering to</span>
        <span className="text-gray-700 mr-1">Jaipur, 302020</span>
        <ChevronDown className="w-4 h-4 text-gray-500" />
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-50 p-4">
          <p className="text-gray-700 text-sm mb-2">
            Full Address: 123, Raja Park, Jaipur, Rajasthan, 302020
          </p>
          <button
            onClick={handleDetectLocation}
            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-indigo-700 text-sm"
          >
            Detect My Location
          </button>
        </div>
      )}
    </div>
  );
};

export default LocationDropdown;
