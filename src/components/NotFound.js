import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <Helmet>
        <title>Page Not Found | TimingoTech</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="text-center p-8">
        <h1 className="text-6xl font-black text-gray-900 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-6">Page not found — the link may be broken or the page removed.</p>
        <div className="flex justify-center gap-4">
          <Link to="/" className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold">Go Home</Link>
          <Link to="/contact" className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold">Contact Us</Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
