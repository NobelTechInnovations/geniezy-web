"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiHeart, FiX } from "react-icons/fi";
import { wishlistApi } from "../redux/services/apiService";
import { getProductRoute } from "../shared/utils/getProductRoute";
import { formatIndianPrice } from "../shared/utils/priceFormat";
import S3Image from "../shared/utils/S3Image";
import Skeleton from "../components/ui/Skeleton";
import { useToast } from "../components/ui/Toast";

/**
 * Minimal wishlist page (Phase 4, M9) — intentionally simple, per plan: a
 * grid of saved items with a remove action, not a full redesign. Renders
 * from Wishlist's own denormalized snapshot (title/image/price/sellerName)
 * rather than re-fetching each product, matching how the backend model
 * avoids a cross-database join on read.
 */
export default function WishlistPage() {
  const router = useRouter();
  const showToast = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("geniezy_token") : null;
    if (!token) {
      router.push("/login");
      return;
    }

    wishlistApi.list()
      .then((res) => {
        if (res.success) {
          setItems(res.data || []);
        } else {
          setError(res.message || "Failed to load wishlist");
        }
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          router.push("/login");
        } else {
          setError("Failed to load wishlist");
        }
      })
      .finally(() => setLoading(false));
  }, [router]);

  const handleRemove = async (item) => {
    // Optimistic — a wishlist remove failing silently and leaving a stale
    // card is a much smaller problem than blocking the UI on it.
    setItems((prev) => prev.filter((i) => i._id !== item._id));
    try {
      await wishlistApi.toggle({ productId: item.productId });
    } catch (err) {
      showToast("Could not remove item, please retry", "error");
      setItems((prev) => [item, ...prev]);
    }
  };

  return (
    <main className="max-w-6xl mx-auto px-4 py-6 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <FiHeart className="text-red-500" /> My Wishlist
      </h1>

      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-56" rounded="rounded-lg" />
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="text-red-500">{error}</div>
      )}

      {!loading && !error && items.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <FiHeart className="w-12 h-12 text-gray-300 mb-3" />
          <p className="text-gray-600 mb-4">Your wishlist is empty.</p>
          <Link href="/" className="text-brand font-semibold hover:underline">Continue shopping</Link>
        </div>
      )}

      {!loading && !error && items.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {items.map((item) => (
            <div key={item._id} className="relative border border-gray-100 rounded-lg p-2 flex flex-col">
              <button
                onClick={() => handleRemove(item)}
                aria-label="Remove from wishlist"
                className="absolute top-3 right-3 z-10 bg-white/90 rounded-full p-1 text-gray-500 hover:text-red-500 shadow"
              >
                <FiX className="w-4 h-4" />
              </button>
              <Link
                href={getProductRoute({
                  product_id: item.productId,
                  title: item.productDetails?.title,
                  _id: item.productId,
                  sku: item.sku,
                  type: item.type,
                })}
                className="flex flex-col flex-1"
              >
                <div className="border border-gray-100 rounded-lg p-2 mb-2">
                  <S3Image
                    src={item.productDetails?.image || "https://placehold.co/300"}
                    alt={item.productDetails?.title || "Product"}
                    className="w-full h-full aspect-square object-contain"
                  />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-1">
                  {item.productDetails?.title}
                </h3>
                {item.productDetails?.price != null && (
                  <span className="text-md font-semibold text-gray-800">
                    {formatIndianPrice(item.productDetails.price)}
                  </span>
                )}
                {item.productDetails?.sellerName && (
                  <span className="text-xs text-gray-500 mt-1">Sold by {item.productDetails.sellerName}</span>
                )}
              </Link>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
