export function getCategoryRoute(category) {
  if (!category || !category.slug || !category._id) {
    return "/";
  }

  // special slugs → delivery-now
  const deliverySlugs = ["food", "grocery-fresh"];

  if (deliverySlugs.includes(category.slug)) {
    return `/delivery-now/${category.slug}?gc_id=${category._id}`;
  }

  // default route
  return `/gc/${category.slug}?gc_id=${category._id}`;
}
