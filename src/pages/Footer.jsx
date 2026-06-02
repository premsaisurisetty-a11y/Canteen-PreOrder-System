import React from 'react';

const Footer = () => {
    return (
        <footer className="border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 py-6 mt-16 transition-colors duration-200">
            <div className="max-w-4xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
                <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center text-white font-black text-xs">
                        CB
                    </span>
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                        CanteenBites
                    </span>
                </div>
                <p className="text-xs text-slate-400 dark:text-slate-500">
                    &copy; 2026 CanteenBites. All rights reserved. Built for modern campus dining.
                </p>
            </div>
        </footer>
    );
};

export default Footer;