import React from 'react';

const Productscard = ({ item, onAddToCart, onRemoveFromCart, quantity }) => {
  const { name, price, category, isVeg, imgpath, description, inStock } = item;

  return (
    <div className={`relative bg-white dark:bg-slate-950 rounded-2xl border ${
      inStock ? 'border-slate-100 dark:border-slate-800' : 'border-slate-200 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/50'
    } p-4 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden group`}>
      
      {/* Category Tag & Veg indicator */}
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        <span className={`w-3.5 h-3.5 rounded-full border-2 border-white flex items-center justify-center ${isVeg ? 'bg-emerald-500' : 'bg-red-500'}`} title={isVeg ? "Veg" : "Non-Veg"}>
          <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
        </span>
        <span className="text-[10px] uppercase font-black tracking-wider px-2 py-0.5 rounded-md bg-white/95 dark:bg-slate-900/95 text-slate-700 dark:text-slate-300 shadow-sm border border-slate-100 dark:border-slate-800">
          {category}
        </span>
      </div>

      {/* Product Image */}
      <div className="w-full h-44 rounded-xl overflow-hidden mb-4 bg-slate-100 dark:bg-slate-900 relative">
        <img 
          src={imgpath} 
          alt={name} 
          className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${!inStock && 'grayscale opacity-60'}`} 
        />
        
        {/* Out of Stock Overlay */}
        {!inStock && (
          <div className="absolute inset-0 bg-slate-950/65 backdrop-blur-[1px] flex items-center justify-center">
            <span className="bg-red-600 text-white font-extrabold text-xs uppercase px-3 py-1 rounded-full shadow-lg tracking-widest border border-red-500 animate-pulse">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-extrabold text-lg text-slate-800 dark:text-slate-100 leading-snug group-hover:text-orange-500 transition-colors">
            {name}
          </h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1.5 line-clamp-2 min-h-[2rem]">
            {description}
          </p>
        </div>

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-50 dark:border-slate-900/50">
          <span className="text-xl font-black text-orange-500">
            ₹{price}
          </span>
          
          {inStock ? (
            quantity > 0 ? (
              <div className="flex items-center gap-3 bg-orange-50 dark:bg-orange-950/20 px-3 py-1.5 rounded-xl border border-orange-100 dark:border-orange-950/50">
                <button 
                  onClick={() => onRemoveFromCart(item.id)} 
                  className="text-orange-600 dark:text-orange-400 font-extrabold text-lg hover:scale-125 transition px-1"
                >
                  -
                </button>
                <span className="text-slate-850 dark:text-slate-200 font-bold text-sm min-w-[12px] text-center">
                  {quantity}
                </span>
                <button 
                  onClick={() => onAddToCart(item)} 
                  className="text-orange-600 dark:text-orange-400 font-extrabold text-lg hover:scale-125 transition px-1"
                >
                  +
                </button>
              </div>
            ) : (
              <button 
                onClick={() => onAddToCart(item)} 
                className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs uppercase px-4 py-2 rounded-xl hover:shadow-md hover:shadow-orange-500/10 active:scale-95 transition-all duration-200"
              >
                Add to Cart
              </button>
            )
          ) : (
            <button 
              disabled 
              className="bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 font-bold text-xs uppercase px-4 py-2 rounded-xl cursor-not-allowed"
            >
              Unavailable
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Productscard;