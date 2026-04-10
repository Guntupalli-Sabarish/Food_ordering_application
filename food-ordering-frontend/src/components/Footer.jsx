export default function Footer() {
  return (
    <footer className="mt-12 border-t border-slate-200 bg-white py-6 text-center text-sm text-slate-500 transition-colors dark:border-zinc-900 dark:bg-black dark:text-slate-400">
      <p>Copyright {new Date().getFullYear()} FoodApp. All rights reserved.</p>
    </footer>
  );
}
