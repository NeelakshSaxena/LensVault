export default function Gallery({ images }) {
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
                    <div key={image.id} className={`${getMasonryClass(index)} image-reveal group relative overflow-hidden bg-surface-container-low rounded`}>
                      <img 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                        src={image.url} 
                        alt={image.name} 
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
    </main>
  );
}
