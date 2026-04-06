export default function EmptyState({ onConnect }) {
  return (
    <main className="flex-grow flex items-center justify-center pt-24 pb-12 min-h-screen">
      <section className="max-w-4xl w-full editorial-asymmetry flex flex-col items-center text-center">
        <div className="relative w-64 h-64 md:w-80 md:h-80 mb-12 flex items-center justify-center">
          <div className="absolute inset-0 border-[0.5px] border-outline-variant opacity-20 rounded-full"></div>
          <div className="absolute inset-4 border-[0.5px] border-outline-variant opacity-10 rounded-full"></div>
          <div className="relative flex flex-col items-center">
            <span className="material-symbols-outlined text-[120px] md:text-[160px] text-primary/20" data-icon="camera" style={{ fontVariationSettings: "'wght' 100" }}>camera</span>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <span className="material-symbols-outlined text-4xl text-secondary animate-pulse" data-icon="fiber_manual_record" style={{ fontVariationSettings: "'FILL' 1" }}>fiber_manual_record</span>
            </div>
          </div>
        </div>
        <div className="space-y-6 max-w-lg">
          <h2 className="font-headline italic text-4xl md:text-5xl text-on-surface tracking-tight">The Frame is Empty.</h2>
          <p className="text-stone-500 leading-relaxed font-body text-lg">
            Your digital archive awaits curation. Connect your library to begin weaving your visual narrative.
          </p>
          <div className="pt-8 flex flex-col items-center gap-6">
            <button onClick={() => onConnect('default-folder-id')} className="group relative px-8 py-4 bg-primary text-on-primary font-label text-sm tracking-widest uppercase transition-all duration-300 hover:bg-secondary flex items-center gap-3">
              <span className="material-symbols-outlined text-lg" data-icon="google_drive">drive_file_gmail</span>
              Connect
            </button>
            <div className="flex items-center gap-4 text-outline font-label text-[10px] tracking-widest uppercase">
              <span className="w-8 h-[1px] bg-outline-variant/30"></span>
              <span>Select Folder</span>
              <span className="w-8 h-[1px] bg-outline-variant/30"></span>
            </div>
          </div>
        </div>
        <div className="absolute bottom-24 right-[10%] hidden xl:block opacity-40">
          <p className="font-label text-[10px] tracking-[0.3em] uppercase vertical-text transform rotate-90 origin-right text-stone-400">
            Curating Materiality
          </p>
        </div>
      </section>

      <div className="fixed inset-0 -z-10 pointer-events-none opacity-40">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-surface-container-low rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-surface-container-highest rounded-full blur-[100px]"></div>
      </div>
    </main>
  );
}
