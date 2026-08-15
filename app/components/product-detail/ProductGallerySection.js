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
    <div className="lg:col-span-5 flex flex-col gap-3">

      {/* Sticky wrapper — gallery stays in view while user reads info */}
      <div className="lg:sticky lg:top-4">

        {/* THUMBNAIL STRIP — vertical on ≥lg, horizontal on mobile */}
        <div className="hidden lg:flex flex-col gap-2 absolute -left-16 top-0">
          {thumbsToShow.map((image, index) => (
            <button
              key={`${image}-${index}`}
              onClick={() => setSelectedImage(index)}
              className={`border rounded-md overflow-hidden w-12 h-12 flex items-center justify-center bg-white transition-all
                ${selectedImage === index ? "border-brand ring-2 ring-brand/20" : "border-gray-200 hover:border-blue-300"}`}
            >
              <S3Image
                src={image}
                alt={`Thumb ${index + 1}`}
                className="object-contain w-full h-full"
              />
            </button>
          ))}
          {extraThumbs > 0 && (
            <div className="border rounded-md w-12 h-12 flex items-center justify-center bg-gray-50 text-gray-600 font-semibold text-xs">
              +{extraThumbs}
            </div>
          )}
        </div>

        {/* MAIN IMAGE */}
        <div className="w-full flex justify-center">
          <div className="relative w-full max-w-[480px] aspect-square rounded-xl overflow-hidden border border-gray-200 bg-white flex items-center justify-center">
            {selectedImageUrl ? (
              <S3Image
                src={selectedImageUrl}
                alt={productData.title}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="text-gray-400 text-sm">No image</div>
            )}
          </div>
        </div>

        {/* THUMBNAILS BELOW — visible on mobile & tablet */}
        <div className="flex lg:hidden gap-2 overflow-x-auto py-2 mt-2" style={{scrollbarWidth:'none'}}>
          {thumbsToShow.map((image, index) => (
            <button
              key={`${image}-${index}`}
              onClick={() => setSelectedImage(index)}
              className={`flex-none border rounded-md overflow-hidden w-14 h-14 flex items-center justify-center bg-white transition-all
                ${selectedImage === index ? "border-brand ring-2 ring-brand/20" : "border-gray-200"}`}
            >
              <S3Image
                src={image}
                alt={`Thumb ${index + 1}`}
                className="object-contain w-full h-full"
              />
            </button>
          ))}
          {extraThumbs > 0 && (
            <div className="flex-none border rounded-md w-14 h-14 flex items-center justify-center bg-gray-100 text-gray-700 font-semibold text-sm">
              +{extraThumbs}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ProductGallerySection;
