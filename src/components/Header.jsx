import { Link, useLocation } from 'react-router-dom';

export default function Header() {
  const location = useLocation();
  const isHero = location.pathname === '/';

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-500 border-b ${isHero ? 'bg-transparent border-transparent' : 'bg-surface/80 backdrop-blur-md border-stone-200/20 dark:bg-stone-950/80 dark:border-stone-800/50'}`}>
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex flex-col group cursor-pointer">
          <span className={`font-notoSerif italic text-xl md:text-2xl tracking-tighter ${isHero ? 'text-stone-900' : 'text-on-surface'}`}>
            LensVault
          </span>
          <div className="w-0 h-px bg-secondary transition-all duration-500 group-hover:w-full"></div>
        </Link>
        <nav className="hidden md:flex gap-12">
          {['Home', 'Gallery', 'About'].map(item => (
            <Link key={item} to={item === 'Home' ? '/' : '#'} className={`font-inter text-xs tracking-widest uppercase hover:text-secondary transition-colors ${isHero ? 'text-stone-600' : 'text-stone-400'}`}>
              {item}
            </Link>
          ))}
        </nav>
        <Link to="/" className={`hidden md:block border px-6 py-2 rounded-full font-inter text-[10px] tracking-widest uppercase transition-colors ${isHero ? 'border-primary text-primary hover:bg-primary/5' : 'border-stone-300 text-stone-600 dark:border-stone-700 dark:text-stone-400 hover:border-secondary hover:text-secondary'}`}>
          Join
        </Link>
        <button className="md:hidden">
          <span className={`material-symbols-outlined ${isHero ? 'text-stone-900' : 'text-stone-100'}`} data-icon="menu">menu</span>
        </button>
      </div>
    </header>
  );
}
