import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CanteenContext } from '../context/CanteenContext';

const SAVED_CREDS_KEY = 'canteen_saved_creds';

const Login = () => {
    const { login, currentUser } = useContext(CanteenContext);
    const navigate = useNavigate();

    // Load saved credentials from localStorage (remember me)
    const savedCreds = (() => {
        try { return JSON.parse(localStorage.getItem(SAVED_CREDS_KEY)) || {}; }
        catch { return {}; }
    })();

    const [rollNo, setRollNo]     = useState(savedCreds.rollNo  || '');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(!!savedCreds.rollNo);
    const [error, setError]       = useState('');
    const [loading, setLoading]   = useState(false);
    const [showPass, setShowPass] = useState(false);

    // ── Auto-redirect if already logged in ──────────────────────────────────
    useEffect(() => {
        if (currentUser) {
            navigate(currentUser.role === 'admin' ? '/admin' : '/', { replace: true });
        }
    }, [currentUser, navigate]);

    // ── Form submit ─────────────────────────────────────────────────────────
    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        const trimRollNo = rollNo.trim();

        // ── Admin path ──────────────────────────────────────────────────────
        if (password === '0206') {
            if (rememberMe) {
                localStorage.setItem(SAVED_CREDS_KEY, JSON.stringify({ rollNo: trimRollNo }));
            } else {
                localStorage.removeItem(SAVED_CREDS_KEY);
            }
            setLoading(true);
            setTimeout(() => {
                login('Admin', 'STAFF-01', 'admin');
                navigate('/admin');
            }, 400);
            return;
        }

        // ── Student path ────────────────────────────────────────────────────────
        if (!trimRollNo) { setError('Please enter your roll number.'); return; }

        // Basic roll number validation: at least 5 alphanumeric chars
        if (!/^[A-Za-z0-9]{5,}$/.test(trimRollNo)) {
            setError('Roll number must be at least 5 alphanumeric characters.');
            return;
        }

        if (rememberMe) {
            localStorage.setItem(SAVED_CREDS_KEY, JSON.stringify({ rollNo: trimRollNo }));
        } else {
            localStorage.removeItem(SAVED_CREDS_KEY);
        }

        setLoading(true);
        setTimeout(() => {
            login(trimRollNo, trimRollNo, 'student');
            navigate('/');
        }, 400);
    };

    const inputCls = `w-full bg-slate-50 dark:bg-slate-900 border border-slate-200
        dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm
        focus:outline-none focus:ring-2 focus:ring-orange-500
        text-slate-800 dark:text-slate-100 transition placeholder-slate-400`;

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4">
            <div className="w-full max-w-md">

                {/* Card */}
                <div className="bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 shadow-xl shadow-slate-200/60 dark:shadow-none space-y-7">

                    {/* Header */}
                    <div className="text-center space-y-2">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center text-white font-extrabold text-2xl shadow-lg shadow-orange-500/30 mx-auto">
                            CB
                        </div>
                        <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">
                            Welcome to CanteenBites
                        </h1>
                        <p className="text-xs text-slate-400">
                            Sign in with your roll number to start ordering.
                        </p>
                    </div>

                    {/* Error Banner */}
                    {error && (
                        <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 text-xs font-semibold rounded-xl px-4 py-3 flex items-center gap-2">
                            <span>⚠️</span> {error}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">

                        {/* Roll Number */}
                        <div>
                            <label htmlFor="login-roll" className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">
                                Roll Number
                            </label>
                            <input
                                id="login-roll"
                                type="text"
                                value={rollNo}
                                onChange={(e) => { setRollNo(e.target.value.toUpperCase()); setError(''); }}
                                className={inputCls}
                                placeholder="e.g. 2520030561"
                                autoComplete="username"
                                maxLength={20}
                            />
                        </div>

                        {/* Password / Admin Code */}
                        <div>
                            <label htmlFor="login-pass" className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">
                                Password <span className="text-slate-400 font-normal">(Admin only — leave blank for student)</span>
                            </label>
                            <div className="relative">
                                <input
                                    id="login-pass"
                                    type={showPass ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className={`${inputCls} pr-10`}
                                    placeholder="Admin code only"
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPass(v => !v)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition text-sm"
                                    tabIndex={-1}
                                    aria-label="Toggle password visibility"
                                >
                                    {showPass ? '🙈' : '👁️'}
                                </button>
                            </div>
                        </div>

                        {/* Remember Me */}
                        <div className="flex items-center gap-2 pt-1">
                            <input
                                id="remember-me"
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="w-4 h-4 text-orange-500 focus:ring-orange-500 rounded border-slate-300 cursor-pointer"
                            />
                            <label htmlFor="remember-me" className="text-xs font-semibold text-slate-600 dark:text-slate-400 cursor-pointer select-none">
                                Remember me on this device
                            </label>
                        </div>

                        {/* Submit */}
                        <div className="pt-1">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-orange-500 hover:bg-orange-600 active:scale-95 disabled:opacity-60 text-white font-bold px-4 py-2.5 rounded-xl shadow-md shadow-orange-500/30 transition-all duration-200 flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                        Signing In…
                                    </>
                                ) : (
                                    'Sign In →'
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Divider hint */}
                    <p className="text-center text-[10px] text-slate-400 font-semibold uppercase tracking-widest">
                        Your session is saved automatically on this device
                    </p>
                </div>

                {/* Back link */}
                <p className="text-center text-xs text-slate-400 mt-5">
                    <Link to="/" className="hover:text-orange-500 transition font-semibold">← Back to Menu</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;