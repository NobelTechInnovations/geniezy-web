import React, { useState } from 'react';
import ProductRepository from '@/repositories/ProductRepository';
import { useCookies } from 'react-cookie';
import { useDispatch } from 'react-redux';
import {
    setCompareItems,
    setWishlistTtems,
    setCartItems,
} from '@/store/ecomerce/action';

export default function useEcomerce() {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [cookies, setCookie] = useCookies(['cart', 'wishlist', 'compare']);
    const [products, setProducts] = useState([]);

    const updateCookieAndStore = (group, items) => {
        setCookie(group, items, { path: '/' });

        switch (group) {
            case 'cart':
                dispatch(setCartItems(items));
                break;
            case 'wishlist':
                dispatch(setWishlistTtems(items));
                break;
            case 'compare':
                dispatch(setCompareItems(items));
                break;
        }
    };

    const getProducts = async (payload, group = '') => {
        setLoading(true);
        if (payload && payload.length > 0) {
            const queryString = payload.map((item) => `id_in=${item.id}`).join('&');
            const responseData = await ProductRepository.getProductsByIds(queryString);

            if (responseData && responseData.length > 0) {
                if (group === 'cart') {
                    const cartItems = responseData.map((item) => {
                        const match = payload.find((p) => p.id === item.id);
                        return {
                            ...item,
                            quantity: match?.quantity || 1,
                        };
                    });
                    setProducts(cartItems);
                } else {
                    setProducts(responseData);
                }
            } else {
                setProducts([]);
            }
        } else {
            setProducts([]);
        }
        setTimeout(() => setLoading(false), 250);
    };

    const increaseQty = (product, currentCart = []) => {
        const updatedCart = currentCart.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
        updateCookieAndStore('cart', updatedCart);
        return updatedCart;
    };

    const decreaseQty = (product, currentCart = []) => {
        const updatedCart = currentCart.map((item) =>
            item.id === product.id && item.quantity > 1
                ? { ...item, quantity: item.quantity - 1 }
                : item
        );
        updateCookieAndStore('cart', updatedCart);
        return updatedCart;
    };

    const addItem = (newItem, items = [], group) => {
        let updatedItems = [...items];
        const index = updatedItems.findIndex((item) => item.id === newItem.id);

        if (index !== -1) {
            if (group === 'cart') {
                updatedItems[index].quantity += newItem.quantity;
            }
        } else {
            updatedItems.push(newItem);
        }

        updateCookieAndStore(group, updatedItems);
        return updatedItems;
    };

    const removeItem = (selectedItem, items = [], group) => {
        const updatedItems = items.filter((item) => item.id !== selectedItem.id);
        updateCookieAndStore(group, updatedItems);
        return updatedItems;
    };

    const removeItems = (group) => {
        updateCookieAndStore(group, []);
    };

    return {
        loading,
        products,
        getProducts,
        increaseQty,
        decreaseQty,
        addItem,
        removeItem,
        removeItems,
    };
}
