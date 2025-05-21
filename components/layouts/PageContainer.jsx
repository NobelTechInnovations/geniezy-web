'use client';

import React from 'react';
import Head from 'next/head';
import HeaderElectronic from '@/components/shared/headers/HeaderElectronic';
import HeaderMobileElectronic from '@/components/shared/headers/HeaderMobileElectronic';
import FooterFullwidth from '@/components/shared/footers/FooterFullwidth';

const defaultHeaders = (
    <>
        <HeaderElectronic />
        <HeaderMobileElectronic />
    </>
);

const defaultFooters = (
    <>
        <FooterFullwidth />
    </>
);

const PageContainer = ({
    header = defaultHeaders,
    footer = defaultFooters,
    children,
    title = 'Page',
}) => {
    const baseTitle = process.env.NEXT_PUBLIC_TITLE || 'My Store';
    const titleDescription = process.env.NEXT_PUBLIC_TITLE_DESCRIPTION || 'Best products online';

    const titleView = title
        ? `${baseTitle} | ${title}`
        : `${baseTitle} | ${titleDescription}`;

    return (
        <>
            <Head>
                <title>{titleView}</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            {header}
            <main>{children}</main>
            {footer}
        </>
    );
};

export default PageContainer;
