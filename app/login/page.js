'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import axios from 'axios';
import { loginStart, loginSuccess, loginFailure } from '../redux/features/authSlice';

const LoginPage = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [error, setError] = useState('');
  
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    setError('');
    dispatch(loginStart());
    try {
      const response = await axios.post('/api/auth/send-otp', { phoneNumber });
      if (response.data.success) {
        setShowOtpInput(true);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to send OTP');
      dispatch(loginFailure(error.response?.data?.message || 'Failed to send OTP'));
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError('');
    dispatch(loginStart());
    try {
      const response = await axios.post('/api/auth/verify-otp', { phoneNumber, otp });
      if (response.data.success) {
        dispatch(loginSuccess(response.data.user));
        router.push('/');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Invalid OTP');
      dispatch(loginFailure(error.response?.data?.message || 'Invalid OTP'));
    }
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
       
        <h2 className="text-lg mb-2">Login or Create Account</h2>
        <p className="text-sm  mb-2">Enter your phone number</p>
        {error && (
          <div className="bg-red-50 border border-red-200 text-xs text-red-600 px-4 py-2 rounded w-full mb-2 text-center" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        {!showOtpInput ? (
          <form onSubmit={handlePhoneSubmit} className="w-full flex flex-col gap-4">
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
          <form onSubmit={handleOtpSubmit} className="w-full flex flex-col gap-4">
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter OTP"
              required
              pattern="[0-9]{6}"
              title="Please enter the 6-digit OTP"
              maxLength="6"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 rounded-md bg-gray-900 text-white font-bold text-xs hover:bg-gray-800 transition disabled:opacity-50"
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
      </div>
    </div>
  );
};

export default LoginPage; 