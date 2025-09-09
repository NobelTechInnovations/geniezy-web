'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { FiSearch, FiHeart, FiShoppingBag, FiUser } from 'react-icons/fi';
import TopBar from './Topbar';
import LocationDropdown from '../common/LocationDropdown';
import { useCategories } from '../../hooks/useCategories';
import Search from '../Search';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '@/app/redux/features/authSlice';
import { clearAuthDB } from '../../services/authDB';
import { cartService } from '@/app/services/cart/cartService';
import SideDrawer from '../common/SideDrawer';
import { usePathname } from 'next/navigation';
import { clearCart } from '../../services/indexedDB';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { categories, loading } = useCategories();
  const [searchCategory, setSearchCategory] = useState('');
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null); // Ref for the menu container
  const [cartItems, setCartItems] = useState([]);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Effect to handle clicks outside the menu
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  // Effect to fetch cart items on mount and listen for updates
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await cartService.getCartItems();
        if (response.success && response.data?.items) {
          setCartItems(response.data.items);
        } else if (response.success && response.data?.cart) {
          // Handle new API response structure
          setCartItems(response.data.items || []);
        } else if (response.success && Array.isArray(response.data)) { // Handle IndexedDB structure
          setCartItems(response.data);
        } else {
          console.error('Failed to fetch cart items:', response.message);
          setCartItems([]);
        }
      } catch (error) {
        console.error('Error fetching cart items:', error);
        setCartItems([]);
      }
    };

    // Initial fetch
    fetchCartItems();

    // Listen for cart updates
    const handleCartUpdate = () => {
      fetchCartItems(); // Re-fetch cart when update event is dispatched
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('cartUpdate', handleCartUpdate);
    }

    // Cleanup listener
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('cartUpdate', handleCartUpdate);
      }
    };
  }, []); // Empty dependency array means this runs once on mount and cleans up on unmount

  // Effect to control cart drawer visibility based on route and cart items
  useEffect(() => {
    if (pathname === '/gp/cart' && cartItems.length > 0) {
      setIsCartDrawerOpen(true);
    } else {
      setIsCartDrawerOpen(false);
    }
  }, [pathname, cartItems.length]); // Re-run when route or cart item count changes

  const handleLogout = async () => {
    try {
      console.log('Cookies before logout:', document.cookie);
      // Clear localStorage
      ['geniezy_token', 'geniezy_user', 'geniezy_token_expiry'].forEach(key =>
        localStorage.removeItem(key)
      );
  
      // Clear cookie
      document.cookie = 'isLoggedIn=; path=/; max-age=0';
      document.cookie = 'token=; path=/; max-age=0'; // Clear token cookie for SSR
  
      console.log('Cookies after clearing isLoggedIn:', document.cookie);
  
      // Clear IndexedDB (wait for it to complete)
      await clearAuthDB();
      await clearCart(); // Clear cart from IndexedDB
  
      // Dispatch logout action
      dispatch(logout());
  
      // Redirect after everything is cleared
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
    }
    setShowMenu(false); // Close menu on logout
  };

  // Toggle menu visibility on click
  const handleMenuClick = () => {
    setShowMenu(!showMenu);
  };

  // Handle cart icon click
  const handleCartClick = () => {
    setIsCartDrawerOpen(true);
  };

  // Handle closing the cart drawer
  const handleCloseCartDrawer = () => {
    setIsCartDrawerOpen(false);
  };

  return (
    <header className="w-full bg-white">
      {/* Top Bar - Hidden on scroll */}
      <TopBar isScrolled={isScrolled} />

      {/* Middle Bar - Always visible, sticky on scroll */}
      <div className={`w-full bg-white py-2 transition-all duration-300 ${isScrolled ? 'fixed top-0 left-0 right-0 shadow-md z-50' : ''}`}>
        <div className="container-fluid mx-auto flex items-center px-4 justify-between items-center ">
          <Link href="/" className="mr-6">

            {/* <img src="/3.png" alt="Logo" width={100} height={100} /> */}
            <h1 className="text-xl font-bold">Snapzo</h1>

          </Link>

          <div className="flex-1 max-w-1xl mx-8">
            <div className="flex items-center">
              
              <Search />
              

            </div>
          </div>

          <div className="ml-auto">
            <LocationDropdown />
          </div>

          <div className="flex items-center space-x-6 ml-6">
            <Link href="/wishlist" className="relative">
              <FiHeart className="w-6 h-6 text-black" />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                0
              </span>
            </Link>
            {/* Cart Icon */}
            <div className="relative cursor-pointer" onClick={handleCartClick}>
              <FiShoppingBag className="w-6 h-6 text-black" />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {cartItems.length}
                </span>
              )}
            </div>
            <div className="flex items-center">
              <FiUser className="w-6 h-6 mr-2 text-black" />
              {isAuthenticated ? (
                <div
                  className="relative flex items-center"
                  onClick={handleMenuClick} // Open/close on click
                  ref={menuRef} // Attach ref to the container
                >
                  <span className="font-semibold cursor-pointer flex items-center">
                    {user?.name || user?.phone}
                    <svg className="inline ml-1 w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                  </span>
                  {showMenu && (
                    <div className="absolute top-full right-0 mt-1 w-32 bg-white border rounded shadow-lg z-50">
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col">
                  <Link href="/login" className="text-sm text-black">Log In</Link>
                  <Link href="/register" className="text-sm font-semibold text-black">Register</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Bar - Hidden on scroll */}
      <div className={`w-full bg-white border-t border-gray-200 transition-all duration-300 ${isScrolled ? 'h-0 overflow-hidden opacity-0' : 'h-auto opacity-100'}`}>

        <div className="container mx-auto max-w-7xl"> 
          <nav className="flex flex-wrap justify-center px-4 py-2 text-black">
            <Link href="/" className="whitespace-nowrap flex items-center hover:text-red-500 mr-8">
              <span className="text-sm font-semibold">Snapzo deals</span>

            </Link>
            {!loading && categories.slice(0, 7).map((category) => (
              <Link
                key={category._id}
                href={category.slug === 'food' || category.slug === 'grocery-fresh' 
                  ? `/delivery-now/${category.slug}?gc_id=${category._id}`
                  : `/gc/${category.slug}?gc_id=${category._id}`}
                className="whitespace-nowrap flex items-center text-sm font-medium hover:text-red-500 mr-8"
              >
                {category.name}
              </Link>
            ))}
            <Link href="/" className="whitespace-nowrap flex items-center hover:text-red-500 mr-8">
              <span className="text-sm font-semibold">Buy Again</span>
            </Link>
          </nav>
        </div>
      </div>

      {/* Cart Side Drawer */}
      <SideDrawer isOpen={isCartDrawerOpen} onClose={handleCloseCartDrawer} cartItems={cartItems} />


    </header>
  );
};

export default Header;
    