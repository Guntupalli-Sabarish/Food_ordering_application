import { useEffect, useMemo, useState } from 'react';
import { getAllRestaurants } from '../api/restaurantApi';
import ErrorAlert from '../components/ErrorAlert';
import LoadingSpinner from '../components/LoadingSpinner';
import RestaurantCard from '../components/RestaurantCard';

export default function HomePage() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [activeCuisine, setActiveCuisine] = useState('All');
  const [sortBy, setSortBy] = useState('featured');
  const [spotlightIndex, setSpotlightIndex] = useState(0);

  useEffect(() => {
    const loadRestaurants = async () => {
      try {
        const res = await getAllRestaurants();
        const data = res.data.data || [];
        setRestaurants(data);
      } catch {
        setError('Failed to load restaurants. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadRestaurants();
  }, []);

  useEffect(() => {
    if (restaurants.length === 0) {
      return;
    }

    const timer = setInterval(() => {
      setSpotlightIndex((prev) => (prev + 1) % restaurants.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [restaurants]);

  const cuisines = useMemo(() => {
    const list = restaurants.map((item) => item.cuisineType).filter(Boolean);
    return ['All', ...new Set(list)];
  }, [restaurants]);

  const filteredRestaurants = useMemo(() => {
    const query = search.trim().toLowerCase();

    let result = restaurants.filter((restaurant) => {
      const matchesQuery =
        query.length === 0 ||
        restaurant.name.toLowerCase().includes(query) ||
        (restaurant.cuisineType || '').toLowerCase().includes(query) ||
        (restaurant.address || '').toLowerCase().includes(query);

      const matchesCuisine = activeCuisine === 'All' || restaurant.cuisineType === activeCuisine;

      return matchesQuery && matchesCuisine;
    });

    if (sortBy === 'name-asc') {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    }

    if (sortBy === 'name-desc') {
      result = [...result].sort((a, b) => b.name.localeCompare(a.name));
    }

    if (sortBy === 'cuisine') {
      result = [...result].sort((a, b) => (a.cuisineType || '').localeCompare(b.cuisineType || ''));
    }

    return result;
  }, [restaurants, search, activeCuisine, sortBy]);

  const spotlightRestaurant =
    filteredRestaurants.length > 0
      ? filteredRestaurants[spotlightIndex % filteredRestaurants.length]
      : restaurants[spotlightIndex % Math.max(restaurants.length, 1)];

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 md:py-10">
      <section className="relative mb-8 overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-zinc-900 dark:bg-black md:p-8">
        <div className="pointer-events-none absolute -left-16 -top-16 h-44 w-44 rounded-full bg-slate-200/50 blur-3xl dark:bg-orange-500/10" />
        <div className="pointer-events-none absolute -bottom-24 -right-16 h-56 w-56 rounded-full bg-slate-200/50 blur-3xl dark:bg-cyan-500/10" />

        <div className="relative grid gap-6 lg:grid-cols-[1.25fr,0.75fr] lg:items-end">
          <div>
            <p className="mb-2 inline-flex rounded-full bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-orange-700 dark:bg-black dark:text-orange-300">
              Discover New Flavors
            </p>
            <h1 className="mb-3 text-4xl font-black leading-tight text-slate-900 dark:text-white md:text-5xl">
              Order Food You Love
            </h1>
            <p className="max-w-xl text-slate-600 dark:text-slate-300">
              Explore curated kitchens, filter by cuisine, and place your order in minutes.
            </p>

            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="rounded-xl bg-white/80 p-3 shadow-sm dark:bg-black">
                <p className="text-xl font-bold text-slate-900 dark:text-white">{restaurants.length}</p>
                <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Restaurants</p>
              </div>
              <div className="rounded-xl bg-white/80 p-3 shadow-sm dark:bg-black">
                <p className="text-xl font-bold text-slate-900 dark:text-white">{Math.max(cuisines.length - 1, 0)}</p>
                <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Cuisines</p>
              </div>
              <div className="rounded-xl bg-white/80 p-3 shadow-sm dark:bg-black">
                <p className="text-xl font-bold text-slate-900 dark:text-white">{filteredRestaurants.length}</p>
                <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Showing</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/70 bg-white/85 p-4 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-black">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-orange-700 dark:text-orange-300">
              Spotlight Kitchen
            </p>
            {spotlightRestaurant ? (
              <>
                <p className="text-xl font-bold text-slate-900 dark:text-white">{spotlightRestaurant.name}</p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{spotlightRestaurant.cuisineType || 'Cuisine'}</p>
                <p className="mt-2 line-clamp-2 text-sm text-slate-600 dark:text-slate-300">
                  {spotlightRestaurant.address || 'Fresh meals and quick delivery in your area.'}
                </p>
              </>
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-400">Restaurants will appear here once loaded.</p>
            )}
          </div>
        </div>
      </section>

      <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-zinc-900 dark:bg-black md:p-5">
        <div className="grid gap-3 md:grid-cols-[1fr,220px] md:items-center">
          <label className="group relative">
            <span className="pointer-events-none absolute left-4 top-3.5 text-sm text-slate-400 group-focus-within:text-orange-500">
              Search
            </span>
            <input
              type="text"
              placeholder="Search restaurants, cuisine, location"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 pb-3 pt-8 text-slate-800 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-200 dark:border-zinc-800 dark:bg-black dark:text-slate-100 dark:focus:bg-black dark:focus:ring-orange-500/25"
            />
          </label>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-200 dark:border-zinc-800 dark:bg-black dark:text-slate-200 dark:focus:ring-orange-500/25"
          >
            <option value="featured">Sort: Featured</option>
            <option value="name-asc">Sort: Name A-Z</option>
            <option value="name-desc">Sort: Name Z-A</option>
            <option value="cuisine">Sort: Cuisine</option>
          </select>
        </div>

        <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
          {cuisines.map((cuisine) => (
            <button
              key={cuisine}
              type="button"
              onClick={() => setActiveCuisine(cuisine)}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide transition ${
                activeCuisine === cuisine
                  ? 'bg-orange-500 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-black dark:text-slate-300 dark:hover:bg-zinc-900'
              }`}
            >
              {cuisine}
            </button>
          ))}
        </div>
      </section>

      {loading && <LoadingSpinner />}
      <ErrorAlert message={error} />

      {!loading && !error && filteredRestaurants.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center dark:border-zinc-800 dark:bg-black">
          <p className="text-lg font-semibold text-slate-700 dark:text-slate-200">No restaurants found</p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Try another search term or cuisine filter.</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredRestaurants.map((restaurant) => (
          <RestaurantCard key={restaurant.id} restaurant={restaurant} />
        ))}
      </div>
    </div>
  );
}
