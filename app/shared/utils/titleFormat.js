import Link from 'next/link';

export const slugify = (str) => {
  return encodeURIComponent(
    str
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')     // Remove special characters
      .replace(/\s+/g, '-')             // Replace spaces with hyphens
  );
}