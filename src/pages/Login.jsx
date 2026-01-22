import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { toast } from 'react-toastify';
import { registerUser, loginUser } from '../services/api';

const Login = () => {
  const [currentState, setCurrentState] = useState('Login');
  const { token, setToken, navigate } = useContext(ShopContext);

  // Form state
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  // Loading state
  const [loading, setLoading] = useState(false);

  /**
   * Handle form submission for both Login and Sign Up
   */
  const onSubmitHandler = async (event) => {
    event.preventDefault();

    // Prevent multiple submissions
    if (loading) return;

    setLoading(true);

    try {
      let response;

      if (currentState === 'Sign Up') {
        // Call register API
        response = await registerUser({ name, email, password });
      } else {
        // Call login API
        response = await loginUser({ email, password });
      }

      // Check if API call was successful
      if (response.success) {
        // Save token to context and localStorage
        setToken(response.token);
        localStorage.setItem('token', response.token);

        // Show success message
        toast.success(currentState === 'Sign Up' ? 'Account Created Successfully' : 'Login Successful');

        // Navigate to home page
        navigate('/');
      } else {
        // Show error message from API
        toast.error(response.message || 'Something went wrong');
      }
    } catch (error) {
      // Error handling is done by axios interceptor
      // But we can add additional logging here if needed
      console.error('Login/Register error:', error);
    } finally {
      // Reset loading state
      setLoading(false);
    }
  };

  /**
   * Redirect to home if already logged in
   */
  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, [token, navigate]);

  return (
    <form
      onSubmit={onSubmitHandler}
      className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800'
    >
      <div className='inline-flex items-center gap-2 mb-2 mt-10'>
        <p className='prata-regular text-3xl'>{currentState}</p>
        <hr className='border-none h-[1.5px] w-8 bg-gray-800' />
      </div>

      {/* Name field - only show for Sign Up */}
      {currentState === 'Sign Up' && (
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          type="text"
          className='w-full px-3 py-2 border border-gray-800'
          placeholder='Name'
          required
          disabled={loading}
        />
      )}

      {/* Email field */}
      <input
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        type="email"
        className='w-full px-3 py-2 border border-gray-800'
        placeholder='Email'
        required
        disabled={loading}
      />

      {/* Password field */}
      <input
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        type="password"
        className='w-full px-3 py-2 border border-gray-800'
        placeholder='Password'
        required
        disabled={loading}
      />

      {/* Forgot password and toggle links */}
      <div className='w-full flex justify-between text-sm mt-[-8px]'>
        <p className='cursor-pointer'>Forgot your password?</p>
        {currentState === 'Login' ? (
          <p
            onClick={() => !loading && setCurrentState('Sign Up')}
            className='cursor-pointer'
          >
            Create account
          </p>
        ) : (
          <p
            onClick={() => !loading && setCurrentState('Login')}
            className='cursor-pointer'
          >
            Login Here
          </p>
        )}
      </div>

      {/* Submit button with loading state */}
      <button
        type="submit"
        className='bg-black text-white font-light px-8 py-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed'
        disabled={loading}
      >
        {loading ? 'Please wait...' : (currentState === 'Login' ? 'Sign In' : 'Sign Up')}
      </button>
    </form>
  );
};

export default Login;