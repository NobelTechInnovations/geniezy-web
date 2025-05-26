'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DeliveryNowPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to food category by default
    router.push('/delivery-now/food');
  }, [router]);

  return null;
} 