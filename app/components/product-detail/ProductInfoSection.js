'use client';

import { FiShoppingCart, FiTruck, FiShield, FiCheckCircle } from 'react-icons/fi';
import { formatIndianPrice } from '../../shared/utils/priceFormat';
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
        <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold text-gray-900">{productData.title}</h1>
            {productData.brand && (
              <span className="text-sm text-gray-600 mb-1">by <span className="font-semibold text-gray-800">{productData.brand}</span></span>
            )}

            <div className="flex flex-col gap-1 mt-1">
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="text-2xl font-bold text-gray-900">{formatIndianPrice(productData.price)}</span>
                {productData.originalPrice && parseFloat(productData.originalPrice) > parseFloat(productData.price) && (
                  <span className="text-sm text-gray-400 line-through">{formatIndianPrice(productData.originalPrice)}</span>
                )}
                {productData.discount && (
                  <span className="text-sm font-semibold text-green-600">{productData.discount} off</span>
                )}
              </div>
              <span className="text-xs text-gray-500">M.R.P incl. of all taxes</span>
            </div>

            {/* Separator */}
            <div className="border-t border-gray-100 my-2" />

            {/* Trust row — real, generic policy claims only (no fabricated
                counts/stats). A single row instead of the two overlapping
                rows this used to have. */}
            <div className="flex flex-wrap gap-4 text-xs text-gray-700 my-4">
              <div className="flex items-center gap-1">
                <FiCheckCircle className="text-blue-600" />
                <span>Genuine Product</span>
              </div>
              <div className="flex items-center gap-1">
                <FiTruck className="text-blue-600" />
                <span>Free Delivery</span>
              </div>
              <div className="flex items-center gap-1">
                <FiShield className="text-blue-600" />
                <span>Easy Returns</span>
              </div>
              <div className="flex items-center gap-1">
                <FiShoppingCart className="text-blue-600" />
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

            {productData.features?.length > 0 && (
              <div className="mb-2">
                <h3 className="text-sm font-semibold mb-2 text-gray-800">Highlights</h3>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                  {productData.features.slice(0, 6).map((feature, idx) => (
                    <li key={idx}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
    );
}

export default ProductInfoSection;
