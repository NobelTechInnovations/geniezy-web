'use client';

import axios from 'axios';

export const baseUrl = 'https://api-geniezy.example.com';

export const customHeaders = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
};

export const Repository = axios.create({
    baseURL: baseUrl,
    headers: customHeaders,
});

export const serializeQuery = (query) => {
    return Object.keys(query)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(query[key])}`)
        .join('&');
};
