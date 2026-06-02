import React, { useContext, useState } from 'react';
import { CanteenContext } from '../context/CanteenContext';

const Admin = () => {
  const { 
    orders, 
    updateOrderStatus, 
    menuItems, 
    toggleStock, 
    addMenuItem, 
    editMenuItem, 
    deleteMenuItem 
  } = useContext(CanteenContext);

  const [activeTab, setActiveTab] = useState('kitchen'); // 'kitchen', 'menu', 'inventory'

  // Menu Management State
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'Lunch',
    isVeg: true,
    imgpath: '',
    description: ''
  });

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const itemData = {
      ...formData,
      price: Number(formData.price)
    };
    if (editingItem) {
      editMenuItem(editingItem.id, itemData);
      setEditingItem(null);
    } else {
      addMenuItem(itemData);
    }
    setFormData({
      name: '',
      price: '',
      category: 'Lunch',
      isVeg: true,
      imgpath: '',
      description: ''
    });
  };

  const startEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      price: item.price,
      category: item.category,
      isVeg: item.isVeg,
      imgpath: item.imgpath,
      description: item.description
    });
    setActiveTab('menu');
  };

  const cancelEdit = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      price: '',
      category: 'Lunch',
      isVeg: true,
      imgpath: '',
      description: ''
    });
  }

  // Active prep queue
  const activeOrders = orders.filter((o) => o.status !== 'Completed');

  // Sorted by scheduled pickup slot (earliest first approximation)
  const sortedOrders = [...activeOrders].sort((a, b) => a.pickupTime.localeCompare(b.pickupTime));

  // Revenue analytics (completed orders)
  const completedOrders = orders.filter((o) => o.status === 'Completed');
  const totalRevenue = completedOrders.reduce((sum, order) => sum + order.total, 0);

  // Stock counters
  const outOfStockItems = menuItems.filter((item) => !item.inStock);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight leading-none">
            Admin Portal
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage your kitchen, monitor inventory, and update your menu.
          </p>
        </div>
        
        {/* Status Badge */}
        <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 animate-pulse">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          Systems Online
        </span>
      </div>

      {/* Analytics Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        
        {/* Active Orders */}
        <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 p-5 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 bg-orange-50 dark:bg-orange-950/20 text-orange-500 rounded-xl flex items-center justify-center text-xl font-bold">
            🍳
          </div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-black tracking-wider">Active Queue</div>
            <div className="text-2xl font-black text-slate-800 dark:text-slate-100 mt-0.5">{activeOrders.length} Orders</div>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 p-5 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 rounded-xl flex items-center justify-center text-xl font-bold">
            💰
          </div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-black tracking-wider">Net Sales</div>
            <div className="text-2xl font-black text-slate-800 dark:text-slate-100 mt-0.5">₹{totalRevenue}</div>
          </div>
        </div>

        {/* Stock Alerts */}
        <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 p-5 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 bg-red-50 dark:bg-red-950/20 text-red-500 rounded-xl flex items-center justify-center text-xl font-bold">
            ⚠️
          </div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-black tracking-wider">Out of Stock</div>
            <div className="text-2xl font-black text-slate-800 dark:text-slate-100 mt-0.5">{outOfStockItems.length} Dishes</div>
          </div>
        </div>

      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('kitchen')}
          className={`px-4 py-2 font-bold text-sm transition-colors ${
            activeTab === 'kitchen' 
            ? 'border-b-2 border-orange-500 text-orange-500' 
            : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          👨‍🍳 Kitchen Queue
        </button>
        <button
          onClick={() => setActiveTab('menu')}
          className={`px-4 py-2 font-bold text-sm transition-colors ${
            activeTab === 'menu' 
            ? 'border-b-2 border-orange-500 text-orange-500' 
            : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          📋 Menu Management
        </button>
        <button
          onClick={() => setActiveTab('inventory')}
          className={`px-4 py-2 font-bold text-sm transition-colors ${
            activeTab === 'inventory' 
            ? 'border-b-2 border-orange-500 text-orange-500' 
            : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          📦 Pantry Inventory
        </button>
      </div>

      {/* Tab Content */}
      <div className="pt-4">
        
        {/* Kitchen Queue Tab */}
        {activeTab === 'kitchen' && (
          <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 space-y-6">
            <h3 className="font-extrabold text-slate-850 dark:text-white border-b border-slate-50 dark:border-slate-900/50 pb-3 flex items-center justify-between">
              <span>Prep & Cook Dispatch Queue</span>
              <span className="text-[10px] bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400 font-bold px-2 py-0.5 rounded">
                Sorted by Pickup slot
              </span>
            </h3>

            {sortedOrders.length === 0 ? (
              <div className="text-center py-12 space-y-3">
                <div className="text-4xl text-slate-300">🍽️</div>
                <div className="font-bold text-slate-400 text-sm">All Orders Completed!</div>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">No incoming student pre-orders currently in the kitchen pipeline.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {sortedOrders.map((order) => (
                  <div 
                    key={order.id} 
                    className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-3"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-sm text-slate-850 dark:text-slate-200">
                            {order.id}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded font-black uppercase tracking-wider bg-orange-500/10 text-orange-500">
                            {order.pickupTime}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-bold">
                          Student: {order.userName} ({order.userRollNo})
                        </span>
                      </div>

                      <span className={`text-[10px] uppercase font-black tracking-widest px-2 py-0.5 rounded ${
                        order.status === 'Placed' 
                          ? 'bg-blue-500/10 text-blue-500' 
                          : 'bg-amber-500/10 text-amber-500'
                      }`}>
                        {order.status}
                      </span>
                    </div>

                    <div className="border-t border-dashed border-slate-200 dark:border-slate-850 pt-2 space-y-1">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
                          <span>🍔 {item.name} <span className="text-slate-400">x{item.quantity}</span></span>
                          <span>{item.isVeg ? '🟢 Veg' : '🔴 Non-Veg'}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2 pt-2 border-t border-slate-100 dark:border-slate-850/50 justify-end">
                      {order.status === 'Placed' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'Preparing')}
                          className="bg-amber-500 hover:bg-amber-600 text-white font-bold text-[10px] uppercase px-3 py-1.5 rounded-lg shadow-sm active:scale-95 transition"
                        >
                          🍳 Start Cooking
                        </button>
                      )}
                      {order.status === 'Preparing' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'Ready')}
                          className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-[10px] uppercase px-3 py-1.5 rounded-lg shadow-sm active:scale-95 transition"
                        >
                          🔔 Mark as Ready
                        </button>
                      )}
                      {order.status === 'Ready' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'Completed')}
                          className="bg-slate-900 hover:bg-slate-850 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-[10px] uppercase px-3 py-1.5 rounded-lg shadow-sm active:scale-95 transition"
                        >
                          🎁 Hand Over Meal
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Menu Management Tab */}
        {activeTab === 'menu' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Form Section */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6">
                <h3 className="font-extrabold text-slate-850 dark:text-white mb-4">
                  {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
                </h3>
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  
                  <div>
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Dish Name</label>
                    <input 
                      type="text" 
                      name="name" 
                      value={formData.name} 
                      onChange={handleFormChange} 
                      required 
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-800 dark:text-slate-100"
                      placeholder="e.g. Chole Bhature"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Price (₹)</label>
                      <input 
                        type="number" 
                        name="price" 
                        value={formData.price} 
                        onChange={handleFormChange} 
                        required 
                        min="1"
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-800 dark:text-slate-100"
                        placeholder="60"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Category</label>
                      <select 
                        name="category" 
                        value={formData.category} 
                        onChange={handleFormChange} 
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-800 dark:text-slate-100"
                      >
                        <option value="Breakfast">Breakfast</option>
                        <option value="Lunch">Lunch</option>
                        <option value="Snacks">Snacks</option>
                        <option value="Beverages">Beverages</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Image URL</label>
                    <input 
                      type="url" 
                      name="imgpath" 
                      value={formData.imgpath} 
                      onChange={handleFormChange} 
                      required 
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-800 dark:text-slate-100"
                      placeholder="https://images.unsplash.com/..."
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Description</label>
                    <textarea 
                      name="description" 
                      value={formData.description} 
                      onChange={handleFormChange} 
                      required 
                      rows="3"
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-800 dark:text-slate-100"
                      placeholder="Describe the dish..."
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      name="isVeg" 
                      checked={formData.isVeg} 
                      onChange={handleFormChange} 
                      className="w-4 h-4 text-orange-500 focus:ring-orange-500 rounded border-slate-300"
                      id="isVegCheck"
                    />
                    <label htmlFor="isVegCheck" className="text-sm font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                      Is Vegetarian? (🟢)
                    </label>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button 
                      type="submit" 
                      className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg shadow-sm transition-colors"
                    >
                      {editingItem ? 'Update Dish' : 'Add Dish'}
                    </button>
                    {editingItem && (
                      <button 
                        type="button" 
                        onClick={cancelEdit}
                        className="flex-1 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold py-2 px-4 rounded-lg shadow-sm transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>

            {/* List Section */}
            <div className="lg:col-span-7">
              <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6">
                <h3 className="font-extrabold text-slate-850 dark:text-white mb-4">Current Menu</h3>
                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                  {menuItems.map((item) => (
                    <div key={item.id} className="flex flex-col sm:flex-row gap-4 p-3 border border-slate-100 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 items-start sm:items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img src={item.imgpath} alt={item.name} className="w-12 h-12 rounded-lg object-cover bg-slate-200" />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${item.isVeg ? 'bg-emerald-500' : 'bg-red-500'}`} />
                            <span className="font-bold text-sm text-slate-800 dark:text-slate-100">{item.name}</span>
                          </div>
                          <div className="text-[10px] text-slate-500 font-semibold mt-0.5">
                            ₹{item.price} • {item.category}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                        <button 
                          onClick={() => startEdit(item)}
                          className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-600 hover:bg-blue-500 hover:text-white rounded transition-colors"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => {
                            if(window.confirm('Are you sure you want to delete this item?')) {
                              deleteMenuItem(item.id);
                            }
                          }}
                          className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider bg-red-500/10 text-red-600 hover:bg-red-500 hover:text-white rounded transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Inventory Tab */}
        {activeTab === 'inventory' && (
          <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 max-w-2xl mx-auto">
            <h3 className="font-extrabold text-slate-850 dark:text-white border-b border-slate-50 dark:border-slate-900/50 pb-3 flex items-center justify-between">
              <span>Live Pantry Stock Manager</span>
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                Click to Toggle
              </span>
            </h3>

            <div className="divide-y divide-slate-100 dark:divide-slate-900/50 mt-2">
              {menuItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center py-3">
                  <div className="flex items-center gap-3">
                    <img src={item.imgpath} alt={item.name} className="w-8 h-8 rounded-md object-cover" />
                    <div>
                      <div className="text-sm font-bold text-slate-800 dark:text-slate-200">
                        {item.name}
                      </div>
                      <span className="text-[10px] text-slate-400 font-black">
                        {item.category}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] font-black uppercase ${
                      item.inStock ? 'text-emerald-500' : 'text-red-500'
                    }`}>
                      {item.inStock ? 'In Stock' : 'Sold Out'}
                    </span>
                    <button
                      onClick={() => toggleStock(item.id)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                        item.inStock ? 'bg-emerald-500' : 'bg-red-500'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          item.inStock ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Admin;
