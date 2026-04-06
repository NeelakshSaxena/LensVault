import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

function Hero() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [folderLink, setFolderLink] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [authStep, setAuthStep] = useState('login');
  const [userEmail, setUserEmail] = useState('');

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      setStatus('Checking account...');
      const decoded = jwtDecode(credentialResponse.credential);
      const email = decoded.email;
      setUserEmail(email);

      const response = await fetch(`/api/profile?email=${encodeURIComponent(email)}`);
      const data = await response.json();

      if (data.exists) {
         setStatus('Logged in! Redirecting...');
         navigate(`/${data.username}`);
      } else {
         setStatus('');
         setAuthStep('create_account');
      }
    } catch(err) {
       setStatus('Error checking authentication.');
    } finally {
       setLoading(false);
    }
  };

  const createPortfolio = async (e) => {
    e.preventDefault();
    if (!username || !folderLink) return;

    setStatus('Creating permanent account...');
    setLoading(true);

    try {
      let extractedFolderId = folderLink;
      if (folderLink.includes('folders/')) {
        extractedFolderId = folderLink.split('folders/')[1].split('?')[0];
      } else if (folderLink.includes('id=')) {
        extractedFolderId = folderLink.split('id=')[1].split('&')[0];
      }

      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail, username, folderId: extractedFolderId })
      });

      const data = await response.json();
      
      if (!response.ok) {
        setStatus(`Error: ${data.error}`);
        setLoading(false);
        return;
      }

      setStatus('Success! Redirecting...');
      navigate(`/${data.username}`);
    } catch (error) {
      setStatus('Failed to create account. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-[70vh] flex flex-col justify-center items-center px-4 py-20 text-center animate-fade-in relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[100px] -z-10 animate-pulse-slow pointer-events-none"></div>

      <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-outline bg-surface-container/50 text-xs font-semibold tracking-wider text-secondary uppercase backdrop-blur-sm shadow-sm ring-1 ring-inset ring-white/10 pt-[7px]">
        Welcome to LensVault
      </div>
      
      <h1 className="text-[52px] md:text-[84px] leading-none mb-6 text-on-surface font-notoSerif italic font-light tracking-[-0.04em]">
        The Curated Lens
      </h1>
      
      <p className="text-on-surface-variant max-w-2xl mx-auto mb-12 text-lg md:text-xl font-light font-manrope leading-relaxed">
        Curate your photography automatically. Connect your Google Drive and share your beautiful, dynamic portfolio with clients instantly.
      </p>

      {authStep === 'login' ? (
        <div className="w-[380px] flex flex-col items-center bg-surface-container rounded-3xl p-8 border border-outline shadow-xl backdrop-blur-md">
           <h3 className="text-xl font-bold font-manrope text-on-surface mb-2">Photographer Portal</h3>
           <p className="text-sm font-inter text-on-surface-variant mb-6">Sign in with Google to manage your portfolio.</p>
           
           <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setStatus('Google Sign-In Failed')}
              theme="filled_black"
              size="large"
              shape="pill"
           />
           
           {status && <p className="mt-4 text-xs font-inter text-secondary font-medium tracking-wide">{status}</p>}
        </div>
      ) : (
        <form 
          onSubmit={createPortfolio}
          className="w-full max-w-md mx-auto flex flex-col gap-5 bg-surface-container rounded-3xl p-8 border border-outline shadow-xl backdrop-blur-md"
        >
          <div className="bg-[#ba1a1a]/10 border border-[#ba1a1a]/20 p-4 rounded-2xl flex items-start gap-3 text-left">
            <span className="material-symbols-outlined text-[#ba1a1a] mt-0.5">warning</span>
            <div>
              <p className="text-sm font-semibold font-manrope text-[#ba1a1a] mb-1">Permanent Username</p>
              <p className="text-xs font-inter text-[#ba1a1a]/80 leading-relaxed">
                Choose carefully! Your username will form your permanent portfolio link (/{username || 'username'}). Once set, it is locked to your Gmail forever.
              </p>
            </div>
          </div>

          <div className="flex flex-col text-left group">
            <label htmlFor="username" className="text-xs font-bold font-manrope uppercase tracking-widest text-[#5d5e5b] mb-2 pl-1 group-focus-within:text-primary transition-colors">
              Photographer Alias
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50 font-inter">@</span>
              <input 
                id="username"
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                placeholder="julian-vane" 
                className="w-full bg-surface border border-outline rounded-2xl px-4 py-4 pl-9 text-on-surface font-inter placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary transition-all tracking-wide text-sm"
                required
              />
            </div>
          </div>

          <div className="flex flex-col text-left group">
            <label htmlFor="folderLink" className="text-xs font-bold font-manrope uppercase tracking-widest text-[#5d5e5b] mb-2 pl-1 group-focus-within:text-primary transition-colors">
              Google Drive Folder Link
            </label>
            <input 
              id="folderLink"
              type="text" 
              value={folderLink}
              onChange={(e) => setFolderLink(e.target.value)}
              placeholder="https://drive.google.com/drive/folders/..." 
              className="w-full bg-surface border border-outline rounded-2xl px-4 py-4 text-on-surface font-inter placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary transition-all tracking-wide text-sm"
              required
            />
            <p className="text-xs font-inter text-on-surface-variant mt-2 pl-1 italic">Must be set to "Anyone with the link can view"</p>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-on-primary hover:bg-primary/90 font-medium py-4 px-6 rounded-2xl transition-all shadow-md mt-2 tracking-wide disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden font-manrope text-sm"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <span className="relative flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-lg">sync</span>
                  Creating Vault...
                </>
              ) : (
                <>
                  Connect Portfolio
                  <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </>
              )}
            </span>
          </button>
          
          {status && <p className={`text-sm font-medium mt-2 font-inter ${status.includes('Error') ? 'text-error' : 'text-primary'}`}>{status}</p>}
        </form>
      )}
    </div>
  );
}

export default Hero;
