import React, { createContext, useState, useEffect } from 'react';

export const CanteenContext = createContext();

const INITIAL_MENU = [
  {
    id: 1,
    name: "Masala Dosa",
    price: 50,
    category: "Breakfast",
    isVeg: true,
    imgpath: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=500&auto=format&fit=crop&q=60",
    description: "Crispy rice-lentil crepe filled with spiced potato mash, served with coconut chutney & sambar.",
    inStock: true
  },
  {
    id: 2,
    name: "Aloo Paratha",
    price: 40,
    category: "Breakfast",
    isVeg: true,
    imgpath: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=500&auto=format&fit=crop&q=60",
    description: "Whole wheat flatbread stuffed with spiced potato filling, served with curd & pickle.",
    inStock: true
  },
  {
    id: 3,
    name: "Paneer Butter Masala",
    price: 90,
    category: "Lunch",
    isVeg: true,
    imgpath: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500&auto=format&fit=crop&q=60",
    description: "Soft paneer cubes simmered in a rich, creamy, and mildly sweet onion-tomato gravy with 2 Rotis.",
    inStock: true
  },
  {
    id: 4,
    name: "Chicken Biryani",
    price: 120,
    category: "Lunch",
    isVeg: false,
    imgpath: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=60",
    description: "Aromatic basmati rice cooked with succulent chicken pieces, signature herbs, and spices.",
    inStock: true
  },
  {
    id: 5,
    name: "Veg Grilled Sandwich",
    price: 45,
    category: "Snacks",
    isVeg: true,
    imgpath: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=500&auto=format&fit=crop&q=60",
    description: "Crispy grilled sandwich with cucumber, tomato, onion, cheese, and spicy mint chutney.",
    inStock: true
  },
  {
    id: 6,
    name: "Samosa (2 pcs)",
    price: 20,
    category: "Snacks",
    isVeg: true,
    imgpath: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=500&auto=format&fit=crop&q=60",
    description: "Crispy golden fried pastries stuffed with spiced potatoes and peas, served with sweet tamarind dip.",
    inStock: true
  },
  {
    id: 7,
    name: "Cold Coffee",
    price: 40,
    category: "Beverages",
    isVeg: true,
    imgpath: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=500&auto=format&fit=crop&q=60",
    description: "Rich blended chilled milk with espresso coffee powder, vanilla ice cream, and chocolate drizzle.",
    inStock: true
  },
  {
    id: 8,
    name: "Mango Lassi",
    price: 35,
    category: "Beverages",
    isVeg: true,
    imgpath: "https://images.unsplash.com/photo-1546173159-315724a31696?w=500&auto=format&fit=crop&q=60",
    description: "Smooth, refreshing yogurt-based drink sweetened and blended with pulpy ripe mangoes.",
    inStock: true
  }
];

