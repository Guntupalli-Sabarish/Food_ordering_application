import { useNavigate } from 'react-router-dom';

export default function RestaurantCard({ restaurant }) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate(`/restaurant/${restaurant.id}`)}
      className="group w-full cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-zinc-900 dark:bg-black"
    >
      <div className="relative flex h-44 items-center justify-center bg-orange-100 text-5xl dark:bg-black">
        {restaurant.imageUrl ? (
          <img
            src={restaurant.imageUrl}
            alt={restaurant.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          'Food'
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent opacity-70" />
        <div className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-800 dark:bg-black dark:text-slate-100">
          View Menu
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{restaurant.name}</h3>
        <p className="text-sm text-orange-600 dark:text-orange-300">{restaurant.cuisineType || 'Cuisine not specified'}</p>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{restaurant.address || 'Address unavailable'}</p>
      </div>
    </button>
  );
}
