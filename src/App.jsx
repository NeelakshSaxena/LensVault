import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useParams, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import EmptyState from './components/EmptyState';
import Gallery from './components/Gallery';
import About from './components/About';
import { connectToGoogleDrive } from './services/googleDrive';

function Portfolio() {
  const { username } = useParams();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPortfolioData = async () => {
      setLoading(true);
      setError(null);
      try {
        const driveData = await connectToGoogleDrive(username);
        if (driveData.files && driveData.files.length > 0) {
          setImages(driveData.files);
        } else {
          setImages([]);
        }
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (username) fetchPortfolioData();
  }, [username]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-surface">
         <span className="material-symbols-outlined text-stone-900 text-6xl animate-spin" style={{fontVariationSettings: "'wght' 100"}}>refresh</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center flex-col gap-4 bg-surface">
        <h2 className="font-notoSerif text-3xl italic">{error}</h2>
        <button onClick={() => window.location.href='/'} className="font-manrope text-xs tracking-widest uppercase hover:text-secondary underline">Return Home</button>
      </div>
    );
  }

  return images.length > 0 ? <Gallery images={images} /> : <EmptyState onConnect={() => {}} />;
}

function Home() {
  return (
    <Hero />
  );
}

function App() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <div className="min-h-screen bg-surface">
      <Header />
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/:username" element={<Portfolio />} />
      </Routes>
      
      {!isHome && (
        <footer className="bg-surface dark:bg-stone-950 w-full py-12 px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 max-w-7xl mx-auto border-t border-stone-200/20 pt-12">
            <div className="flex flex-col gap-2">
              <span className="text-sm font-headline uppercase tracking-widest text-on-surface">THE CURATED LENS</span>
              <p className="font-label text-[10px] tracking-widest text-stone-400">© THE CURATED LENS. PHOTOGRAPHY AS MATERIAL.</p>
            </div>
            <div className="flex gap-8">
              <a className="font-label text-xs tracking-widest text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-all cursor-pointer">Archives</a>
              <a className="font-label text-xs tracking-widest text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-all cursor-pointer">Process</a>
              <a className="font-label text-xs tracking-widest text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-all cursor-pointer">Legal</a>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}

export default App;
