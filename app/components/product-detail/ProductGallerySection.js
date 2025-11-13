import S3Image from "@/app/shared/utils/S3Image";

const ProductGallerySection = ({
  thumbsToShow,
  extraThumbs,
  selectedImage,
  setSelectedImage,
  productData,
}) => {
  const images = productData?.images || [];
  const selectedImageUrl = images[selectedImage] || "";

  return (
    <div className="lg:col-span-5 flex flex-col items-center gap-4">

      {/* MAIN IMAGE */}
      <div className="w-full flex justify-center">
        <div className="relative w-full max-w-[500px] aspect-square rounded-lg overflow-hidden border border-gray-200 bg-white flex items-center justify-center">
          {selectedImageUrl ? (
            <S3Image
              src={selectedImageUrl}
              alt={productData.title}
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="text-gray-400">No image available</div>
          )}
        </div>
      </div>

      {/* THUMBNAILS BELOW */}
      <div className="w-full flex ">
        <div className="flex gap-3 overflow-x-auto scrollbar-hide py-2">

          {thumbsToShow.map((image, index) => (
            <button
              key={image}
              onClick={() => setSelectedImage(index)}
              className={`border rounded-md overflow-hidden w-14 h-14 flex items-center justify-center bg-white transition-all 
                ${selectedImage === index ? "border-blue-600 ring-2 ring-blue-200" : "border-gray-200"}`}
            >
              <S3Image
                src={image}
                alt={`Thumb ${index + 1}`}
                className="object-contain w-full h-full"
              />
            </button>
          ))}

          {extraThumbs > 0 && (
            <div className="border rounded-md w-14 h-14 flex items-center justify-center bg-gray-100 text-gray-700 font-semibold text-sm">
              {`+${extraThumbs}`}
            </div>
          )}

        </div>
      </div>

    </div>
  );
};

export default ProductGallerySection;
