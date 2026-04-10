import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ErrorAlert from '../components/ErrorAlert';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { useRazorpay } from '../hooks/useRazorpay';
import { formatCurrency } from '../utils/formatCurrency';

export default function CartPage() {
  const { cartItems, updateQuantity, removeItem, clearCart, totalAmount } = useCart();
  const { currentUser } = useAuth();
  const { initiatePayment } = useRazorpay();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePayment = async () => {
    if (cartItems.length === 0) {
      return;
    }

    setError('');
    setLoading(true);

    await initiatePayment({
      totalAmount,
      cartItems,
      restaurantId: cartItems[0].restaurantId,
      userName: currentUser?.name || '',
      userEmail: currentUser?.email || '',
      onSuccess: (order) => {
        clearCart();
        setLoading(false);
        navigate(`/order-confirmation/${order.id}`);
      },
      onFailure: (message) => {
        setError(message);
        setLoading(false);
      },
    });
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-6xl mb-4">🛒</p>
        <h2 className="mb-2 text-2xl font-semibold text-slate-800 dark:text-slate-100">Your cart is empty</h2>
        <p className="mb-6 text-slate-500 dark:text-slate-400">Add some delicious food to get started</p>
        <Link to="/" className="bg-orange-500 text-white px-6 py-3 rounded-xl hover:bg-orange-600 font-medium">
          Browse Restaurants
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="mb-6 text-2xl font-semibold text-slate-800 dark:text-slate-100">Your Cart</h1>

      <div className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-zinc-900 dark:bg-black">
        {cartItems.map((item, idx) => (
          <div
            key={item.id}
            className={`flex items-center gap-4 p-4 ${idx !== cartItems.length - 1 ? 'border-b border-slate-200 dark:border-zinc-900' : ''}`}
          >
            <div className="flex-1">
              <p className="font-medium text-slate-800 dark:text-slate-100">{item.name}</p>
              <p className="mt-0.5 text-sm font-semibold text-orange-500">{formatCurrency(item.price)}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 text-slate-600 font-medium hover:bg-slate-50 dark:border-zinc-800 dark:text-slate-300 dark:hover:bg-zinc-900"
              >
                -
              </button>
              <span className="w-6 text-center text-sm font-semibold text-slate-700 dark:text-slate-200">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 text-slate-600 font-medium hover:bg-slate-50 dark:border-zinc-800 dark:text-slate-300 dark:hover:bg-zinc-900"
              >
                +
              </button>
            </div>
            <p className="w-20 text-right text-sm font-semibold text-slate-800 dark:text-slate-100">
              {formatCurrency(item.price * item.quantity)}
            </p>
            <button onClick={() => removeItem(item.id)} className="text-red-400 hover:text-red-600 text-sm ml-2">
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-zinc-900 dark:bg-black">
        <div className="flex justify-between items-center">
          <span className="text-sm text-slate-500 dark:text-slate-400">Subtotal</span>
          <span className="font-medium text-slate-800 dark:text-slate-100">{formatCurrency(totalAmount)}</span>
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="text-sm text-slate-500 dark:text-slate-400">Delivery fee</span>
          <span className="font-medium text-green-600">FREE</span>
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-slate-200 pt-3 dark:border-zinc-900">
          <span className="font-semibold text-slate-800 dark:text-slate-100">Total</span>
          <span className="text-xl font-bold text-orange-500">{formatCurrency(totalAmount)}</span>
        </div>
      </div>

      <ErrorAlert message={error} />

      <div className="flex flex-col gap-3 mt-4">
        {loading ? (
          <LoadingSpinner message="Processing payment..." />
        ) : (
          <button
            onClick={handlePayment}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 rounded-xl text-base transition-colors"
          >
            Pay {formatCurrency(totalAmount)} with Razorpay
          </button>
        )}
        <button
          onClick={clearCart}
          className="w-full rounded-xl border border-slate-300 py-3 text-sm text-slate-600 transition-colors hover:bg-slate-50 dark:border-zinc-800 dark:text-slate-300 dark:hover:bg-zinc-900"
        >
          Clear Cart
        </button>
      </div>
    </div>
  );
}
