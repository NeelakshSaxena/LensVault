import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function GlobalFeed() {
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadFeed() {
      try {
        const response = await fetch('/api/feed');
        if (response.ok) {
          const data = await response.json();
          setFeed(data);
        }
      } catch (err) {
        console.error("Failed to load feed", err);
      } finally {
        setLoading(false);
      }
    }
    loadFeed();
  }, []);

  if (loading) return null;
  if (!feed || feed.length === 0) return null;

  const getMasonryClass = (index) => {
    if (index % 5 === 0) return 'masonry-item-tall';
    if (index % 2 === 1) return 'masonry-item-medium';
    return 'masonry-item-short';
  };

  return (
    <section className="w-full max-w-screen-2xl mx-auto px-8 py-24 border-t border-stone-200/20">
      <div className="text-center mb-16">
        <h2 className="font-headline italic text-4xl text-on-surface mb-2">The Global Archive</h2>
        <p className="font-label text-xs uppercase tracking-[0.3em] text-stone-400">Curated by the community</p>
      </div>

      <div className="masonry-grid gap-4">
        {feed.map((image, index) => (
          <div 
            key={`${image.id}-${index}`} 
            className={`${getMasonryClass(index)} cursor-pointer image-reveal group relative overflow-hidden bg-surface-container-low rounded`}
            onClick={() => navigate(`/${image.username}`)}
          >
            <img 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              src={image.url} 
              alt={image.name} 
              loading="lazy"
            />
            <div className="metadata-overlay absolute inset-0 opacity-0 transition-opacity duration-500 flex flex-col justify-end p-6 bg-gradient-to-t from-black/80 via-black/20 to-transparent">
              <div className="transform translate-y-4 transition-transform duration-500 group-hover:translate-y-0">
                <p className="font-label text-[10px] uppercase tracking-widest text-secondary-fixed mb-1">
                  Photographer
                </p>
                <h3 className="font-headline text-white text-2xl mb-4 italic">@{image.username}</h3>
                <div className="flex gap-4 border-t border-white/20 pt-4">
                  <span className="text-white/70 font-label text-[9px] uppercase tracking-tighter hover:text-white flex items-center gap-1">
                    <span className="material-symbols-outlined text-[12px]">open_in_new</span>
                    View Portfolio
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
