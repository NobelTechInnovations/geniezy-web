'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import ProductHorizontal from '@/components/elements/products/ProductHorizontal';
import useGetProducts from '@/hooks/useGetProducts';

const NewArrivals = ({ collectionSlug }) => {
    const { productItems, loading, getProductsByCollection } = useGetProducts();
    useEffect(() => {
        getProductsByCollection(collectionSlug);
    }, [collectionSlug]);

    // Views
    let productItemView;
    if (!loading) {
        if (productItems && productItems.length > 0) {
            productItemView = productItems.map((item) => (
                <div
                    className="col-xl-3 col-lg-4 col-md-4 col-sm-6 col-12 "
                    key={item.id}>
                    <ProductHorizontal product={item} />
                </div>
            ));
        } else {
            productItemView = <p>No product found.</p>;
        }
    } else {
        productItemView = <p>Loading...</p>;
    }
    return (
        <div className="ps-product-list ps-new-arrivals">
            <div className="ps-container">
                <div className="ps-section__header">
                    <h3>Hot New Arrivals</h3>
                    <ul className="ps-section__links">
                        <li>
                            <Link href="/shop" className="category-link">
                                Technologies
                            </Link>
                        </li>
                        <li>
                            <Link href="/shop" className="category-link">
                                Electronic
                            </Link>
                        </li>
                        <li>
                            <Link href="/shop" className="category-link">
                                Furnitures
                            </Link>
                        </li>
                        <li>
                            <Link href="/shop" className="category-link">
                                Clothing & Apparel
                            </Link>
                        </li>
                        <li>
                            <Link href="/shop?category=health-and-beauty" className="category-link">
                                Health & Beauty
                            </Link>
                        </li>
                        <li>
                            <Link href="/shop" className="category-link">
                                View All
                            </Link>
                        </li>
                    </ul>
                </div>
                <div className="ps-section__content">
                    <div className="row">{productItemView}</div>
                </div>
            </div>
        </div>
    );
};

export default NewArrivals;
