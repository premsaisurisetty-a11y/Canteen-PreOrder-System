import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { CanteenContext } from '../context/CanteenContext';

const Navbar = () => {
  const { cart, currentUser, toggleUserRole, logout } = useContext(CanteenContext);
  const navigate = useNavigate();

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  const handleRoleToggle = () => {
    if (currentUser?.role === 'admin') {
      // Switching to student — navigate away from /admin first
      navigate('/');
    }
    toggleUserRole();
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-slate-950/80 border-b border-slate-100 dark:border-slate-800/80 px-6 py-4 transition-all duration-300">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo & Name */}
        <NavLink to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center text-white font-extrabold text-xl shadow-lg shadow-orange-500/30 group-hover:scale-105 transition-transform duration-300">
            CB
          </div>
          <div className="flex flex-col">
            <span className="font-black text-xl text-slate-800 dark:text-white tracking-tight group-hover:text-orange-500 transition-colors">
              CampusBites
            </span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest leading-none">
              College Canteen
            </span>
          </div>
        </NavLink>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `text-sm font-semibold tracking-wide transition-all ${
                isActive
                  ? 'text-orange-500'
                  : 'text-slate-600 dark:text-slate-300 hover:text-orange-500'
              }`
            }
          >
            Menu
          </NavLink>
          
          <NavLink
            to="/orders"
            className={({ isActive }) =>
              `text-sm font-semibold tracking-wide transition-all ${
                isActive
                  ? 'text-orange-500'
                  : 'text-slate-600 dark:text-slate-300 hover:text-orange-500'
              }`
            }
          >
            My Orders
          </NavLink>

          <NavLink
            to="/aboutus"
            className={({ isActive }) =>
              `text-sm font-semibold tracking-wide transition-all ${
                isActive
                  ? 'text-orange-500'
                  : 'text-slate-600 dark:text-slate-300 hover:text-orange-500'
              }`
            }
          >
            About Us
          </NavLink>

          <NavLink
            to="/contactus"
            className={({ isActive }) =>
              `text-sm font-semibold tracking-wide transition-all ${
                isActive
                  ? 'text-orange-500'
                  : 'text-slate-600 dark:text-slate-300 hover:text-orange-500'
              }`
            }
          >
            Contact
          </NavLink>

          {/* Admin Dashboard link visible only to Admin role */}
          {currentUser?.role === 'admin' && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `text-sm font-bold uppercase px-3 py-1 rounded bg-amber-500/10 border border-amber-500/20 text-amber-500 tracking-wide transition-all ${
                  isActive ? 'bg-amber-500 text-white border-amber-500' : 'hover:bg-amber-500 hover:text-white'
                }`
              }
            >
              Dashboard
            </NavLink>
          )}
        </nav>

        {/* User info, Logout & Cart */}
        <div className="flex items-center gap-3">

          {currentUser ? (
            <>
              {/* User info / role switcher (admin only toggle) */}
              <button
                onClick={handleRoleToggle}
                className="hidden sm:flex flex-col text-right items-end group"
                title="Click to toggle between Student & Admin roles"
              >
                <div className="text-[10px] text-slate-400 uppercase font-extrabold tracking-wider leading-none">
                  <span className="text-orange-500">{currentUser.rollNo}</span>
                </div>
                <div className="text-xs font-semibold text-slate-700 dark:text-slate-200 group-hover:text-orange-500 transition-colors truncate max-w-[120px]">
                  {currentUser.name}
                </div>
              </button>

              {/* Logout button */}
              <button
                onClick={handleLogout}
                title="Logout"
                className="p-2.5 rounded-2xl bg-red-50 hover:bg-red-500 text-red-500 hover:text-white dark:bg-red-950/30 dark:hover:bg-red-600 transition-all duration-200 group"
              >
                {/* Logout icon */}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4.5 h-4.5 w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
                </svg>
              </button>
            </>
          ) : (
            /* Not logged in → show Login link */
            <NavLink
              to="/login"
              className="text-sm font-bold text-orange-500 hover:text-orange-600 transition-colors border border-orange-200 hover:border-orange-400 px-3 py-1.5 rounded-xl"
            >
              Login
            </NavLink>
          )}

          {/* Cart Icon Link */}
          <NavLink
            to="/cart"
            className={({ isActive }) =>
              `relative p-2.5 rounded-2xl flex items-center justify-center transition-all ${
                isActive
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'
              }`
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
              />
            </svg>
            
            {cartItemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-orange-600 text-white rounded-full flex items-center justify-center font-black text-[10px] animate-bounce shadow-md">
                {cartItemCount}
              </span>
            )}
          </NavLink>
          
        </div>
      </div>
    </header>
  );
};

export default Navbar;