'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import useEcomerce from '@/hooks/useEcomerce';
import useProduct from '@/hooks/useProduct';
import { calculateAmount } from '@/utilities/ecomerce-helpers';
const PanelCartMobile = () => {
    const ecomerce = useSelector((state) => state.ecomerce);
    const { products, getProducts, removeItem } = useEcomerce();
    const { title, thumbnailImage } = useProduct();

    const handleRemoveCartItem = (e, product) => {
        e.preventDefault();
        removeItem(product, ecomerce.cartItems, 'cart');
    };

    useEffect(() => {
        if (ecomerce?.cartItems) {
            getProducts(ecomerce.cartItems);
        }
    }, [ecomerce?.cartItems]);

    let cartItemsView, footerView;

    if (products && products.length > 0) {
        const amount = calculateAmount(products);

        const items = products.map((item) => (
            <div className="ps-product--cart-mobile" key={item.id}>
                <div className="ps-product__thumbnail">
                    <Link href={`/product/${item.id}`}>
                        {thumbnailImage(item)}
                    </Link>
                </div>
                <div className="ps-product__content">
                    <button
                        className="ps-product__remove"
                        onClick={(e) => handleRemoveCartItem(e, item)}
                    >
                        <i className="icon-cross" />
                    </button>
                    {title(item)}
                    <Link href={`/product/${item.id}`} className="ps-product__title">
                        {item.title}
                    </Link>
                    <p>
                        <strong>Sold by:</strong> {item.vendor}
                    </p>
                    <small>
                        {item.quantity} x ${item.price}
                    </small>
                </div>
            </div>
        ));

        cartItemsView = <div className="ps-cart__items">{items}</div>;
        footerView = (
            <div className="ps-cart__footer">
                <h3>
                    Sub Total: <strong>${amount}</strong>
                </h3>
                <figure>
                    <Link href="/account/shopping-cart" className="ps-btn">
                        View Cart
                    </Link>
                    <Link href="/account/checkout" className="ps-btn">
                        Checkout
                    </Link>
                </figure>
            </div>
        );
    } else {
        cartItemsView = <p>Cart empty!</p>;
        footerView = (
            <div className="ps-cart__footer">
                <Link href="/shop" className="ps-btn ps-btn--fullwidth">
                    Shop now
                </Link>
            </div>
        );
    }

    return (
        <div className="ps-cart--mobile">
            <div className="ps-cart__content">
                {cartItemsView}
                {footerView}
            </div>
        </div>
    );
};

export default PanelCartMobile;
