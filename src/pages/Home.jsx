import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { CanteenContext } from '../context/CanteenContext';
import Productscard from './Productscard';

const Home = () => {
  const { menuItems, cart, addToCart, removeFromCart, currentUser } = useContext(CanteenContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [vegOnly, setVegOnly] = useState(false);

  const categories = ['All', 'Breakfast', 'Lunch', 'Snacks', 'Beverages'];

  // Filter logic
  const filteredItems = menuItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesVeg = !vegOnly || item.isVeg === true;
    return matchesSearch && matchesCategory && matchesVeg;
  });

  const getCartQuantity = (itemId) => {
    const cartItem = cart.find((item) => item.id === itemId);
    return cartItem ? cartItem.quantity : 0;
  };

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalCartPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Dynamic Demo Hero Header */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 text-white p-8 md:p-12 shadow-xl shadow-orange-500/10">
        <div className="absolute right-0 bottom-0 opacity-15 translate-x-12 translate-y-12 hidden md:block">
          <svg className="w-80 h-80 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H7c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.04-.42 1.99-1.07 2.75z"/>
          </svg>
        </div>
        
        <div className="relative z-10 max-w-2xl space-y-4">
          <span className="bg-white/20 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider">
            ⚡ Skip the Canteen Queue
          </span>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-none text-white margin-y-0">
            Pre-Order Your Favorite College Meals!
          </h1>
          <p className="text-sm md:text-base text-amber-50/90 font-medium">
            Browse today's active menu, schedule your exact pickup break time, and collect your food without waiting in line.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl text-xs font-bold">
              ✓ Hot & Fresh Guarantee
            </span>
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl text-xs font-bold">
              ✓ Fast Pick-up Tokens
            </span>
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl text-xs font-bold">
              ✓ Mock UPI Wallet Checkout
            </span>
          </div>
        </div>
      </section>

      {/* Filter and Search Panel */}
      <section className="bg-white dark:bg-slate-950 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          
          {/* Live Search */}
          <div className="relative w-full md:max-w-md">
            <input
              type="text"
              placeholder="Search masala dosa, cold coffee..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 dark:text-slate-200 transition"
            />
            <span className="absolute left-3.5 top-3 text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.602 10.602Z" />
              </svg>
            </span>
          </div>

          {/* Veg Only Toggle */}
          <div className="flex items-center gap-2.5 self-start md:self-auto">
            <button
              onClick={() => setVegOnly(!vegOnly)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                vegOnly ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-800'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  vegOnly ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              🟢 Vegetarian Only
            </span>
          </div>

        </div>

        {/* Category Selector Scroll */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none pt-2 border-t border-slate-50 dark:border-slate-900/50">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-500/10'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-600 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Food Menu Grid */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight margin-0">
              Today's Specialities
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Freshly prepared with love in the main campus pantry.
            </p>
          </div>
          <span className="text-xs font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg">
            {filteredItems.length} items found
          </span>
        </div>

        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <Productscard
                key={item.id}
                item={item}
                onAddToCart={addToCart}
                onRemoveFromCart={removeFromCart}
                quantity={getCartQuantity(item.id)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-950 rounded-2xl border border-dashed border-slate-200 dark:border-slate-850 p-12 text-center space-y-4">
            <div className="w-16 h-16 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto text-slate-400">
              🔍
            </div>
            <div>
              <h4 className="font-bold text-slate-700 dark:text-slate-350">No Menu Items Match Your Filters</h4>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Try loosening your search keywords, turning off the Veg-Only filter, or switching the food category.
              </p>
            </div>
          </div>
        )}
      </section>

      {/* Floating Cart Indicator */}
      {totalCartItems > 0 && (
        <div className="sticky bottom-6 left-0 right-0 z-40 px-4 animate-slide-up">
          <div className="max-w-xl mx-auto bg-gradient-to-r from-slate-900 to-slate-950 text-white rounded-2xl p-4 shadow-2xl shadow-slate-950/40 border border-slate-800/80 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400 font-extrabold text-sm relative">
                🛒
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-orange-500 text-white rounded-full flex items-center justify-center text-[9px] font-black">
                  {totalCartItems}
                </span>
              </div>
              <div>
                <div className="text-xs text-slate-400 font-semibold leading-none">Pre-order Total</div>
                <div className="text-base font-black text-white mt-1">₹{totalCartPrice}</div>
              </div>
            </div>

            <Link
              to="/cart"
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs uppercase px-5 py-2.5 rounded-xl shadow-lg shadow-orange-500/20 active:scale-95 transition-all duration-200 flex items-center gap-1.5"
            >
              Review Cart & Place Order
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3.5 h-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>
      )}
      
    </div>
  );
};

export default Home;