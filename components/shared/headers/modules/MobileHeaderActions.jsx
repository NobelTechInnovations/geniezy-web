import React from 'react';
import { connect } from 'react-redux';
import Link from 'next/link';
import AccountQuickLinksMobile from './AccountQuickLinksMobile';

const MobileHeaderActions = ({ auth, ecomerce }) => {
    const { cartItems } = ecomerce;

    return (
        <div className="navigation__right">
            <Link href="/account/shopping-cart" className="header__extra">
                <i className="icon-bag2"></i>
                <span>
                    <i>{cartItems ? cartItems.length : 0}</i>
                </span>
            </Link>

            {auth.isLoggedIn ? (
                <AccountQuickLinksMobile />
            ) : (
                <div className="header__extra">
                    <Link href="/account/login">
                        <i className="icon-user"></i>
                    </Link>
                </div>
            )}
        </div>
    );
};

export default connect((state) => state)(MobileHeaderActions);
