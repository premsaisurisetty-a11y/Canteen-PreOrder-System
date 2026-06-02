import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { CanteenContext } from '../context/CanteenContext';

const Cart = () => {
  const { cart, addToCart, removeFromCart, updateCartQuantity, clearCart, placeOrder, currentUser } = useContext(CanteenContext);
  const navigate = useNavigate();

  const [pickupTime, setPickupTime] = useState('As soon as possible (10-15 mins)');
  const [paymentMethod, setPaymentMethod] = useState('Pay at Counter');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [placedOrderDetails, setPlacedOrderDetails] = useState(null);

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = Math.round(cartTotal * 0.05);
  const platformFee = 5;
  const grandTotal = cartTotal + tax + platformFee;

  const pickupSlots = [
    'As soon as possible (10-15 mins)',
    'Morning Short Break (11:15 AM)',
    'Lunch Recess - Slot A (1:00 PM)',
    'Lunch Recess - Slot B (1:30 PM)',
    'Evening Snack Hour (3:45 PM)',
    'Evening Shift Departure (5:15 PM)'
  ];

  const confirmOrder = (method) => {
    const order = placeOrder(pickupTime, method);
    setPlacedOrderDetails(order);
    setIsProcessing(false);
    setShowSuccessModal(true);
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return;

    if (paymentMethod === 'Pay at Counter') {
      setIsProcessing(true);
      setTimeout(() => confirmOrder('Pay at Counter'), 1200);
      return;
    }

    // Cashfree
    setIsProcessing(true);
    try {
      const cfOrderId = 'CB-' + Date.now();
      const savedTotal = grandTotal;

      const res = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: savedTotal,
          orderId: cfOrderId,
          customerName: currentUser?.name || 'Student',
        }),
      });

      const data = await res.json();

      if (!data.payment_session_id) {
        throw new Error(data.error || 'Could not initialize payment.');
      }

      placeOrder(pickupTime, 'Cashfree');

      const cashfree = window.Cashfree({ mode: 'sandbox' });
      cashfree.checkout({
        paymentSessionId: data.payment_session_id,
        returnUrl: window.location.origin + '/orders?cf_status={order_status}&cf_id=' + cfOrderId,
      });
    } catch (err) {
      setIsProcessing(false);
      alert('Payment error: ' + err.message);
    }
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

                {/* Cashfree */}
                <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition ${
                  paymentMethod === 'Cashfree'
                    ? 'border-orange-500 bg-orange-50/10 dark:bg-orange-950/5'
                    : 'border-slate-100 dark:border-slate-900 hover:bg-slate-50 dark:hover:bg-slate-900'
                }`}>
                  <input type="radio" name="payment" value="Cashfree"
                    checked={paymentMethod === 'Cashfree'}
                    onChange={() => setPaymentMethod('Cashfree')}
                    className="accent-orange-500" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-bold text-slate-800 dark:text-slate-200">💸 Pay Online</div>
                      <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400">Secure</span>
                    </div>
                    <div className="text-[11px] text-slate-400">UPI, Debit/Credit Cards, Net Banking via Cashfree.</div>
                    <div className="flex gap-1.5 mt-1.5 text-[10px] text-slate-400 font-bold">
                      <span className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded">GPay</span>
                      <span className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded">PhonePe</span>
                      <span className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded">Visa</span>
                      <span className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded">Mastercard</span>
                    </div>
                  </div>
                </label>

              </div>
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
                    {paymentMethod === 'Cashfree' ? 'Opening Cashfree...' : 'Processing...'}
                  </>
                ) : paymentMethod === 'Cashfree' ? (
                  `🔒 Pay ₹${grandTotal} via Cashfree →`
                ) : (
                  `Confirm Pre-Order (₹${grandTotal})`
                )}
              </button>
            </div>

          </form>

        </div>

      </div>



      {/* ✅ Full-Screen Order Confirmation Overlay */}
      {showSuccessModal && placedOrderDetails && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          
          {/* Floating confetti dots */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(18)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 rounded-full opacity-60 animate-bounce"
                style={{
                  left: `${(i * 37 + 5) % 100}%`,
                  top: `${(i * 53 + 10) % 90}%`,
                  backgroundColor: ['#f97316','#10b981','#3b82f6','#f59e0b','#8b5cf6','#ef4444'][i % 6],
                  animationDelay: `${(i * 0.15).toFixed(2)}s`,
                  animationDuration: `${1.2 + (i % 4) * 0.3}s`,
                }}
              />
            ))}
          </div>

          <div className="relative bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
            
            {/* Green header band */}
            <div className="bg-gradient-to-r from-emerald-500 to-green-400 px-8 pt-10 pb-16 text-center relative">
              {/* Pulsing ring checkmark */}
              <div className="relative w-20 h-20 mx-auto mb-4">
                <div className="absolute inset-0 bg-white/30 rounded-full animate-ping" />
                <div className="absolute inset-0 bg-white/20 rounded-full animate-ping" style={{ animationDelay: '0.3s' }} />
                <div className="relative w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <svg className="w-10 h-10 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight">Order Confirmed! 🎉</h2>
              <p className="text-emerald-100 text-xs mt-1 font-medium">Your pre-order is placed & sent to the kitchen</p>
            </div>

            {/* Ticket tear line */}
            <div className="relative h-0 flex items-center justify-between px-0 -mt-5 mb-0">
              <div className="w-10 h-10 bg-slate-950/80 rounded-full -ml-5" />
              <div className="flex-1 border-t-2 border-dashed border-slate-200 dark:border-slate-800 mx-2" />
              <div className="w-10 h-10 bg-slate-950/80 rounded-full -mr-5" />
            </div>

            {/* Ticket body */}
            <div className="px-8 pb-8 pt-6 space-y-5">

              {/* Order ID + QR side by side */}
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Order Token</p>
                  <p className="text-2xl font-black text-slate-800 dark:text-white leading-none">{placedOrderDetails.id}</p>
                  <div className="flex items-center gap-1.5 mt-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">Sent to Kitchen</span>
                  </div>
                </div>
                {/* Live QR */}
                <div className="bg-white p-2 rounded-xl border-2 border-emerald-200 shadow-md">
                  <QRCodeSVG
                    value={JSON.stringify({
                      id: placedOrderDetails.id,
                      student: placedOrderDetails.userName,
                      roll: placedOrderDetails.userRollNo,
                      total: grandTotal,
                      pickup: placedOrderDetails.pickupTime,
                    })}
                    size={80}
                    bgColor="#ffffff"
                    fgColor="#10b981"
                    level="M"
                  />
                  <p className="text-[8px] font-black text-center text-emerald-500 mt-1 tracking-widest uppercase">Show at Counter</p>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-dashed border-slate-200 dark:border-slate-800" />

              {/* Order details */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400 font-semibold">📅 Pickup Slot</span>
                  <span className="font-extrabold text-orange-500 text-right max-w-[180px]">{placedOrderDetails.pickupTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-semibold">💳 Payment</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300 text-right max-w-[200px] truncate">{placedOrderDetails.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-semibold">🧾 Items</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">{placedOrderDetails.items.length} item(s)</span>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-dashed border-slate-200 dark:border-slate-800" />

              {/* Items list */}
              <div className="space-y-1.5">
                {placedOrderDetails.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
                    <span>{item.name} <span className="text-slate-400">×{item.quantity}</span></span>
                    <span className="text-slate-800 dark:text-slate-200">₹{item.price * item.quantity}</span>
                  </div>
                ))}
                <div className="flex justify-between text-sm font-black text-slate-800 dark:text-white pt-2 border-t border-slate-100 dark:border-slate-900">
                  <span>Grand Total</span>
                  <span className="text-emerald-500">₹{grandTotal}</span>
                </div>
              </div>

              {/* CTA */}
              <button
                onClick={closeSuccessAndRedirect}
                className="w-full bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white font-extrabold text-sm py-3.5 rounded-2xl shadow-lg shadow-emerald-500/25 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                📍 Track My Order Live
              </button>

              <p className="text-center text-[10px] text-slate-400">
                Estimated prep starts 10 min before your pickup slot
              </p>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Cart;
