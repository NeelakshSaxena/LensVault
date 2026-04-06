import { useState } from 'react';

export default function Hero({ onConnect, isLoading }) {
  const [username, setUsername] = useState('');
  const [folderLink, setFolderLink] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !folderLink) return;
    onConnect(username, folderLink);
  };

  return (
    <main>
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-surface">
        <div className="absolute inset-0 z-0 opacity-90">
          <img alt="Cinematic wide shot" className="w-full h-full object-cover grayscale brightness-95" src="/stitch_screens/hero.png" onError={(e) => { e.target.src = 'https://source.unsplash.com/random/1920x1080/?landscape,misty,mountains'; }} />
        </div>
        <div className="relative z-10 text-center px-6">
          <h2 className="text-stone-900/40 font-manrope text-xs tracking-[0.4em] uppercase mb-8">Photography by</h2>
          <h1 className="text-stone-900 font-notoSerif italic text-7xl md:text-9xl tracking-tighter leading-none mb-12">
            LensVault
          </h1>
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 mt-12">
            <button onClick={() => window.scrollTo({top: window.innerHeight, behavior: 'smooth'})} className="bg-primary text-on-primary px-10 py-4 font-manrope text-[10px] uppercase tracking-widest hover:bg-secondary transition-all duration-300 shadow-xl shadow-stone-950/5">
              Start Curating
            </button>
            <div className="flex items-center gap-4 text-stone-500 font-inter text-[10px] uppercase tracking-widest">
              <span>EST. 2026</span>
              <span className="w-12 h-px bg-stone-300"></span>
              <span>Global</span>
            </div>
          </div>
        </div>
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 text-stone-400">
          <span className="font-manrope text-[10px] uppercase tracking-widest">Connect</span>
          <div className="w-px h-16 bg-stone-200 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1/2 bg-stone-500 animate-pulse"></div>
          </div>
        </div>
      </section>

      <section className="py-32 px-8 bg-surface-container-low min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 items-center">
            <div className="lg:col-span-5">
              <span className="text-secondary font-manrope text-[10px] uppercase tracking-[0.3em] font-bold block mb-6">Integration</span>
              <h2 className="font-notoSerif text-5xl leading-tight text-on-surface mb-8">
                Photography as <br /><span className="italic">Material</span>.
              </h2>
              <p className="font-manrope text-stone-600 leading-relaxed mb-12 max-w-md">
                Your visual narrative deserves a seamless bridge. Connect your raw archives directly through Google Drive for automated curation and instantly share your portfolio with the world.
              </p>
              <div className="space-y-6">
                <div className="flex items-start gap-4 p-6 bg-surface-container-lowest border border-stone-100 transition-all duration-300 hover:shadow-lg hover:shadow-stone-900/5 group">
                  <span className="material-symbols-outlined text-stone-400 group-hover:text-secondary transition-colors" data-icon="share">share</span>
                  <div>
                    <h4 className="font-manrope font-bold text-xs uppercase tracking-widest mb-1">Live Synchronization</h4>
                    <p className="text-xs text-stone-500">Real-time updates as you upload new projects. Share your /username link anywhere.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-7 w-full">
              <div className="relative bg-surface-container-lowest p-16 animate-fade-in shadow-2xl shadow-stone-900/5 overflow-hidden">
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-surface-container rounded-full opacity-50 blur-3xl"></div>
                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="w-24 h-24 bg-surface-container-low rounded-full flex items-center justify-center mb-10">
                    <span className="material-symbols-outlined text-stone-900 text-4xl" data-icon="google_drive">drive_file_gmail</span>
                  </div>
                  <h3 className="font-notoSerif italic text-3xl mb-4">Create Portfolio</h3>
                  <p className="font-manrope text-sm text-stone-500 mb-12 max-w-sm">
                    Enter a unique username and connect your open-access Google Drive folder linking.
                  </p>
                  
                  <form onSubmit={handleSubmit} className="w-full max-w-md space-y-8">
                    <div className="relative group text-left">
                      <label className="text-[10px] uppercase font-manrope tracking-widest text-stone-400 mb-2 block">Choose Username</label>
                      <input 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full bg-transparent border-0 border-b border-stone-200 py-3 px-0 focus:ring-0 focus:border-secondary transition-all font-manrope text-sm placeholder:text-stone-300" 
                        placeholder="e.g. julian-vane" 
                        type="text" 
                        required
                      />
                    </div>
                    
                    <div className="relative group text-left">
                       <label className="text-[10px] uppercase font-manrope tracking-widest text-stone-400 mb-2 block">Google Drive Folder Link</label>
                      <input 
                        value={folderLink}
                        onChange={(e) => setFolderLink(e.target.value)}
                        className="w-full bg-transparent border-0 border-b border-stone-200 py-3 px-0 focus:ring-0 focus:border-secondary transition-all font-manrope text-sm placeholder:text-stone-300" 
                        placeholder="https://drive.google.com/drive/folders/..." 
                        type="text" 
                        required
                      />
                    </div>
                    
                    <button 
                      type="submit" 
                      disabled={isLoading}
                      className="w-full bg-stone-900 text-stone-50 py-5 font-manrope text-[10px] uppercase tracking-widest hover:bg-secondary transition-all duration-500 flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                      {isLoading ? (
                        <span className="material-symbols-outlined animate-spin">refresh</span>
                      ) : (
                        <>
                          Create Shareable Link
                          <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
