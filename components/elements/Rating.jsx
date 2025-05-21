'use client';

import React from 'react';

const Rating = ({ rating = 0 }) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars.push(<i key={i} className="fa fa-star"></i>);
        } else {
            stars.push(<i key={i} className="fa fa-star-o"></i>);
        }
    }
    
    return <span className="ps-rating">{stars}</span>;
};

export default Rating;