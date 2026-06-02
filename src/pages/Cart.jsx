import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CanteenContext } from '../context/CanteenContext';

const Cart = () => {
  const { cart, addToCart, removeFromCart, updateCartQuantity, clearCart, placeOrder, currentUser } = useContext(CanteenContext);
  const navigate = useNavigate();

  const RAZORPAY_KEY_ID = 'rzp_test_SwkeQzJxupXcSa';

  const [pickupTime, setPickupTime] = useState('As soon as possible (10-15 mins)');
  const [paymentMethod, setPaymentMethod] = useState('Pay at Counter');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [placedOrderDetails, setPlacedOrderDetails] = useState(null);

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = Math.round(cartTotal * 0.05); // 5% CGST/SGST mockup
  const platformFee = 5; // 5 rupees convenience charge
  const grandTotal = cartTotal + tax + platformFee;

  const pickupSlots = [
    'As soon as possible (10-15 mins)',
    'Morning Short Break (11:15 AM)',
    'Lunch Recess - Slot A (1:00 PM)',
    'Lunch Recess - Slot B (1:30 PM)',
    'Evening Snack Hour (3:45 PM)',
    'Evening Shift Departure (5:15 PM)'
  ];

  // Confirm order after successful payment (or counter pay)
  const confirmOrder = (method) => {
    const order = placeOrder(pickupTime, method);
    setPlacedOrderDetails(order);
    setIsProcessing(false);
    setShowSuccessModal(true);
  };

  const handleCheckout = (e) => {
    e.preventDefault();
    if (cart.length === 0) return;

    // --- Pay at Counter: mock flow ---
    if (paymentMethod === 'Pay at Counter') {
      setIsProcessing(true);
      setTimeout(() => confirmOrder('Pay at Counter'), 1200);
      return;
    }

    // --- Razorpay: UPI / Card / Net Banking ---
    if (!window.Razorpay) {
      alert('Payment gateway failed to load. Please refresh the page and try again.');
      return;
    }

    setIsProcessing(true);

    const options = {
      key: RAZORPAY_KEY_ID,
      amount: grandTotal * 100, // in paise
      currency: 'INR',
      name: 'CampusBites',
      description: `Pre-Order — ${cart.length} item(s) | Pickup: ${pickupTime}`,
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=100&h=100&fit=crop',
      prefill: {
        name: currentUser?.name || 'Student',
        contact: '',
        email: '',
      },
      notes: {
        pickup_slot: pickupTime,
        student_roll: currentUser?.rollNo || 'GUEST',
      },
      theme: {
        color: '#f97316', // CampusBites orange
        backdrop_color: '#0f172a',
      },
      modal: {
        ondismiss: () => {
          setIsProcessing(false);
        },
      },
      handler: function (response) {
        // Payment succeeded — response contains razorpay_payment_id
        confirmOrder(`UPI/Card (${response.razorpay_payment_id})`);
      },
    };

    const rzp = new window.Razorpay(options);

    rzp.on('payment.failed', function (response) {
      setIsProcessing(false);
      alert(`Payment failed: ${response.error.description}. Please try again.`);
    });

    rzp.open();
  };

  const closeSuccessAndRedirect = () => {
    setShowSuccessModal(false);
    navigate('/orders');
  };

  if (cart.length === 0 && !showSuccessModal) {
    return (
      <div className="max-w-md mx-auto text-center py-16 px-4 space-y-6">
        <div className="w-24 h-24 bg-orange-50 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto text-4xl text-orange-400">
          🛒
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Your Cart is Empty</h2>
          <p className="text-xs text-slate-400 dark:text-slate-550 mt-1.5 max-w-xs mx-auto">
            You haven't added any meals yet. Explore our delicious daily campus specials and select your favorites!
          </p>
        </div>
        <Link
          to="/"
          className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs uppercase px-6 py-3 rounded-xl shadow-lg shadow-orange-500/20 transition-all duration-200"
        >
          Explore Food Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight leading-none margin-y-0">
          Checkout Cart
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Review your items, schedule your exact pickup slot, and choose a secure mock payment.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Cart Items List */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 space-y-6">
            
            <div className="flex items-center justify-between border-b border-slate-50 dark:border-slate-900/50 pb-4">
              <h3 className="font-extrabold text-slate-850 dark:text-white">Selected Dishes</h3>
              <button 
                onClick={clearCart}
                className="text-xs font-bold text-slate-400 hover:text-red-500 transition-colors uppercase tracking-wider"
              >
                Clear All
              </button>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-900/50">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-4 py-4 first:pt-0 last:pb-0 group">
                  <img 
                    src={item.imgpath} 
                    alt={item.name} 
                    className="w-16 h-16 rounded-xl object-cover border border-slate-100 dark:border-slate-800 bg-slate-50"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <h4 className="font-extrabold text-sm text-slate-805 dark:text-slate-100 leading-snug group-hover:text-orange-500 transition-colors">
                          {item.name}
                        </h4>
                        <span className={`inline-block w-2 h-2 rounded-full border border-white mt-1 ${item.isVeg ? 'bg-emerald-500' : 'bg-red-500'}`} />
                      </div>
                      <span className="font-black text-sm text-slate-800 dark:text-slate-100">
                        ₹{item.price * item.quantity}
                      </span>
                    </div>

                    <div className="flex justify-between items-center mt-2">
                      <div className="flex items-center gap-2.5 bg-slate-50 dark:bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-100 dark:border-slate-800">
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-slate-500 dark:text-slate-400 font-black hover:text-orange-500 transition"
                        >
                          -
                        </button>
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 min-w-[12px] text-center">
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => addToCart(item)}
                          className="text-slate-500 dark:text-slate-400 font-black hover:text-orange-500 transition"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => updateCartQuantity(item.id, 0)}
                        className="text-xs text-slate-400 hover:text-red-500 transition font-bold"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* Right Side: Order Summary, Pickup Slot, and Mock Payment */}
        <div className="lg:col-span-5 space-y-6">
          
          <form onSubmit={handleCheckout} className="space-y-6">
            
            {/* Scheduled Pickup Time Card */}
            <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 space-y-4">
              <h3 className="font-extrabold text-sm text-slate-800 dark:text-white uppercase tracking-wider border-b border-slate-50 dark:border-slate-900/50 pb-3">
                🕒 Scheduled Pickup Time
              </h3>
              <div className="space-y-2">
                <label htmlFor="pickup-slot" className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                  Select Recess/Break Slot
                </label>
                <select
                  id="pickup-slot"
                  value={pickupTime}
                  onChange={(e) => setPickupTime(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm font-semibold dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                >
                  {pickupSlots.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 leading-normal">
                💡 Canteen staff starts fresh food cooking exactly 10 minutes before your slot to serve it scorching hot!
              </p>
            </div>

            {/* Payment Options Card */}
            <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 space-y-4">
              <h3 className="font-extrabold text-sm text-slate-800 dark:text-white uppercase tracking-wider border-b border-slate-50 dark:border-slate-900/50 pb-3">
                💳 Payment Method
              </h3>

              <div className="space-y-3">

                {/* Pay at Counter */}
                <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition ${
                  paymentMethod === 'Pay at Counter'
                    ? 'border-orange-500 bg-orange-50/10 dark:bg-orange-950/5'
                    : 'border-slate-100 dark:border-slate-900 hover:bg-slate-50 dark:hover:bg-slate-900'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    value="Pay at Counter"
                    checked={paymentMethod === 'Pay at Counter'}
                    onChange={() => setPaymentMethod('Pay at Counter')}
                    className="accent-orange-500"
                  />
                  <div>
                    <div className="text-sm font-bold text-slate-800 dark:text-slate-200">💵 Pay at Counter</div>
                    <div className="text-[11px] text-slate-400">Generate receipt now, pay cash/card when collecting.</div>
                  </div>
                </label>

                {/* Razorpay — UPI / Cards / Net Banking */}
                <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition ${
                  paymentMethod === 'Razorpay'
                    ? 'border-orange-500 bg-orange-50/10 dark:bg-orange-950/5'
                    : 'border-slate-100 dark:border-slate-900 hover:bg-slate-50 dark:hover:bg-slate-900'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    value="Razorpay"
                    checked={paymentMethod === 'Razorpay'}
                    onChange={() => setPaymentMethod('Razorpay')}
                    className="accent-orange-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-bold text-slate-800 dark:text-slate-200">📱 UPI / Cards / Net Banking</div>
                      <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400">Live</span>
                    </div>
                    <div className="text-[11px] text-slate-400">Pay securely via Google Pay, PhonePe, Paytm, Cards &amp; more.</div>
                    {/* Payment logos */}
                    <div className="flex gap-1.5 mt-1.5 text-[10px] text-slate-400 font-bold">
                      <span className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded">GPay</span>
                      <span className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded">PhonePe</span>
                      <span className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded">Paytm</span>
                      <span className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded">Visa/MC</span>
                    </div>
                  </div>
                </label>

              </div>

              {/* Powered by Razorpay badge */}
              {paymentMethod === 'Razorpay' && (
                <p className="text-[10px] text-slate-400 text-center mt-1">
                  🔒 Secured &amp; Powered by{' '}
                  <span className="font-black text-slate-600 dark:text-slate-300">Razorpay</span>
                </p>
              )}
            </div>

            {/* Price Calculations Card */}
            <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 space-y-4">
              <h3 className="font-extrabold text-sm text-slate-800 dark:text-white uppercase tracking-wider border-b border-slate-50 dark:border-slate-900/50 pb-3">
                🧾 Order Summary
              </h3>

              <div className="space-y-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
                <div className="flex justify-between">
                  <span>Items Subtotal</span>
                  <span className="text-slate-800 dark:text-slate-200">₹{cartTotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Pantry GST Tax (5%)</span>
                  <span className="text-slate-800 dark:text-slate-200">₹{tax}</span>
                </div>
                <div className="flex justify-between">
                  <span>Convenience Fee</span>
                  <span className="text-slate-800 dark:text-slate-200">₹{platformFee}</span>
                </div>
                
                <div className="border-t border-slate-50 dark:border-slate-900/50 pt-3 mt-3 flex justify-between text-sm font-black text-slate-850 dark:text-white">
                  <span>Grand Total</span>
                  <span className="text-orange-500 text-lg">₹{grandTotal}</span>
                </div>
              </div>

              {/* Action checkout button */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-xs uppercase py-3.5 rounded-xl shadow-lg shadow-orange-500/20 active:scale-98 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    {paymentMethod === 'Razorpay' ? 'Opening Payment Gateway...' : 'Processing Order...'}
                  </>
                ) : paymentMethod === 'Razorpay' ? (
                  `Pay ₹${grandTotal} via Razorpay →`
                ) : (
                  `Confirm Pre-Order (₹${grandTotal})`
                )}
              </button>
            </div>

          </form>

        </div>

      </div>

      {/* Checkout Success Modal Overlay */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 max-w-md w-full shadow-2xl text-center space-y-6 animate-scale-up">
            
            {/* Animated Ring Checkmark */}
            <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/50 rounded-full flex items-center justify-center mx-auto text-4xl text-emerald-500 shadow-inner">
              ✓
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Pre-Order Successful!</h2>
              <p className="text-xs text-slate-400 dark:text-slate-500 max-w-xs mx-auto">
                Your order is registered with the kitchen and assigned a visual pick-up token.
              </p>
            </div>

            {placedOrderDetails && (
              <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-4 border border-slate-100 dark:border-slate-800 space-y-2 text-xs text-left">
                <div className="flex justify-between">
                  <span className="text-slate-400 font-bold">Order ID:</span>
                  <span className="font-extrabold text-slate-800 dark:text-slate-200">{placedOrderDetails.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-bold">Scheduled Pickup:</span>
                  <span className="font-extrabold text-orange-500">{placedOrderDetails.pickupTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-bold">Total Paid:</span>
                  <span className="font-extrabold text-slate-800 dark:text-slate-200">₹{placedOrderDetails.total + tax + platformFee}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-bold">Method:</span>
                  <span className="font-extrabold text-slate-800 dark:text-slate-200">{placedOrderDetails.paymentMethod}</span>
                </div>
              </div>
            )}

            <button
              onClick={closeSuccessAndRedirect}
              className="w-full bg-slate-900 hover:bg-slate-850 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-extrabold text-xs uppercase py-3 rounded-xl shadow-md transition-all active:scale-98"
            >
              Track Order Status
            </button>
            
          </div>
        </div>
      )}

    </div>
  );
};

export default Cart;
