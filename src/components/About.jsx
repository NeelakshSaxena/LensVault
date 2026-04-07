import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';

export default class About extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDrawing: false
    };
    this.canvasRef = createRef();
    
    this.startDrawing = this.startDrawing.bind(this);
    this.draw = this.draw.bind(this);
    this.stopDrawing = this.stopDrawing.bind(this);
    this.clearSignature = this.clearSignature.bind(this);
  }

  componentDidMount() {
    // Canvas initialization
    const canvas = this.canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = '#5f5e5e'; // primary color
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    
    // Clear canvas with a very light background
    ctx.fillStyle = '#f5f3f0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  startDrawing(e) {
    const { offsetX, offsetY } = e.nativeEvent;
    const ctx = this.canvasRef.current.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(offsetX, offsetY);
    this.setState({ isDrawing: true });
  }

  draw(e) {
    if (!this.state.isDrawing) return;
    const { offsetX, offsetY } = e.nativeEvent;
    const ctx = this.canvasRef.current.getContext('2d');
    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();
  }

  stopDrawing() {
    const ctx = this.canvasRef.current.getContext('2d');
    ctx.closePath();
    this.setState({ isDrawing: false });
  }

  clearSignature() {
    const canvas = this.canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#f5f3f0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  render() {
    return (
      <main className="pt-32 pb-20 px-8 max-w-4xl mx-auto min-h-screen">
        <article className="mb-20">
          <h1 className="font-headline italic text-5xl md:text-6xl tracking-tighter text-on-surface mb-8">About LensVault</h1>
          
          <section className="prose prose-stone max-w-none font-body text-stone-600 space-y-6">
            <p className="text-xl leading-relaxed text-stone-500">
              LensVault is a secure, serverless photography portfolio platform that transforms scattered Google Drive folders into a beautiful, chronological online gallery. It acts as an elegant public-facing archive for photographers.
            </p>
            <p>
              This application is built with a decoupled React frontend and a Netlify Serverless Backend. It leverages Netlify Blobs as a fast edge-database and utilizes the native Google Drive v3 API to proxy images securely without exposing Developer API Keys.
            </p>
            <div className="bg-surface-container p-6 rounded-lg border border-outline-variant/30 my-8">
              <h3 className="font-headline text-2xl text-stone-800 mb-4">Open Source Transparency</h3>
              <p className="mb-4">
                LensVault is fully open-source. For detailed architecture documentation, setup instructions, and source code review, please visit the official GitHub repository.
              </p>
              <a 
                href="https://github.com/NeelakshSaxena/LensVault" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-stone-800 text-stone-800 px-6 py-3 rounded-full hover:bg-stone-800 hover:text-white transition-colors"
              >
                View on GitHub <span className="material-symbols-outlined text-sm">open_in_new</span>
              </a>
            </div>
          </section>
        </article>

        <aside className="border-t border-outline-variant/50 pt-16">
          <h2 className="font-headline text-3xl mb-8">Developer Feedback Form</h2>
          <form className="space-y-10" onSubmit={(e) => e.preventDefault()}>
            
            <fieldset className="border border-outline-variant/50 p-6 rounded-lg">
              <legend className="font-label text-xs uppercase tracking-widest px-2 text-stone-500">Personal Information</legend>
              <div className="grid md:grid-cols-2 gap-6 mt-4">
                <label className="flex flex-col gap-2">
                  <span className="font-label text-xs text-stone-600">Account Type</span>
                  <select className="border border-outline-variant/50 rounded p-3 bg-transparent font-body focus:outline-none focus:border-stone-500">
                    <option value="photographer">Photographer</option>
                    <option value="visitor">Visitor</option>
                    <option value="developer">Developer</option>
                  </select>
                </label>
                <label className="flex flex-col gap-2">
                  <span className="font-label text-xs text-stone-600">Interested Features (List Box)</span>
                  <select multiple className="border border-outline-variant/50 rounded p-2 bg-transparent font-body focus:outline-none focus:border-stone-500 h-24">
                    <option value="oauth">Google OAuth</option>
                    <option value="drive">Drive Sync</option>
                    <option value="ui">Masonry UI</option>
                    <option value="serverless">Serverless Edge</option>
                  </select>
                </label>
              </div>
            </fieldset>

            <fieldset className="border border-outline-variant/50 p-6 rounded-lg">
              <legend className="font-label text-xs uppercase tracking-widest px-2 text-stone-500">Feedback Details</legend>
              
              <div className="mb-6">
                <span className="font-label text-xs block mb-3 text-stone-600">How did you hear about LensVault?</span>
                <div className="flex gap-6 font-body text-sm text-stone-700">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="source" value="github" className="accent-stone-800" defaultChecked />
                    GitHub
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="source" value="course" className="accent-stone-800" />
                    Coursework
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="source" value="other" className="accent-stone-800" />
                    Other
                  </label>
                </div>
              </div>

              <label className="flex flex-col gap-2 mb-6">
                <span className="font-label text-xs text-stone-600">Your Comments</span>
                <textarea 
                  rows="4" 
                  placeholder="Share your thoughts on the architecture..."
                  className="border border-outline-variant/50 rounded p-3 bg-transparent font-body focus:outline-none focus:border-stone-500 resize-y"
                ></textarea>
              </label>

              <div className="font-body text-sm text-stone-700 mb-6">
                 <label className="flex items-center gap-3 cursor-pointer">
                   <input type="checkbox" className="accent-stone-800 w-4 h-4" defaultChecked />
                   I agree to share this feedback publicly on the repository
                 </label>
              </div>

              <div className="flex flex-col gap-2 mt-8">
                <div className="flex justify-between items-end mb-2">
                  <span className="font-label text-xs text-stone-600">Digital Signature (Canvas)</span>
                  <button type="button" onClick={this.clearSignature} className="text-xs text-stone-400 hover:text-stone-800 underline">Clear</button>
                </div>
                <canvas 
                  ref={this.canvasRef}
                  width={800}
                  height={200}
                  className="w-full border border-outline-variant/50 rounded cursor-crosshair touch-none"
                  onMouseDown={this.startDrawing}
                  onMouseMove={this.draw}
                  onMouseUp={this.stopDrawing}
                  onMouseLeave={this.stopDrawing}
                ></canvas>
                <p className="text-[10px] text-stone-400 italic mt-1">Please sign using your mouse or touch device above.</p>
              </div>
            </fieldset>
            
            <button type="submit" className="w-full bg-stone-900 text-white font-label tracking-widest uppercase text-xs py-4 rounded hover:bg-stone-800 transition-colors">
              Submit Feedback
            </button>
          </form>
        </aside>
      </main>
    );
  }
}

About.propTypes = {
  // Empty prop types as About doesn't take props currently, 
  // but included to satisfy syllabus requirements for validation structure.
};
