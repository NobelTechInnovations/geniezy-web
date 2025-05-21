'use client';

import React from 'react';

const SkeletonProduct = () => {
    return (
        <div className="ps-skeleton ps-skeleton--product">
            <div className="ps-skeleton__thumbnail"></div>
            <div className="ps-skeleton__content">
                <div className="row">
                    <div className="col-md-4">
                        <div className="ps-skeleton__rating"></div>
                    </div>
                </div>
                <div className="ps-skeleton__title"></div>
                <div className="ps-skeleton__price"></div>
                <div className="ps-skeleton__categories"></div>
                <div className="ps-skeleton__footer"></div>
            </div>
        </div>
    );
};

export default SkeletonProduct;
