'use client';

import { useEffect, useState } from 'react';
import { getLocationFromLocalStorage } from './LocationDropdown';
import LocationGateModal from './LocationGateModal';

// Mounted once around the whole app (see app/layout.js). Renders a
// blocking overlay on top of whatever page is underneath until a location
// has been captured — an addition, not a change to any page's own
// layout/content, so it doesn't conflict with the shop home page's design
// being locked. Checked once per mount against the existing 30-day
// localStorage cache (LocationDropdown.js) — never polled.
const LocationGateProvider = ({ children }) => {
  const [needsLocation, setNeedsLocation] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const existing = getLocationFromLocalStorage();
    setNeedsLocation(!existing);
    setChecked(true);
  }, []);

  // Avoid a flash of the gate before we've checked localStorage once.
  if (!checked) return children;

  return (
    <>
      {children}
      {needsLocation && (
        <LocationGateModal onResolved={() => setNeedsLocation(false)} />
      )}
    </>
  );
};

export default LocationGateProvider;
