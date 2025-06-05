'use client';

import React from 'react';
import Link from 'next/link';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

export default function OrderSuccess() {
  // Mock data
  const eta = '11 minutes';
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
  // Mock coordinates (Jaipur)
  const deliveryLocation = { lat: 26.9124, lng: 75.7873 };
  const destination = { lat: 26.9157, lng: 75.8206 };
  const mapContainerStyle = { width: '100%', height: '260px', borderRadius: '1rem' };
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto py-10 px-4 text-center">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-green-100 rounded-full p-4 mb-2">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
          </div>
          <div className="text-gray-500 text-lg">Order is confirmed</div>
          <div className="text-3xl md:text-4xl font-extrabold mt-1 mb-2">Arriving in {eta}</div>
          <div className="text-gray-500 mb-2">{address}</div>
          <div className="text-lg font-semibold mb-2">Total Amount ₹{totalAmount}</div>
          <Link href="/orders"><button className="px-4 py-2 border border-green-600 text-green-700 rounded hover:bg-green-50 font-semibold">View Order Details</button></Link>
        </div>
        {/* Live Map (Google Maps) */}
        <div className="w-full mb-8">
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
              {/* Delivery vehicle marker */}
              <Marker position={deliveryLocation} icon={{ url: '/delivery-bike.png', scaledSize: { width: 48, height: 48 } }} />
              {/* Destination marker */}
              <Marker position={destination} icon={{ url: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png' }} />
            </GoogleMap>
          ) : (
            <div className="w-full h-[260px] bg-green-50 rounded-xl flex items-center justify-center text-gray-400">Loading map...</div>
          )}
        </div>
        {/* Order Status Tracker */}
        <div className="flex justify-between items-center mb-8">
          {orderStatus.map((step, idx) => (
            <div key={step.label} className="flex-1 flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${step.done ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'}`}>{idx + 1}</div>
              <div className={`text-xs font-semibold ${step.done ? 'text-green-700' : 'text-gray-400'}`}>{step.label}</div>
              {idx < orderStatus.length - 1 && <div className={`h-1 w-full ${orderStatus[idx + 1].done ? 'bg-green-400' : 'bg-gray-200'}`}></div>}
            </div>
          ))}
        </div>
        {/* Delivery Address & Summary Card */}
        <div className="bg-white rounded-lg shadow p-4 mb-6 text-left">
          <div className="font-bold mb-1">Delivery Address</div>
          <div className="text-gray-700 mb-2">{address}</div>
          <div className="font-bold mb-1">Order Summary</div>
          <div className="flex justify-between text-gray-700"><span>Order Amount</span><span>₹{totalAmount}</span></div>
          <div className="flex justify-between text-gray-700"><span>Payment</span><span>Cash on Delivery</span></div>
        </div>
        {/* Seller Details Card */}
        <div className="bg-white rounded-lg shadow p-4 mb-6 text-left">
          <div className="font-bold mb-1">Seller Details</div>
          <div className="text-gray-700">{seller.name}</div>
          <div className="text-gray-700">{seller.contact}</div>
          <div className="text-gray-700">{seller.address}</div>
        </div>
        {/* Ads/Upsell Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex flex-col items-center">
            <div className="font-bold mb-2">Add a Snack for the Road?</div>
            <img src="/snack.png" alt="Snack" className="w-16 h-16 mb-2" />
            <button className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-1 rounded font-semibold">Add to Order</button>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex flex-col items-center">
            <div className="font-bold mb-2">Need a Drink?</div>
            <img src="/drink.png" alt="Drink" className="w-16 h-16 mb-2" />
            <button className="bg-blue-400 hover:bg-blue-500 text-white px-4 py-1 rounded font-semibold">Add to Order</button>
          </div>
        </div>
      </div>
    </div>
  );
}