import RecentViewProducts from "../components/home/RecentViewProducts";

export default function OrdersPage() {
    return (
      <main className="container mx-auto flex flex-col bg-white">
        <div className="flex w-6xl my-4 mx-auto gap-4">
          {/* Orders Section */}
          <div className="flex flex-col gap-4 w-2/3">
            {/* Example Order Card */}
            <div className=" rounded-xl p-4 border border-gray-100">
              <div className="flex justify-between items-center">
                <h2 className="font-semibold text-lg">Order #12345</h2>
                <span className="bg-yellow-100 text-yellow-700 px-3 text-xs py-1 rounded-full">
                  Pending
                </span>
              </div>
              <p className="text-gray-500 text-sm mt-1">
                Placed on: 10 Sept 2025
              </p>
              <div className="mt-3 text-sm">
                <p>Item: Wireless Earbuds</p>
                <p>Price: ₹1,499</p>
              </div>
            <a href="/orders/43435t453e4" className="text-sm underline">View full details</a>
            </div>
          </div>
  
          {/* Sponsored Product */}
          <div className="w-1/3">
         
            <div className="p-2 bg-gray-50">
              <h3 className="font-semibold text-lg mb-3">Samsung</h3>
              <img
                src="https://via.placeholder.com/300x200"
                alt="Sponsored Product"
                className="rounded-lg mb-3"
              />
              <p className="font-medium">Premium Headphones</p>
              <p className="text-sm text-gray-500 mb-3">Only ₹4,999</p>
              <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg w-full hover:bg-indigo-700">
                Shop Now
              </button>
            </div>
            <span className="text-xs text-right">Sponsored</span>
          </div>
        </div>

        <RecentViewProducts />

      </main>
    );
  }
  