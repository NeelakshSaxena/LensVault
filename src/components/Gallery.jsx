import { useState } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';

export default function Gallery({ images }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [shareStatus, setShareStatus] = useState('');
  const { username } = useParams();

  const handleShare = async (e, image) => {
    e.stopPropagation();
    setShareStatus('Pinning...');
    try {
      const response = await fetch('/api/feed', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ ...image, username })
      });
      if (response.ok) setShareStatus('Pinned to Global Feed!');
      else setShareStatus('Failed to pin.');
      
      setTimeout(() => setShareStatus(''), 3000);
    } catch(err) {
       setShareStatus('Error pinning.');
       setTimeout(() => setShareStatus(''), 3000);
    }
  };

  // Group images by year and month
  const groupedImages = images.reduce((acc, image) => {
    const date = new Date(image.createdTime || Date.now());
    const year = date.getFullYear();
    const month = date.toLocaleString('default', { month: 'long' });
    const monthIndex = date.getMonth() + 1;
    const monthKey = `${monthIndex.toString().padStart(2, '0')} — ${month}`;
    
    if (!acc[year]) acc[year] = {};
    if (!acc[year][monthKey]) acc[year][monthKey] = [];
    
    acc[year][monthKey].push(image);
    return acc;
  }, {});

  const getMasonryClass = (index) => {
    if (index % 3 === 0) return 'masonry-item-tall';
    if (index % 3 === 1) return 'masonry-item-medium';
    return 'masonry-item-short';
  };

  return (
    <main className="pt-28 pb-20 px-8 max-w-screen-2xl mx-auto min-h-screen">
      <header className="mb-20 text-center md:text-left">
        <h1 className="font-headline italic text-5xl md:text-7xl tracking-tighter text-on-surface mb-6">Archives</h1>
        <p className="font-body text-stone-500 max-w-xl text-lg leading-relaxed">
          A chronological exploration of light and form. Every frame captured as a material witness to time.
        </p>
      </header>

      <div className="space-y-32">
        {Object.keys(groupedImages).sort((a,b) => b - a).map((year) => (
          <section key={year}>
            <div className="sticky top-[72px] z-40 bg-surface/90 backdrop-blur-md py-4 mb-12 flex items-baseline justify-between">
              <h2 className="font-headline text-4xl text-on-surface">{year}</h2>
              <span className="font-label text-[10px] uppercase tracking-[0.3em] text-secondary">The Archive</span>
            </div>

            {Object.keys(groupedImages[year]).sort().reverse().map((monthKey) => (
              <div className="mb-20" key={monthKey}>
                <div className="mb-8 flex items-center gap-4">
                  <span className="font-label text-xs uppercase tracking-widest text-stone-400">{monthKey}</span>
                  <div className="h-px flex-grow bg-outline-variant/20"></div>
                </div>

                <div className="masonry-grid gap-6">
                  {groupedImages[year][monthKey].map((image, index) => (
                    <div 
                      key={image.id} 
                      className={`${getMasonryClass(index)} cursor-pointer image-reveal group relative overflow-hidden bg-surface-container-low rounded`}
                      onClick={() => setSelectedImage(image)}
                    >
                      <img 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                        src={image.url} 
                        alt={image.name} 
                        loading="lazy"
                      />
                      <div className="metadata-overlay absolute inset-0 opacity-0 transition-opacity duration-500 flex flex-col justify-end p-6">
                        <div className="transform translate-y-4 transition-transform duration-500 group-hover:translate-y-0">
                          <p className="font-label text-[10px] uppercase tracking-widest text-secondary-fixed mb-2">
                            {new Date(image.createdTime).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                          </p>
                          <h3 className="font-headline text-white text-xl mb-4 italic">{image.name || "Untitled"}</h3>
                          <div className="flex gap-4 border-t border-white/20 pt-4">
                            <div className="text-white/70 font-label text-[9px] uppercase tracking-tighter">
                              <span className="block text-white/40">Lens</span> {image.metadata?.lens || '35mm f/1.4'}
                            </div>
                            <div className="text-white/70 font-label text-[9px] uppercase tracking-tighter">
                              <span className="block text-white/40">ISO</span> {image.metadata?.iso || '400'}
                            </div>
                            <div className="text-white/70 font-label text-[9px] uppercase tracking-tighter">
                              <span className="block text-white/40">Shutter</span> {image.metadata?.shutter || '1/250'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </section>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 md:p-12 cursor-zoom-out"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-7xl max-h-full flex items-center justify-center cursor-default" onClick={e => e.stopPropagation()}>
            <img 
              src={selectedImage.url} 
              alt={selectedImage.name} 
              className="max-w-full max-h-[85vh] object-contain rounded drop-shadow-2xl"
            />
            
            <div className="absolute -top-12 right-0 flex gap-4 items-center">
              <span className="text-secondary tracking-widest text-xs uppercase">{shareStatus}</span>
              <button 
                onClick={(e) => handleShare(e, selectedImage)}
                className="text-white/70 hover:text-white transition-colors bg-white/10 px-4 py-1.5 rounded-full text-xs font-inter uppercase tracking-widest border border-white/20 hover:bg-white/20 flex gap-2 items-center"
              >
                <span className="material-symbols-outlined text-[16px]">public</span>
                Share to global
              </button>
              <button 
                onClick={() => setSelectedImage(null)}
                className="text-white/50 hover:text-white transition-colors ml-4"
              >
                <span className="material-symbols-outlined text-3xl">close</span>
              </button>
            </div>

            <div className="absolute -bottom-16 left-0 right-0 text-center">
               <h3 className="font-headline text-white text-lg italic">{selectedImage.name}</h3>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

Gallery.propTypes = {
  images: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string,
      url: PropTypes.string.isRequired,
      createdTime: PropTypes.string.isRequired,
      metadata: PropTypes.shape({
        lens: PropTypes.string,
        iso: PropTypes.string,
        shutter: PropTypes.string
      })
    })
  ).isRequired
};
