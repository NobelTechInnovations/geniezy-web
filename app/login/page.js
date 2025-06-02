'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import api from '../redux/services/apiService';
import { loginStart, loginSuccess, loginFailure } from '../redux/features/authSlice';
import { saveAuthToDB } from '../services/authDB';
import { getAnonymousId, clearAnonymousId } from '../services/browsingHistory/anonymousId';

const TOKEN_KEY = 'geniezy_token';
const USER_KEY = 'geniezy_user';
const EXPIRY_KEY = 'geniezy_token_expiry';

async function saveAuth(token, user) {
  await saveAuthToDB(token, user);
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  localStorage.setItem(EXPIRY_KEY, Date.now() + 30 * 24 * 60 * 60 * 1000);
  // Set minimal cookie for SSR/middleware
  document.cookie = 'isLoggedIn=true; path=/; max-age=2592000';
}

const LoginPage = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [profile, setProfile] = useState({ name: '', email: '' });
  const [token, setToken] = useState('');
  const dispatch = useDispatch();
  const router = useRouter();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  // OTP Request
  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    dispatch(loginStart());
    try {
      const response = await api.post('/v1/shop/auth/request-otp', { phone: phoneNumber });
      if (response.data.success) {
        setShowOtpInput(true);
      } else {
        setError(response.data.message || 'Failed to send OTP');
        dispatch(loginFailure(response.data.message || 'Failed to send OTP'));
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to send OTP');
      dispatch(loginFailure(error.response?.data?.message || 'Failed to send OTP'));
    }
    setLoading(false);
  };

  // OTP Verify
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    dispatch(loginStart());
    try {
      const anonId = getAnonymousId();
      const response = await api.post('/v1/shop/auth/verify-otp', { phone: phoneNumber, otp, anonId });
      if (response.data.success) {
        const { token, customer } = response.data.data;
        setToken(token);
        if (!customer.name) {
          setShowProfileForm(true);
        } else {
          await saveAuth(token, customer);
          dispatch(loginSuccess(customer));
          clearAnonymousId();
          router.push('/');
        }
      } else {
        setError(response.data.message || 'Invalid OTP');
        dispatch(loginFailure(response.data.message || 'Invalid OTP'));
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Invalid OTP');
      dispatch(loginFailure(error.response?.data?.message || 'Invalid OTP'));
    }
    setLoading(false);
  };

  // Profile Update for new users
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await api.put('/v1/shop/auth/update-profile', profile, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        const updatedUser = { ...response.data.data.customer, ...profile };
        await saveAuth(token, updatedUser);
        dispatch(loginSuccess(updatedUser));
        router.push('/');
      } else {
        setError(response.data.message || 'Failed to update profile');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update profile');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex-1 flex flex-col items-center justify-center">
      <Image
        src="/4.png"
        alt="Logo"
        width={120}
        height={40}
        className="mb-2"
      />
      <div className="w-full max-w-xs border border-gray-200 rounded-sm shadow-xs px-4 py-4 flex flex-col">
        {!showProfileForm ? (
          <>
            <h2 className="text-lg mb-2">Login or Create Account</h2>
            <p className="text-sm  mb-2">Enter your phone number</p>
            {error && (
              <div className="bg-red-50 border border-red-200 text-xs text-red-600 px-4 py-2 rounded w-full mb-2 text-center" role="alert">
                <span className="block sm:inline">{error}</span>
              </div>
            )}
            {!showOtpInput ? (
              <form onSubmit={handlePhoneSubmit} className="w-full flex flex-col gap-2">
                <input
                  type="tel"
                  id="phone"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full px-2 py-2 border bg-white text-xs border-gray-300 rounded-sm "
                  placeholder="Phone number"
                  required
                  pattern="[0-9]{10}"
                  title="Please enter a valid 10-digit phone number"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2 rounded-md bg-red-600 text-white font-bold text-xs hover:bg-red-700 transition disabled:opacity-50"
                >
                  {loading ? 'Sending...' : 'Continue'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleOtpSubmit} className="w-full flex flex-col gap-2">
                <input
                  type="text"
                  id="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-2 py-2 border bg-white text-xs border-gray-300 rounded-sm "
                  placeholder="Enter OTP"
                  required
                  pattern="[0-9]{6}"
                  title="Please enter the 6-digit OTP"
                  maxLength="6"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2 rounded-md bg-red-600 text-white font-bold text-xs hover:bg-red-700 transition disabled:opacity-50"
                >
                  {loading ? 'Verifying...' : 'Continue'}
                </button>
              </form>
            )}
            <p className="text-xs text-center text-gray-600 mt-4 mb-2">
              By continuing, you agree to Geniezy's{' '}
              <a href="#" className="text-indigo-600 underline">Terms of Use</a> and{' '}
              <a href="#" className="text-indigo-600 underline">Privacy Policy</a>.
            </p>
            <button
              className="w-full py-2 mt-2 border border-gray-400 rounded-md text-xs text-gray-900 bg-white hover:bg-gray-100 transition"
              type="button"
              onClick={() => alert('Account creation coming soon!')}
            >
              Create Account
            </button>
            <div className="flex justify-center gap-4 mt-6 text-xs text-gray-500 w-full">
              <a href="#" className="underline">Terms of Use</a>
              <a href="#" className="underline">Privacy Policy</a>
            </div>
            <div className="text-center text-xs text-gray-400 mt-2">
              © 2025 Geniezy. All rights reserved.
            </div>
          </>
        ) : (
          <form onSubmit={handleProfileSubmit} className="w-full flex flex-col gap-2">
            <h2 className="text-lg mb-2">Complete your profile</h2>
            <input
              type="text"
              placeholder="Full Name"
              className="w-full px-2 py-2 border bg-white text-xs border-gray-300 rounded-sm"
              value={profile.name}
              onChange={e => setProfile({ ...profile, name: e.target.value })}
              required
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full px-2 py-2 border bg-white text-xs border-gray-300 rounded-sm"
              value={profile.email}
              onChange={e => setProfile({ ...profile, email: e.target.value })}
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 rounded-md bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save & Continue'}
            </button>
            {error && (
              <div className="bg-red-50 border border-red-200 text-xs text-red-600 px-4 py-2 rounded w-full mt-2 text-center" role="alert">
                <span className="block sm:inline">{error}</span>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginPage; 