import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { CanteenContext } from '../context/CanteenContext';

const Orders = () => {
  const { orders, updateOrderStatus, currentUser } = useContext(CanteenContext);

  // Only show orders belonging to the currently logged-in user
  const userOrders = orders.filter(o => o.userRollNo === currentUser?.rollNo);

  const activeOrders = userOrders.filter(o => o.status !== "Completed");
  const pastOrders = userOrders.filter(o => o.status === "Completed");

  // Status mapping details
  const statusConfig = {
    Placed: { index: 1, label: "Placed", color: "text-blue-500 bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-900/50", desc: "Awaiting kitchen approval" },
    Preparing: { index: 2, label: "Preparing", color: "text-amber-500 bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-900/50 animate-pulse", desc: "Chef is frying & cooking fresh" },
    Ready: { index: 3, label: "Ready to Pick Up", color: "text-emerald-500 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-900/50 animate-bounce", desc: "Proceed to counter, show ticket QR" },
    Completed: { index: 4, label: "Completed", color: "text-slate-500 bg-slate-50 border-slate-200 dark:bg-slate-900 dark:border-slate-800", desc: "Successfully picked up & enjoyed" }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight leading-none margin-y-0">
          Your Pre-Orders Queue
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Track active kitchen status in real-time and view digital food voucher QR tickets.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 p-12 text-center space-y-4">
          <div className="w-16 h-16 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto text-slate-400 text-3xl">
            📋
          </div>
          <div>
            <h4 className="font-bold text-slate-700 dark:text-slate-300">No Pre-Orders Placed Yet</h4>
            <p className="text-xs text-slate-450 mt-1 max-w-xs mx-auto">
              Go to the menu, add your favorite snacks to your cart, and place your first pre-order to track it here!
            </p>
          </div>
          <Link
            to="/"
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs uppercase px-5 py-2.5 rounded-xl shadow-md transition-all active:scale-95"
          >
            Browse Canteen Menu
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          
          {/* Section 1: Active Orders Queue */}
          {activeOrders.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-xl font-extrabold text-slate-800 dark:text-white tracking-tight flex items-center gap-2">
                <span>🔥 Active Kitchen Prep</span>
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-ping" />
              </h2>

              <div className="space-y-6">
                {activeOrders.map((order) => {
                  const currentStatus = statusConfig[order.status] || statusConfig.Placed;

                  return (
                    <div 
                      key={order.id} 
                      className="bg-white dark:bg-slate-950 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 grid grid-cols-1 md:grid-cols-12 gap-8 relative overflow-hidden"
                    >
                      
                      {/* Ticket Left Column: Retro Voucher Ticket */}
                      <div className="md:col-span-5 bg-gradient-to-br from-amber-50 to-orange-50/50 dark:from-slate-900 dark:to-slate-900/50 rounded-2xl p-5 border border-dashed border-orange-200 dark:border-slate-850 flex flex-col justify-between relative shadow-inner">
                        
                        {/* Half Circle ticket notches */}
                        <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-full" />
                        <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-full" />

                        <div className="space-y-3">
                          <div className="flex justify-between items-center text-[10px] font-black tracking-widest text-orange-600 dark:text-orange-400 uppercase leading-none">
                            <span>CampusBites Token</span>
                            <span>{order.paymentMethod}</span>
                          </div>
                          
                          <div className="border-t border-orange-100 dark:border-slate-800 pt-2">
                            <h3 className="text-2xl font-black text-slate-850 dark:text-white leading-none tracking-tight">
                              {order.id}
                            </h3>
                            <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold">
                              Pickup slot: <span className="text-orange-500">{order.pickupTime}</span>
                            </p>
                          </div>
                        </div>

                        {/* Live Dynamic QR Code — encodes real order data */}
                        {(() => {
                          const qrPayload = JSON.stringify({
                            id: order.id,
                            student: order.userName,
                            roll: order.userRollNo,
                            total: order.total,
                            pickup: order.pickupTime,
                            items: order.items.length,
                            pay: order.paymentMethod,
                          });
                          const isReady = order.status === 'Ready';
                          return (
                            <div className={`my-5 flex flex-col items-center justify-center p-2.5 bg-white rounded-xl border-2 w-36 mx-auto shadow-md transition-all duration-500 ${
                              isReady
                                ? 'border-emerald-400 shadow-emerald-200 dark:shadow-emerald-900/40 ring-2 ring-emerald-300/50'
                                : 'border-orange-100 dark:border-slate-700'
                            }`}>
                              <QRCodeSVG
                                value={qrPayload}
                                size={112}
                                bgColor="#ffffff"
                                fgColor={isReady ? '#10b981' : '#1e293b'}
                                level="M"
                                includeMargin={false}
                                imageSettings={{
                                  src: "",
                                  excavate: false,
                                }}
                              />
                              <span className={`text-[8px] font-black mt-1.5 tracking-widest uppercase ${
                                isReady ? 'text-emerald-500' : 'text-slate-400 dark:text-slate-500'
                              }`}>
                                {isReady ? '✅ Show at Counter' : 'Scan at Counter'}
                              </span>
                            </div>
                          );
                        })()}

                        <div className="border-t border-orange-100 dark:border-slate-800 pt-2 space-y-1 text-xs font-semibold text-slate-600 dark:text-slate-400">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between">
                              <span className="truncate max-w-[140px]">{item.name} <span className="text-slate-400">x{item.quantity}</span></span>
                              <span className="text-slate-800 dark:text-slate-200">₹{item.price * item.quantity}</span>
                            </div>
                          ))}
                          <div className="border-t border-dashed border-orange-200 dark:border-slate-800 pt-1.5 flex justify-between font-black text-slate-850 dark:text-slate-100 text-sm">
                            <span>Total Bill</span>
                            <span className="text-orange-500">₹{order.total}</span>
                          </div>
                        </div>

                      </div>

                      {/* Ticket Right Column: Live Stepper Progression */}
                      <div className="md:col-span-7 flex flex-col justify-between space-y-6">
                        
                        {/* Status Label Banner */}
                        <div className={`p-4 rounded-2xl border text-sm font-extrabold flex justify-between items-center ${currentStatus.color}`}>
                          <div>
                            <span className="text-xs uppercase font-black opacity-60 block leading-none mb-1">Current State</span>
                            {currentStatus.label}
                          </div>
                          <span className="text-xs font-normal opacity-90 text-right max-w-[180px]">{currentStatus.desc}</span>
                        </div>

                        {/* Visual Preparation Steps */}
                        <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100 dark:before:bg-slate-800">
                          
                          {/* Step 1: Placed */}
                          <div className="relative">
                            <span className={`absolute -left-6 top-1 w-4.5 h-4.5 rounded-full flex items-center justify-center text-[10px] font-bold border-2 ${
                              order.status === 'Placed' || order.status === 'Preparing' || order.status === 'Ready'
                                ? 'bg-orange-500 border-orange-500 text-white shadow-md'
                                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400'
                            }`}>
                              ✓
                            </span>
                            <div className="ml-2">
                              <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-250">Order Placed</h4>
                              <p className="text-[11px] text-slate-400">Token registered. Awaiting kitchen assembly.</p>
                            </div>
                          </div>

                          {/* Step 2: Preparing */}
                          <div className="relative">
                            <span className={`absolute -left-6 top-1 w-4.5 h-4.5 rounded-full flex items-center justify-center text-[10px] font-bold border-2 ${
                              order.status === 'Preparing' || order.status === 'Ready'
                                ? 'bg-orange-500 border-orange-500 text-white shadow-md'
                                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400'
                            }`}>
                              {order.status === 'Preparing' ? '⏳' : '✓'}
                            </span>
                            <div className="ml-2">
                              <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-250">Kitchen Cooking</h4>
                              <p className="text-[11px] text-slate-400">Pantry chefs are preparing your items hot & fresh.</p>
                            </div>
                          </div>

                          {/* Step 3: Ready */}
                          <div className="relative">
                            <span className={`absolute -left-6 top-1 w-4.5 h-4.5 rounded-full flex items-center justify-center text-[10px] font-bold border-2 ${
                              order.status === 'Ready'
                                ? 'bg-emerald-500 border-emerald-500 text-white shadow-md'
                                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400'
                            }`}>
                              {order.status === 'Ready' ? '🔔' : '✓'}
                            </span>
                            <div className="ml-2">
                              <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-250">Ready for Pickup</h4>
                              <p className="text-[11px] text-slate-400">Scanned and waiting on the counter! Pick up now.</p>
                            </div>
                          </div>

                        </div>



                      </div>

                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Section 2: Past Orders History */}
          {pastOrders.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-extrabold text-slate-700 dark:text-slate-350 tracking-tight">
                📜 Pre-Order History
              </h3>

              <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm divide-y divide-slate-50 dark:divide-slate-900/50 px-6">
                {pastOrders.map((order) => (
                  <div key={order.id} className="flex justify-between items-center py-4 text-xs font-semibold text-slate-600 dark:text-slate-400">
                    <div className="space-y-1">
                      <div className="font-extrabold text-sm text-slate-800 dark:text-slate-200">
                        {order.id}
                      </div>
                      <div className="text-[10px] text-slate-450">
                        Pickup: {order.pickupTime} | Method: {order.paymentMethod}
                      </div>
                      <div className="text-[10px] text-slate-400 font-bold truncate max-w-[200px] sm:max-w-md">
                        {order.items.map(item => `${item.name} (x${item.quantity})`).join(', ')}
                      </div>
                    </div>

                    <div className="text-right space-y-1">
                      <div className="font-black text-slate-800 dark:text-slate-100">
                        ₹{order.total}
                      </div>
                      <span className="inline-block bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded text-[9px] uppercase font-black tracking-wider">
                        Collected
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};

export default Orders;
