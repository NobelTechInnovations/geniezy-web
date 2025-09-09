// app/not-found.js
'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center p-8">
      <img src='https://t3.ftcdn.net/jpg/04/48/35/42/360_F_448354202_smYWUH7zQ4gvdqjXnWsHD4KrsuUARgQt.jpg' />
      <Link href="/" className="text-indigo-600 hover:underline">
        Go back home
      </Link>
    </div>
  );
}
