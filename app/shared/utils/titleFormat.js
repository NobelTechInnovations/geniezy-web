export const slugify = (str = '') => {
  if (typeof str !== 'string') return '';
  return encodeURIComponent(
    str
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-')         // Replace spaces with hyphens
  );
}
