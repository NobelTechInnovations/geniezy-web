import RecentViewProducts from "../components/home/RecentViewProducts";
import Link from "next/link";
import Image from "next/image";

export default function OrdersPage() {
  return (
    <main className="container mx-auto flex flex-col bg-white">
      <div className="flex w-6xl my-4 mx-auto gap-4">
        {/* Orders Section */}
        <div className="flex flex-col gap-4 w-2/3">
          {/* Example Order Card */}
          <div className="rounded-xl p-4 border border-gray-100 flex flex-col md:flex-row justify-between gap-6">
            {/* Left: Order Info */}
            <div className="flex-1">
            <h2 className="font-semibold text-lg">Order #12345</h2>
              <p className="text-gray-500 text-sm mt-1">
                Placed on: 10 Sept 2025
              </p>
              <div className="mt-3 text-sm">
                <p>Item: Wireless Earbuds</p>
                <p>Price: ₹1,499</p>
              </div>
              <Link
                href="/orders/43435t453e4"
                className="text-sm underline mt-2 inline-block"
              >
                View full details
              </Link>
            </div>

            {/* Right: Action Buttons */}
            <div className="flex flex-col gap-2 w-full md:w-48">
            <div className="flex justify-end items-center">
               
                <span className="bg-yellow-100 text-yellow-700 px-3 text-xs py-1 rounded-full">
                  Pending
                </span>
              </div>

              <a
                href="/orders/43435t453e4"
                className=" px-2 py-1 text-right underline text-xs hover:bg-gray-50"
              >
                Write a product review
              </a>
              <button className=" px-2 py-1 text-right underline text-xs hover:bg-gray-50">
                Get support
              </button>
              <button className=" px-2 py-1 text-right underline text-xs hover:bg-gray-50">
                Submit seller rating
              </button>
            </div>
          </div>
        </div>

        {/* Sponsored Product */}
        <div className="w-1/3">
          <div className="p-3 bg-gray-50 rounded-xl shadow-sm">
            <h3 className="font-semibold text-lg mb-3">Samsung</h3>
            <Image
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
          <span className="text-xs block text-right mt-1">Sponsored</span>
        </div>
      </div>

      {/* Recently Viewed Section */}
      <RecentViewProducts />
    </main>
  );
}