export const CanteenProvider = ({ children }) => {
  const [menuItems, setMenuItems] = useState(() => {
    const savedMenu = localStorage.getItem('canteen_menu');
    return savedMenu ? JSON.parse(savedMenu) : INITIAL_MENU;
  });

  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('canteen_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [orders, setOrders] = useState(() => {
    const savedOrders = localStorage.getItem('canteen_orders');
    return savedOrders ? JSON.parse(savedOrders) : [];
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('canteen_user');
    return savedUser ? JSON.parse(savedUser) : { name: "Prem", rollNo: "2520030561", role: "student" };
  });

  // Sync state to local storage when changed
  useEffect(() => {
    localStorage.setItem('canteen_menu', JSON.stringify(menuItems));
  }, [menuItems]);

  useEffect(() => {
    localStorage.setItem('canteen_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('canteen_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('canteen_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('canteen_user');
    }
  }, [currentUser]);

  // Sync state across different tabs/windows (Real-time connection between Admin & Student)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'canteen_orders') {
        setOrders(JSON.parse(e.newValue || '[]'));
      } else if (e.key === 'canteen_menu') {
        setMenuItems(JSON.parse(e.newValue || '[]'));
      } else if (e.key === 'canteen_cart') {
        setCart(JSON.parse(e.newValue || '[]'));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Cart operations
  const addToCart = (item) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.id === itemId);
      if (existingItem && existingItem.quantity === 1) {
        return prevCart.filter((cartItem) => cartItem.id !== itemId);
      }
      return prevCart.map((cartItem) =>
        cartItem.id === itemId ? { ...cartItem, quantity: cartItem.quantity - 1 } : cartItem
      );
    });
  };

  const updateCartQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      setCart((prevCart) => prevCart.filter((cartItem) => cartItem.id !== itemId));
    } else {
      setCart((prevCart) =>
        prevCart.map((cartItem) =>
          cartItem.id === itemId ? { ...cartItem, quantity } : cartItem
        )
      );
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  // Pre-Order Placement
  const placeOrder = (pickupTime, paymentMethod) => {
    if (cart.length === 0) return null;

    const orderId = "ORD-" + Math.floor(100000 + Math.random() * 900000);
    const orderTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const newOrder = {
      id: orderId,
      items: [...cart],
      total: orderTotal,
      pickupTime: pickupTime,
      paymentMethod: paymentMethod,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: "Placed", // Status: Placed -> Preparing -> Ready -> Completed
      userRollNo: currentUser?.rollNo || "GUEST",
      userName: currentUser?.name || "Guest Student"
    };

    setOrders((prevOrders) => [newOrder, ...prevOrders]);
    clearCart();
    return newOrder;
  };

  // Admin order status update
  const updateOrderStatus = (orderId, newStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  // Student cancel order (only allowed when status is Placed)
  const cancelOrder = (orderId) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId && order.status === 'Placed'
          ? { ...order, status: 'Cancelled' }
          : order
      )
    );
  };

  // Admin toggle item stock availability
  const toggleStock = (itemId) => {
    setMenuItems((prevMenu) =>
      prevMenu.map((item) =>
        item.id === itemId ? { ...item, inStock: !item.inStock } : item
      )
    );
  };

  // Admin add new menu item
  const addMenuItem = (newItem) => {
    setMenuItems((prevMenu) => {
      const newId = prevMenu.length > 0 ? Math.max(...prevMenu.map(i => i.id)) + 1 : 1;
      return [...prevMenu, { ...newItem, id: newId, inStock: true }];
    });
  };

  // Admin edit menu item
  const editMenuItem = (id, updatedItem) => {
    setMenuItems((prevMenu) =>
      prevMenu.map((item) => (item.id === id ? { ...item, ...updatedItem } : item))
    );
  };

  // Admin delete menu item
  const deleteMenuItem = (id) => {
    setMenuItems((prevMenu) => prevMenu.filter((item) => item.id !== id));
    // Remove deleted items from cart as well to prevent errors
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  // Toggle user role between Student and Admin with a passcode check
  const toggleUserRole = () => {
    if (currentUser?.role === 'student') {
      const code = window.prompt("Enter Admin Code:");
      if (code === "0206") {
        setCurrentUser({ name: "Canteen Manager", rollNo: "STAFF-01", role: "admin" });
      } else if (code !== null) {
        alert("Incorrect Admin Code!");
      }
    } else {
      setCurrentUser({ name: "Prem", rollNo: "2520030561", role: "student" });
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const login = (username, rollNo, role = 'student') => {
    setCurrentUser({ name: username, rollNo, role });
  };

  return (
    <CanteenContext.Provider
      value={{
        menuItems,
        setMenuItems,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        orders,
        placeOrder,
        updateOrderStatus,
        cancelOrder,
        toggleStock,
        addMenuItem,
        editMenuItem,
        deleteMenuItem,
        currentUser,
        setCurrentUser,
        toggleUserRole,
        login,
        logout
      }}
    >
      {children}
    </CanteenContext.Provider>
  );
};
