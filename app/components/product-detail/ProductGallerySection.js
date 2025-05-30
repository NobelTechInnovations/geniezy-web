const ProductGallerySection = ({ thumbsToShow, extraThumbs, selectedImage, setSelectedImage, productData }) => {

    return (
        <>
        <div className="lg:col-span-5 flex flex-row gap-4 items-start min-h-[500px]">
            {/* Thumbnails */}
            <div className="flex flex-col gap-2 items-center lg:items-start min-w-[52px]">              
              {thumbsToShow.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`border rounded-md overflow-hidden w-12 h-12 flex items-center justify-center bg-white transition-all ${selectedImage === index ? 'border-blue-600 ring-2 ring-blue-200' : 'border-gray-200'}`}
                >
                  <img
                    src={image}
                    alt={`Thumb ${index + 1}`}
                    className="object-contain w-full h-full"
                  />
                </button>
              ))}
              {extraThumbs > 0 && (
                <div className="border rounded-md w-12 h-12 flex items-center justify-center bg-gray-100 text-gray-700 font-semibold text-sm">{`+${extraThumbs}`}</div>
              )}
            </div>
            {/* Main Image */}
            <div className="relative w-full flex-1 aspect-square rounded-lg overflow-hidden border border-gray-200 bg-white flex items-center justify-center min-w-[250px] max-w-[550px]">
              <img
                src={productData.images[selectedImage]}
                alt={productData.title}
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </>
    );
}

export default ProductGallerySection;