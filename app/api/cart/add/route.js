import { NextResponse } from 'next/server';
import api from '@/app/redux/services/apiService';

export async function POST(request) {
  try {
    const body = await request.json();
    const { gspin, pid, p_sku, type, quantity } = body;

    if (!gspin || !pid) {
      return NextResponse.json(
        { success: false, message: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Call the cart API
    const response = await api.post('/v1/shop/cart/add', {
      gspin,
      pid,
      p_sku,
      type,
      quantity
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error adding to cart:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error.response?.data?.message || 'Failed to add item to cart' 
      },
      { status: error.response?.status || 500 }
    );
  }
} 