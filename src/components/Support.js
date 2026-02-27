import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

const Support = () => {
  const [amount, setAmount] = useState(0);
  const [paystackLoaded, setPaystackLoaded] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    script.onload = () => {
      setPaystackLoaded(true);
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const initializePayment = () => {
    const paystackPublicKey = 'pk_test_a7190862b89d8656b52a586c50ee3d5e89488fdf';

    if (window.PaystackPop && paystackLoaded) {
      const paymentHandler = window.PaystackPop.setup({
        key: paystackPublicKey,
        email: 'timingotech@gmail.com',
        amount: amount * 100,
        currency: 'NGN',
        ref: `${Math.floor(Math.random() * 1000000000)}`,
        onClose: () => {
          console.log('Payment closed');
        },
        callback: (response) => {
          console.log('Payment complete. Response:', response);
          // Handle successful payment response
        },
      });
      paymentHandler.openIframe();
    } else {
      console.error('Paystack has not loaded yet or an issue occurred.');
      // Handle the case where Paystack is not loaded or an issue occurred
    }
  };

  return (
    <div className='bg-[#F7F7FA]'>
      <Helmet>
        <title>Support Us - Timingotech | Make a Donation</title>
        <meta name="description" content="Support Timingotech's community initiatives and technological innovation. Your donation helps us continue building solutions that make a difference." />
        <meta name="keywords" content="support Timingotech, donate, community support, technology innovation" />
        <link rel="canonical" href="https://www.timingotech.com/support" />
      </Helmet>
      <div className="container p-8 mx-auto">
        <div className="mb-8 ">
          <h2 className="mb-4 text-2xl font-bold text-center hometext-gradient">Make a Donation and Support Our Community</h2>
          <p className="mb-4 text-lg text-center">Enter your donation amount:</p>
          <div className='md:ml-96'>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="px-4 py-2 mb-4 border border-gray-300 rounded"
            />
            <button
              onClick={initializePayment}
              className="px-4 py-2 font-bold text-white support-gradient focus:outline-none focus:shadow-outline"
            >
              Donate via Paystack
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
