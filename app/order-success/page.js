'use client';

import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import { GoogleMap, Marker, useJsApiLoader, DirectionsService, DirectionsRenderer } from '@react-google-maps/api';
import RecentViewProducts from '../components/home/RecentViewProducts';

export default function OrderSuccess() {
  // Mock data
  const mockEta = '11 minutes';
  const address = 'B 601 shree shyam Residency, jivan vihar, gajsinghpura ajmer road, 6th floor Gajsinghpur, Jaipur';
  const totalAmount = 129;
  const seller = { name: 'Geniezy Seller', contact: '+91-9876543210', address: 'Jaipur, Rajasthan' };
  const orderStatus = [
    { label: 'Confirmed', done: true },
    { label: 'Packed', done: true },
    { label: 'Out for Delivery', done: true },
    { label: 'Arriving Soon', done: false },
    { label: 'Delivered', done: false },
  ];
  const [directions, setDirections] = useState(null);
  const [eta, setEta] = useState('');
  // Delivery and seller coordinates

  const deliveryLocation = { lat: 26.874000, lng: 75.726966 };
  const sellerLocation = { lat: 26.888090, lng: 75.745260 };
  const mapContainerStyle = { width: '100%', height: '100%', borderRadius: '0.75rem' };
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  });

  // Directions callback
  const directionsCallback = useCallback((result, status) => {
    if (status === 'OK') {
      setDirections(result);
      const leg = result.routes[0].legs[0];
      setEta(leg.duration.text);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pb-10 bg-white">
      <div className="container mx-auto flex flex-col md:flex-row gap-8">
        <div className="flex-1">
          {/* Order Details Card */}
          <div className="max-w-1xl mx-auto mt-8 mb-6 px-4">
            <div className=" p-6 flex flex-col md:flex-row items-center gap-6">
              <div className="flex-1 flex flex-col items-center md:items-start">
                <div className="bg-green-100 rounded-full p-3 mb-2">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                </div>
                <div className="text-gray-500 text-base">Order is confirmed</div>
                <div className="text-2xl md:text-3xl font-extrabold mt-1 mb-2 text-center md:text-left">Arriving in {eta}</div>
                <div className="text-gray-500 mb-2 text-center md:text-left">{address}</div>
                <div className="text-lg font-semibold mb-2 text-center md:text-left">Total Amount <span className="text-green-700">₹{totalAmount}</span></div>
                <Link href="/orders"><button className="px-4 py-2 border border-gray-600 text-gray-700 rounded hover:bg-gray-50 font-semibold mt-2">View Order Details</button></Link>
              </div>
              <div className="flex-1 w-full">
              <div className="w-full flex flex-col h-72">
              <div className="font-bold text-gray-800 mb-2">Live Order Tracking</div>
              {eta && <div className="text-green-700 font-semibold mb-2">Estimated travel time: {eta}</div>}
              <div className="flex-1">
                {isLoaded ? (
                  <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={deliveryLocation}
                    zoom={13}
                    options={{
                      disableDefaultUI: true,
                      zoomControl: true,
                      styles: [
                        { featureType: 'poi', stylers: [{ visibility: 'off' }] },
                        { featureType: 'transit', stylers: [{ visibility: 'off' }] },
                      ],
                    }}
                  >
                    {/* Seller marker */}
                    <Marker position={sellerLocation} label={{ text: 'Seller', color: 'black', fontWeight: 'bold', fontSize: '14px' }} icon={{ url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png' }} />
                    {/* Delivery marker */}
                    <Marker position={deliveryLocation} label={{ text: 'Delivery', color: 'black', fontWeight: 'bold', fontSize: '14px' }} icon={{ url: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png' }} />
                    {/* Only call DirectionsService if directions is null */}
                    {!directions && (
                      <DirectionsService
                        options={{
                          origin: sellerLocation,
                          destination: deliveryLocation,
                          travelMode: 'DRIVING',
                        }}
                        callback={directionsCallback}
                      />
                    )}
                    {directions && (
                      <DirectionsRenderer
                        options={{
                          directions,
                          suppressMarkers: true,
                          polylineOptions: { strokeColor: '#34d399', strokeWeight: 5, strokeOpacity: 0.9 },
                        }}
                      />
                    )}
                  </GoogleMap>
                ) : (
                  <div className="w-full h-full bg-green-50 rounded-xl flex items-center justify-center text-gray-400">Loading map...</div>
                )}
              </div>
            </div>
              </div>
            </div>

          </div>

           {/* Order Status Tracker */}
           <div className="max-w-1xl mx-auto mb-8 px-4 border border-gray-200 rounded-sm">
            <div className="p-6">
              <div className="font-bold text-gray-800 mb-4">Order Status</div>
              <div className="flex justify-between items-center">
                {orderStatus.map((step, idx) => (
                  <div key={step.label} className="flex-1 flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${step.done ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'} transition-all duration-300`}>{idx + 1}</div>
                    <div className={`text-xs font-semibold ${step.done ? 'text-green-700' : 'text-gray-400'}`}>{step.label}</div>
                    {idx < orderStatus.length - 1 && <div className={`h-1 w-full ${orderStatus[idx + 1].done ? 'bg-green-400' : 'bg-gray-200'} transition-all duration-300`}></div>}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Live Map Card with Credit Card Ad */}
          <div className="max-w-1xl mx-auto mb-8 px-4 flex flex-col md:flex-row gap-4 items-center ">
            <div className="w-1/2 h-72 bg-gradient-to-br flex flex-col items-center gap-4 mb-4 md:mb-0">
              <img src="https://www.sbicard.com/sbi-card-en/assets/media/images/personal/credit-cards/credit-home-banner-24/simplyclick-blue/m-simplyclick-blue.jpg" 
                alt="Credit Card" 
                className="w-full h-full object-cover rounded-lg shadow" />
            </div>
            <div className="w-1/2 h-72 bg-gradient-to-br flex flex-col items-center gap-4 mb-4 md:mb-0">
              <img src="https://www.axisbank.com/images/default-source/revamp_new/progresswithus/axis-bank-unveils-its-credit-cards-campaign-open-experiences.jpg" 
                alt="Credit Card" 
                className="w-full h-full object-cover rounded-lg shadow" />
            </div>
            
          </div>
      
          {/* Sponsored Ad Banner */}
          <div className="max-w-3xl mx-auto mb-8 px-4">
            <div className="bg-gradient-to-r from-gray-100 to-blue-50 flex flex-col md:flex-row items-center justify-between px-6 py-4 rounded-2xl shadow">
              <div className="flex items-center gap-4">
                <img src="https://m.media-amazon.com/images/W/MEDIAX_1215821-T1/images/I/41yb-Z4lB5L.jpg" alt="Sponsor" className="w-14 h-14 rounded-lg shadow" />
                <div>
                  <div className="text-lg md:text-2xl font-bold text-blue-900">Get 10% Off with Geniezy Credit Card</div>
                  <div className="text-blue-700 text-sm">Apply now and save on every order!</div>
                </div>
              </div>
              <button className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold shadow">Apply Now</button>
            </div>
          </div>
      
          {/* Recently Viewed Products Section */}
      
            <RecentViewProducts />
      
        </div>
        {/* Small Sponsored Card Sidebar (sticky on desktop, full width on mobile) */}
       
      </div>
    </div>
  );
}