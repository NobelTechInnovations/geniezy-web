'use client';

import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import { GoogleMap, Marker, useJsApiLoader, DirectionsService, DirectionsRenderer } from '@react-google-maps/api';
import RecentViewProducts from '../components/home/RecentViewProducts';
import { FiCheckCircle } from 'react-icons/fi';

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
    <div className="flex container mx-auto flex-col bg-gray-50">
      <div className="w-6xl mx-auto gap-2 my-2">
          {/* Order Details Card */}

            <div className=" p-6 flex flex-col md:flex-row items-center gap-6">
              <div className="flex-1 flex flex-col items-center md:items-start">
                <div className='flex gap-2 items-center justify-center'>
                  <FiCheckCircle className='text-green-700'/>
                  <div className="text-gray-500 text-base">Order is confirmed</div> 
                </div>
                <div className="text-md font-semibold ">Total Amount <span className="text-gray-700">₹{totalAmount}</span></div>
                <div className="text-lg font-semibold">Arriving in {eta}</div>
                <div className="text-gray-500 mb-2 ">{address}</div>
                <Link href="/orders"><button className=" text-gray-700 underline font-semibold ">View Order Details</button></Link>
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

          

           {/* Order Status Tracker */}
           <div>
            <div className="font-bold text-gray-800">Order Status</div>
            <p>Track your all order status in just 1 step</p>
            <div className=" mx-auto border border-gray-200 rounded-sm mb-2">
              <div className="p-2">
                <div className="flex justify-between items-center">
                  {orderStatus.map((step, idx) => (
                    <div key={step.label} className="flex-1 flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${step.done ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'} transition-all duration-300`}>{idx + 1}</div>
                      <div className={`text-xs font-semibold ${step.done ? 'text-green-700' : 'text-gray-400'}`}>{step.label}</div>
                      
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>


      
          {/* Sponsored Ad Banner */}
          <div className=" mx-auto my-8 ">
            <div className="bg-gray-100 flex flex-col md:flex-row items-center justify-between px-6 py-4 rounded-lg shadow">
              <div className="flex items-center gap-4">
                <img src="https://seller-app-product.s3.eu-north-1.amazonaws.com/variations/1748249725294-GalaxyS25-6.9inches.webp?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIA2RFFCW7PDHGEA77S%2F20250909%2Feu-north-1%2Fs3%2Faws4_request&X-Amz-Date=20250909T192223Z&X-Amz-Expires=3600&X-Amz-Signature=936d887e2a3c6af9f4330fadee79d55eb503651221b30be2572b97bcd223a01e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject" alt="Sponsor" className="w-14 h-14 " />
                <div>
                  <div className="text-lg font-bold text-gray-900">Get 10% Off with Geniezy Credit Card</div>
                  <div className="text-sm">Apply now and save on every order!</div>
                </div>
              </div>
              <button className="mt-4 md:mt-0 text-dark underline">Apply Now</button>
            </div>
          </div>
      
          {/* Recently Viewed Products Section */}
      
            <RecentViewProducts />

          <div className=" mx-auto flex flex-col md:flex-row gap-2 my-6">
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

          <RecentViewProducts />
       
          </div>
    </div>
  );
}