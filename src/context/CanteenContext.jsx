import React, { createContext, useState, useEffect } from 'react';
import { db } from '../firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy 
} from 'firebase/firestore';

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
  const [menuItems, setMenuItems] = useState([]);
  const [orders, setOrders] = useState([]);

  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem('canteen_cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (e) {
      console.error("Failed to parse saved cart:", e);
      return [];
    }
  });

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('canteen_user');
      return savedUser ? JSON.parse(savedUser) : { name: "Prem", rollNo: "2520030561", role: "student" };
    } catch (e) {
      console.error("Failed to parse saved user:", e);
      return { name: "Prem", rollNo: "2520030561", role: "student" };
    }
  });

  // 1. Sync Menu Items from Firestore in Real-Time (with Seeding)
  useEffect(() => {
    const menuCol = collection(db, 'menu');
    const unsubscribe = onSnapshot(menuCol, async (snapshot) => {
      if (snapshot.empty) {
        console.log("Firestore 'menu' collection is empty. Seeding defaults...");
        // Seed default items using their numeric ID as document ID
        for (const item of INITIAL_MENU) {
          try {
            await setDoc(doc(db, 'menu', item.id.toString()), item);
          } catch (err) {
            console.error("Failed to seed menu item:", item.name, err);
          }
        }
      } else {
        const items = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            ...data,
            id: isNaN(doc.id) ? doc.id : Number(doc.id)
          };
        });
        // Sort items by numeric ID to preserve order
        items.sort((a, b) => a.id - b.id);
        setMenuItems(items);
      }
    }, (error) => {
      console.error("Firestore menu snapshot listener failed:", error);
    });

    return () => unsubscribe();
  }, []);

  // 2. Sync Orders from Firestore in Real-Time
  useEffect(() => {
    const ordersCol = collection(db, 'orders');
    const q = query(ordersCol, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersList = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      }));
      setOrders(ordersList);
    }, (error) => {
      console.error("Firestore orders snapshot listener failed:", error);
    });

    return () => unsubscribe();
  }, []);

  // Sync Cart to local storage when changed
  useEffect(() => {
    try {
      localStorage.setItem('canteen_cart', JSON.stringify(cart));
    } catch (e) {
      console.error("Failed to save cart to localStorage:", e);
    }
  }, [cart]);

  // Sync User to local storage when changed
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('canteen_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('canteen_user');
      }
    } catch (e) {
      console.error("Failed to save user to localStorage:", e);
    }
  }, [currentUser]);

  // Sync Cart across different tabs in real-time
  useEffect(() => {
    const handleStorageChange = (e) => {
      try {
        if (!e.newValue) return;
        if (e.key === 'canteen_cart') {
          setCart(JSON.parse(e.newValue));
        }
      } catch (err) {
        console.error("Cart storage sync event parsing failed:", err);
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
      createdAt: new Date().toISOString(),
      status: "Placed", // Status: Placed -> Preparing -> Ready -> Completed
      userRollNo: currentUser?.rollNo || "GUEST",
      userName: currentUser?.name || "Guest Student"
    };

    // Save to Firestore in background
    setDoc(doc(db, 'orders', orderId), newOrder).catch((e) => {
      console.error("Failed to place order in Firestore:", e);
    });

    clearCart();
    return newOrder;
  };

  // Admin order status update
  const updateOrderStatus = (orderId, newStatus) => {
    const orderRef = doc(db, 'orders', orderId);
    updateDoc(orderRef, { status: newStatus }).catch((e) => {
      console.error("Failed to update order status in Firestore:", e);
    });
  };

  // Student cancel order (only allowed when status is Placed)
  const cancelOrder = (orderId) => {
    const orderRef = doc(db, 'orders', orderId);
    updateDoc(orderRef, { status: 'Cancelled' }).catch((e) => {
      console.error("Failed to cancel order in Firestore:", e);
    });
  };

  // Admin toggle item stock availability
  const toggleStock = (itemId) => {
    const itemRef = doc(db, 'menu', itemId.toString());
    const item = menuItems.find(i => i.id === itemId);
    if (item) {
      updateDoc(itemRef, { inStock: !item.inStock }).catch((e) => {
        console.error("Failed to toggle stock in Firestore:", e);
      });
    }
  };

  // Admin add new menu item
  const addMenuItem = (newItem) => {
    const newId = menuItems.length > 0 ? Math.max(...menuItems.map(i => i.id)) + 1 : 1;
    const itemRef = doc(db, 'menu', newId.toString());
    setDoc(itemRef, { ...newItem, id: newId, inStock: true }).catch((e) => {
      console.error("Failed to add menu item in Firestore:", e);
    });
  };

  // Admin edit menu item
  const editMenuItem = (id, updatedItem) => {
    const itemRef = doc(db, 'menu', id.toString());
    updateDoc(itemRef, updatedItem).catch((e) => {
      console.error("Failed to edit menu item in Firestore:", e);
    });
  };

  // Admin delete menu item
  const deleteMenuItem = (id) => {
    const itemRef = doc(db, 'menu', id.toString());
    deleteDoc(itemRef).catch((e) => {
      console.error("Failed to delete menu item in Firestore:", e);
    });
    // Remove from cart locally as well
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
