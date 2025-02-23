"use client"
import React, { useState } from 'react';
import { Eye, EyeOff, Loader2, Shield, Mail, User, Phone, Lock } from 'lucide-react';

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phoneNumber: ''
  });
  
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.email || !formData.password) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    if (!isLogin && !formData.name) {
      setError('Name is required for signup');
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 1500)); // simulate request
      console.log('Form submitted:', formData);
      setLoading(false);
    } catch {
      setError('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 p-6">
      <div className="w-full max-w-4xl flex rounded-lg overflow-hidden shadow-xl bg-gray-800">
        {/* Left side - Illustration */}
        <div className="hidden lg:flex lg:w-1/2 p-12 items-center justify-center relative">
          <div className="text-center">
            <Shield className="w-32 h-32 text-blue-400 mx-auto mb-8" />
            <h2 className="text-3xl font-bold text-white mb-4">
              {isLogin ? 'Welcome Back!' : 'Join Our Community'}
            </h2>
            <p className="text-gray-300 text-lg">
              {isLogin 
                ? 'Secure access to your account' 
                : 'Create an account to get started'}
            </p>
            <div className="absolute bottom-8 left-0 right-0 text-center">
              <p className="text-blue-400 text-sm">
                Powered by Advanced Security
              </p>
            </div>
          </div>
        </div>

        {/* Right side - Form */}
        <div className="flex-1 bg-gray-800 border-0 rounded-none p-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">
              {isLogin ? 'Sign In' : 'Create Account'}
            </h2>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-300">
                {isLogin ? 'Need an account?' : 'Have an account?'}
              </span>
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-blue-400 hover:text-blue-300"
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6 mt-6">
            {!isLogin && (
              <div className="space-y-2">
                <label htmlFor="name" className="text-gray-200">Name *</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="name"
                    name="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    className="pl-10 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 w-full p-3 rounded-md"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="email" className="text-gray-200">Email *</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-10 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 w-full p-3 rounded-md"
                />
              </div>
            </div>

            {!isLogin && (
              <div className="space-y-2">
                <label htmlFor="phoneNumber" className="text-gray-200">Phone Number (Optional)</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="pl-10 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 w-full p-3 rounded-md"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="password" className="text-gray-200">Password *</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-10 pr-10 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 w-full p-3 rounded-md"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-900 border-red-800 text-white p-3 rounded-md">
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  {isLogin ? 'Signing in...' : 'Creating account...'}
                </div>
              ) : (
                isLogin ? 'Sign In' : 'Create Account'
              )}
            </button>

            {isLogin && (
              <div className="text-center">
                <a href="#" className="text-sm text-blue-400 hover:text-blue-300">
                  Forgot your password?
                </a>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
