'use client';

import { FiShoppingCart, FiStar, FiTruck, FiRefreshCw, FiShield, FiCheck } from 'react-icons/fi';
import Link from 'next/link';
import {formatIndianPrice} from '../../shared/utils/priceFormat';
import { useState } from 'react';
import S3Image from "@/app/shared/utils/S3Image";

const ProductInfoSection = ({productData, onVariationSelect}) => {
    // Get variations if product is variable type
    const variations = productData.type === 'variable' ? productData.variations || [] : [];
    const [selectedVariation, setSelectedVariation] = useState(productData.selected_combination || null);

    // Function to check if a variation is selected
    const isVariationSelected = (variation) => {
        if (!selectedVariation) return false;
        // Compare variants for equality
        const selectedVariantEntries = Object.entries(selectedVariation.variant);
        const variationVariantEntries = Object.entries(variation.variant);

        if (selectedVariantEntries.length !== variationVariantEntries.length) {
            return false;
        }

        return selectedVariantEntries.every(([key, value]) => {
             // Find the corresponding entry in the clicked variation
            const matchingEntry = variationVariantEntries.find(([varKey, varValue]) => varKey === key);

            if (!matchingEntry) return false; // Key not found in the clicked variation

            // Compare values
            return matchingEntry[1]?.value === value?.value;
        });
    };

    // Function to handle variation selection
    const handleVariationSelect = (variation) => {
        setSelectedVariation(variation);
        
        // Call the prop function to handle URL update and re-fetch in the parent component
        if (onVariationSelect) {
            onVariationSelect(variation);
        }
    };

    // Function to render variant value (special handling for colors)
    const renderVariantValue = (key, value) => {
        if (key.toLowerCase() === 'color') {
            return (
                <div 
                    className="w-3 h-3 rounded-full border border-gray-200" 
                    style={{ backgroundColor: value.value }}
                />
            );
        }
        return <span>{value.value}</span>;
    };
    
    return (
        <div className="lg:col-span-5 flex flex-col gap-2">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">{productData.title}</h1>
            <div className="flex items-center gap-1 mb-2">
              <span className="text-blue-700 text-sm font-semibold cursor-pointer hover:underline">Visit the {productData.brand} Store</span>
              <span className="flex items-center text-yellow-500 font-semibold ml-2">
                <FiStar className="mr-1" /> {productData.rating}
              </span>
              <span className="text-gray-600 text-sm">({productData.ratingCount})</span>
            </div>
            <div className="text-xs text-gray-700 mb-2">{productData.boughtCount}</div>
            
            <div className="flex flex-col gap-1 mb-2">
              <div className="flex items-center gap-2">
                {productData.discount && (
                  <span className="text-red-600 text-xl">-{productData.discount}</span>
                )}
                <span className="text-2xl font-bold text-gray-900">{formatIndianPrice(productData.price)}</span>
              </div>
              {productData.originalPrice && (
                <>
                <div className='flex gap-2'>
                <span className="text-gray-500 text-xs">M.R.P</span>
                <span className="text-base text-gray-500 line-through text-xs">{formatIndianPrice(productData.originalPrice)}</span>
                </div>
                </>
              )}
            </div>

            {/* Small icons row */}
            <div className="flex flex-wrap gap-4 text-xs text-gray-700 mb-4">
              <div className="flex items-center gap-1">
                <FiCheck className="text-green-600" />
                <span>Genuine Product</span>
              </div>
              <div className="flex items-center gap-1">
                <FiTruck className="text-blue-600" />
                <span>Free Delivery</span>
              </div>
              <div className="flex items-center gap-1">
                <FiShield className="text-purple-600" />
                <span>7 Days Replacement</span>
              </div>
              <div className="flex items-center gap-1">
                <FiShoppingCart className="text-orange-600" />
                <span>Cash on Delivery</span>
              </div>
            </div>

            {/* Variations section for variable products */}
            {productData.type === 'variable' && variations.length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-semibold mb-2">Available Options:</h3>
                <div className="flex flex-wrap gap-2">
                  {variations.map((variation, index) => (
                    <button
                      key={index}
                      onClick={() => handleVariationSelect(variation)}
                      className={`border rounded-md p-2 transition-all flex flex-col items-start gap-1 ${
                        isVariationSelected(variation)
                          ? 'border-blue-500 ring-2 ring-blue-200'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      {variation.image && variation.image.length > 0 && (
                         <div className="w-12 h-12 rounded-md overflow-hidden border border-gray-100 flex items-center justify-center bg-white">
                            <S3Image
                                src={variation.image[0]}
                                alt={`Variation ${index + 1}`}
                                className="object-contain w-full h-full"
                            />
                         </div>
                      )}

                      {Object.entries(variation.variant).map(([key, value]) => (
                        <div key={key} className="text-xs flex items-center gap-1">
                          <span className="font-medium">{key}:</span>{' '}
                          {renderVariantValue(key, value)}
                        </div>
                      ))}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-1 mb-2">
              <span className="bg-gray-100 text-xs px-2 py-1 rounded font-semibold text-gray-700">g. Assuerd</span>
              <span className="text-xs text-gray-700">Inclusive of all taxes</span>
            </div>
            <div className="text-xs text-gray-700 mb-2">EMI starts at ₹1,697. No Cost EMI available <span className="text-blue-700 cursor-pointer hover:underline">EMI options</span></div>
            {/* Offers as horizontal cards */}
            <div className="flex flex-wrap gap-1 mb-2">
              {productData.offers.map((offer, idx) => (
                <div key={idx} className="bg-gray-50 border border-gray-200 rounded px-3 py-2 text-xs min-w-[140px] flex-1">
                  <div className="font-semibold text-gray-800 mb-1">{offer.title}</div>
                  <div className="text-gray-700 mb-1">{offer.desc}</div>
                  <Link href={offer.link} className="text-blue-700 hover:underline">{offer.title === 'Cashback' ? '2 offers' : offer.title === 'No Cost EMI' ? '1 offer' : '23 offers'}</Link>
                </div>
              ))}
            </div>
            {/* Icons row */}
            <div className="flex flex-wrap gap-2 text-xs text-gray-700 mb-2 items-center">
              <div className="flex flex-col items-center font-semibold text-center flex-1"><FiRefreshCw className="font-semibold text-lg mb-1" />7 days Service Centre Replacement</div>
              <div className="flex flex-col items-center font-semibold text-center flex-1"><FiShield className="font-semibold text-lg mb-1" />1 Year Warranty</div>
              <div className="flex flex-col items-center font-semibold text-center flex-1"><FiShield className="font-semibold text-lg mb-1" />Top Brand</div>
              <div className="flex flex-col items-center font-semibold text-center flex-1"><FiShield className="font-semibold text-lg mb-1" />Genie Assuerd</div>
            </div>
          </div>
    );
}

export default ProductInfoSection;