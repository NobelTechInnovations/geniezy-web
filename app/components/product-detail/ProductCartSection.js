import { FiHeart, FiShare2, FiShoppingCart} from 'react-icons/fi';

const ProductCartSection = ({ productData, quantity, exchange, setQuantity, setExchange}) => {

    return (
        <>
        <div className="lg:col-span-2 bg-gray-50 border border-gray-200 rounded-lg p-4 flex flex-col gap-6 min-w-[260px] max-w-md mx-auto lg:mx-0">
            <div className="flex flex-col gap-2">
              <label className=" items-center gap-1 text-sm font-medium">
                <input type="radio" name="exchange" value="no" checked={exchange === 'no'} onChange={() => setExchange('no')} />
                Offer <span className="text-gray-900 font-semibold ml-1">₹ {productData.price}.00</span> <span className="text-gray-500 line-through ml-1">₹ {productData.originalPrice}.00</span>
              </label>
            </div>
            {/* Delivery, stock, seller, payment, gift */}
            <div className="mb-1">
              <div className="text-xs text-blue-700 font-semibold cursor-pointer hover:underline">FREE Same Day Delivery</div>
              <div className="text-green-600 font-semibold text-sm mb-1">In stock</div>
              <div className="text-xs text-gray-700">Ship by <span className="font-semibold">geniezy assuerd</span></div>
              <div className="text-xs text-gray-700">Sold by <span className="font-semibold">Renfe</span></div>
              <div className="text-xs text-blue-700 cursor-pointer hover:underline">Secure transaction</div>
              <div className="text-xs text-blue-700 cursor-pointer hover:underline">Gift options Available at checkout</div>
            </div>

            {/* Quantity & Actions */}
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-700 font-medium mb-1">Quantity:</label>
              <select
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="border border-gray-300 rounded px-2 py-1 w-24 text-sm"
              >
                {[1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
              <button className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 py-1 rounded-sm  flex items-center justify-center gap-2 text-sm mt-2">
                <FiShoppingCart className="text-md" />
                Add to Cart
              </button>
              <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-1 rounded-sm  flex items-center justify-center gap-2 text-sm">
                Buy Now
              </button>
              <div className='flex gap-2'>  
              <button className="flex items-center gap-2 text-gray-600 hover:text-red-500 justify-center text-xs ">
                <FiHeart className="text-sx" />
                <span>Add to Wishlist</span>
              </button>
              <button className="flex items-center gap-2 text-gray-600 hover:text-blue-500 text-xs justify-center">
                <FiShare2 className="text-xs" />
                <span>Share</span>
              </button>
              </div>
            </div>
          </div>
        </>
    );
}
export default ProductCartSection;