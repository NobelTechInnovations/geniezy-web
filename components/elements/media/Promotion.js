'use client';

import React from 'react';
import Link from 'next/link';
import { baseUrl } from '@/repositories/Repository';

const Promotion = ({ link, image }) => {
    if (image) {
        return (
            <Link href={link} className="ps-collection">
                <img src={`${baseUrl}${image.url}`} alt="promotion" />
            </Link>
        );
    } else {
        return (
            <Link href={link} className="ps-collection">
                <img src="/static/img/not-found.jpg" alt="promotion" />
            </Link>
        );
    }
};

export default Promotion;
