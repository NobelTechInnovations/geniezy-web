'use client';

import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import { GoogleMap, Marker, useJsApiLoader, DirectionsService, DirectionsRenderer } from '@react-google-maps/api';
import RecentViewProducts from '../components/home/RecentViewProducts';
import { FiCheckCircle } from 'react-icons/fi';
import Image from "next/image";

export default function OrderSuccess() {
  const mockEta = '11 minutes';
  const address = 'B 601 Shree Shyam Residency, Jivan Vihar, Ajmer Road, Jaipur — 302021';
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

  const deliveryLocation = { lat: 26.874000, lng: 75.726966 };
  const sellerLocation   = { lat: 26.888090, lng: 75.745260 };
  const mapContainerStyle = { width: '100%', height: '100%', borderRadius: '0.75rem' };

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  });

  const directionsCallback = useCallback((result, status) => {
    if (status === 'OK') {
      setDirections(result);
      const leg = result.routes[0].legs[0];
      setEta(leg.duration.text);
    }
  }, []);

  const doneCount = orderStatus.filter((s) => s.done).length;

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="container mx-auto max-w-5xl px-4 py-6">

        {/* Confirmation banner */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex flex-col md:flex-row gap-6 mb-5">
          {/* Left: info */}
          <div className="flex-1 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-2">
              <FiCheckCircle className="text-green-600 text-2xl" />
              <span className="text-green-700 font-semibold">Order is confirmed!</span>
            </div>
            <p className="text-sm text-gray-500 mb-1">{address}</p>
            <p className="text-gray-900 font-bold text-lg mb-1">
              Total ₹{totalAmount}
            </p>
            {(eta || mockEta) && (
              <p className="text-[#004bad] font-semibold mb-4">
                Arriving in {eta || mockEta}
              </p>
            )}
            <Link href="/orders">
              <button className="text-sm text-[#004bad] underline font-semibold">
                View Order Details
              </button>
            </Link>
          </div>

          {/* Right: map */}
          <div className="flex-1 h-64 rounded-xl overflow-hidden bg-gray-100">
            <div className="font-semibold text-gray-800 text-sm px-3 pt-3 mb-1">Live Tracking</div>
            {eta && (
              <p className="text-green-700 text-xs font-semibold px-3 mb-1">
                ETA: {eta}
              </p>
            )}
            <div className="h-52">
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
                  <Marker
                    position={sellerLocation}
                    label={{ text: 'Seller', color: 'black', fontWeight: 'bold', fontSize: '13px' }}
                    icon={{ url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png' }}
                  />
                  <Marker
                    position={deliveryLocation}
                    label={{ text: 'You', color: 'black', fontWeight: 'bold', fontSize: '13px' }}
                    icon={{ url: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png' }}
                  />
                  {!directions && (
                    <DirectionsService
                      options={{ origin: sellerLocation, destination: deliveryLocation, travelMode: 'DRIVING' }}
                      callback={directionsCallback}
                    />
                  )}
                  {directions && (
                    <DirectionsRenderer
                      options={{
                        directions,
                        suppressMarkers: true,
                        polylineOptions: { strokeColor: '#004bad', strokeWeight: 4, strokeOpacity: 0.85 },
                      }}
                    />
                  )}
                </GoogleMap>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                  Loading map…
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Order status tracker */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-5">
          <p className="font-semibold text-gray-900 mb-1">Order Status</p>
          <p className="text-xs text-gray-400 mb-5">Track your order in real time</p>

          <div className="flex items-start justify-between relative">
            {/* Progress line bg */}
            <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200" />
            {/* Progress line fill */}
            <div
              className="absolute top-4 left-0 h-0.5 bg-[#004bad] transition-all"
              style={{ width: `${(doneCount / (orderStatus.length - 1)) * 100}%` }}
            />

            {orderStatus.map((step, idx) => (
              <div key={step.label} className="flex flex-col items-center z-10 flex-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                    step.done
                      ? 'bg-[#004bad] border-[#004bad] text-white'
                      : 'bg-white border-gray-200 text-gray-400'
                  }`}
                >
                  {step.done
                    ? <FiCheckCircle className="text-sm" />
                    : <span className="text-xs">{idx + 1}</span>}
                </div>
                <p
                  className={`text-xs mt-2 text-center font-medium leading-tight ${
                    step.done ? 'text-[#004bad]' : 'text-gray-400'
                  }`}
                >
                  {step.label}
                </p>
              </div>
            ))}
          </div>
        </div>


      
          {/* Sponsored Ad Banner */}
          <div className=" mx-auto my-8 ">
            <div className="bg-gray-100 flex flex-col md:flex-row items-center justify-between px-6 py-4 rounded-lg shadow">
              <div className="flex items-center gap-4">
                <Image src="https://seller-app-product.s3.eu-north-1.amazonaws.com/variations/1748249725294-GalaxyS25-6.9inches.webp?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIA2RFFCW7PDHGEA77S%2F20250909%2Feu-north-1%2Fs3%2Faws4_request&X-Amz-Date=20250909T192223Z&X-Amz-Expires=3600&X-Amz-Signature=936d887e2a3c6af9f4330fadee79d55eb503651221b30be2572b97bcd223a01e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject" alt="Sponsor" className="w-14 h-14 " />
                <div>
                  <div className="text-lg font-bold text-gray-900">Get 10% Off with Geniezy Credit Card</div>
                  <div className="text-sm">Apply now and save on every order!</div>
                </div>
              </div>
              <button className="mt-4 md:mt-0 text-dark underline">Apply Now</button>
            </div>
          </div>
          <button className="bg-white text-[#004bad] font-semibold px-5 py-2 rounded-full text-sm hover:bg-blue-50 transition shrink-0">
            Apply Now
          </button>
        </div>

          <div className=" mx-auto flex flex-col md:flex-row gap-2 my-6">
            <div className="w-1/2 h-72 bg-gradient-to-br flex flex-col items-center gap-4 mb-4 md:mb-0">
            <Image src="https://www.sbicard.com/sbi-card-en/assets/media/images/personal/credit-cards/credit-home-banner-24/simplyclick-blue/m-simplyclick-blue.jpg" 
            alt="Credit Card" 
            className="w-full h-full object-cover rounded-lg shadow" />
            </div>
            <div className="w-1/2 h-72 bg-gradient-to-br flex flex-col items-center gap-4 mb-4 md:mb-0">
            <Image src="https://www.axisbank.com/images/default-source/revamp_new/progresswithus/axis-bank-unveils-its-credit-cards-campaign-open-experiences.jpg" 
            alt="Credit Card" 
            className="w-full h-full object-cover rounded-lg shadow" />
            </div>

          </div>

          <RecentViewProducts />
       
          </div>
    </div>
  );
}
