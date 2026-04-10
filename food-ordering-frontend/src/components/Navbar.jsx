import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { useTheme } from '../hooks/useTheme';

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const { totalItems } = useCart();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinkClass = ({ isActive }) =>
    `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
      isActive
        ? 'bg-orange-500/15 text-orange-600 dark:bg-orange-500/20 dark:text-orange-300'
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-zinc-900 dark:hover:text-white'
    }`;

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white transition-colors dark:border-zinc-900 dark:bg-black">
      <div className="mx-auto w-full max-w-6xl px-4">
        <div className="flex h-16 items-center justify-between gap-3">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-extrabold tracking-tight text-orange-500">FoodApp</span>
            <span className="hidden rounded-full bg-orange-500/10 px-2 py-1 text-xs font-semibold text-orange-600 dark:bg-orange-500/20 dark:text-orange-300 sm:inline">
              Fresh and Fast
            </span>
          </Link>

          <div className="hidden items-center gap-2 md:flex">
            {currentUser ? (
              <>
                <Link to="/orders" className={navLinkClass({ isActive: location.pathname === '/orders' })}>
                  My Orders
                </Link>
                <Link
                  to="/cart"
                  className={`${navLinkClass({ isActive: location.pathname === '/cart' })} relative`}
                  aria-label="Cart"
                >
                  Cart
                  {totalItems > 0 && (
                    <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1 text-xs font-semibold text-white">
                      {totalItems}
                    </span>
                  )}
                </Link>
                <span
                  className="max-w-[210px] truncate rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-700 dark:bg-black dark:text-slate-200"
                  title={currentUser.name}
                >
                  Hi, {currentUser.name}
                </span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className={navLinkClass({ isActive: location.pathname === '/login' })}>
                  Login
                </Link>
                <Link
                  to="/register"
                  className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-600"
                >
                  Register
                </Link>
              </>
            )}

            <button
              type="button"
              onClick={toggleTheme}
              title="Toggle light and dark mode"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 text-slate-700 transition-colors hover:bg-slate-100 dark:border-zinc-800 dark:text-slate-200 dark:hover:bg-zinc-900"
            >
              {theme === 'dark' ? (
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2" />
                  <path d="M12 20v2" />
                  <path d="m4.93 4.93 1.41 1.41" />
                  <path d="m17.66 17.66 1.41 1.41" />
                  <path d="M2 12h2" />
                  <path d="M20 12h2" />
                  <path d="m6.34 17.66-1.41 1.41" />
                  <path d="m19.07 4.93-1.41 1.41" />
                </svg>
              ) : (
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 3a7.5 7.5 0 1 0 9 9A9 9 0 1 1 12 3z" />
                </svg>
              )}
            </button>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <button
              type="button"
              onClick={toggleTheme}
              title="Toggle light and dark mode"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-300 text-slate-700 dark:border-zinc-800 dark:text-slate-200"
            >
              {theme === 'dark' ? (
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2" />
                  <path d="M12 20v2" />
                  <path d="m4.93 4.93 1.41 1.41" />
                  <path d="m17.66 17.66 1.41 1.41" />
                  <path d="M2 12h2" />
                  <path d="M20 12h2" />
                  <path d="m6.34 17.66-1.41 1.41" />
                  <path d="m19.07 4.93-1.41 1.41" />
                </svg>
              ) : (
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 3a7.5 7.5 0 1 0 9 9A9 9 0 1 1 12 3z" />
                </svg>
              )}
            </button>
            <button
              type="button"
              onClick={() => setMobileOpen((prev) => !prev)}
              className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 dark:border-zinc-800 dark:text-slate-200"
              aria-expanded={mobileOpen}
              aria-label="Toggle menu"
            >
              {mobileOpen ? 'Close' : 'Menu'}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="space-y-2 border-t border-slate-200 py-3 dark:border-zinc-900 md:hidden">
            {currentUser ? (
              <>
                <Link
                  to="/orders"
                  className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-zinc-900"
                >
                  My Orders
                </Link>
                <Link
                  to="/cart"
                  className="flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-zinc-900"
                >
                  <span>Cart</span>
                  {totalItems > 0 && (
                    <span className="rounded-full bg-orange-500 px-2 py-0.5 text-xs font-semibold text-white">
                      {totalItems}
                    </span>
                  )}
                </Link>
                <div className="truncate rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-700 dark:bg-black dark:text-slate-200">
                  Hi, {currentUser.name}
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-zinc-900"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block rounded-lg bg-orange-500 px-3 py-2 text-center text-sm font-medium text-white hover:bg-orange-600"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
