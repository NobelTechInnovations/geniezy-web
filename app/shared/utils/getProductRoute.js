import { slugify } from '@/app/shared/utils/titleFormat';

export function getProductRoute(product) {
  if (!product) return "/";

  const {
    product_id,
    title,
    _id,
    sku,
    type,
  } = product;

  if (!product_id || !title) return "/";

  const slug = slugify(title, { lower: true });

  // Optional: trigger top loader if available
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("toploader:show"));
  }

  return `/gspin/${product_id}/${slug}?pid=${_id}&p_sku=${sku}&type=${type}`;
}
