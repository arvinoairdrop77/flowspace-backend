import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { Sparkles, User, Lock, ArrowRight, ShieldCheck } from 'lucide-react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { username, password });
      
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('name', res.data.name);
      localStorage.setItem('role', res.data.role);
      localStorage.setItem('username', username);

      localStorage.setItem('theme', 'light');
      document.documentElement.classList.remove('dark');
      
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err.response?.data?.message || 'Username atau password salah');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 transition-colors duration-300">
      
      {/* SISI KIRI: BRANDING & GLOW (Sembunyi di HP) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-100 dark:bg-slate-900 overflow-hidden items-center justify-center border-r border-slate-200 dark:border-slate-800">
        
        {/* Efek Pendaran */}
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-cyan-500/20 dark:bg-cyan-600/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-indigo-500/20 dark:bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="relative z-10 p-12 max-w-lg">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-violet-500 p-0.5 shadow-lg shadow-cyan-500/30 mb-8">
            <div className="w-full h-full bg-white dark:bg-slate-950 rounded-[14px] flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <defs>
                  <linearGradient id="nav-orb-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#06b6d4"/>
                    <stop offset="100%" stopColor="#6366f1"/>
                  </linearGradient>
                </defs>
                <ellipse cx="50" cy="50" rx="40" ry="18" fill="none" stroke="url(#nav-orb-grad)" strokeWidth="6" transform="rotate(-28 50 50)"/>
                <rect x="24" y="24" width="28" height="28" rx="7" fill="#06b6d4"/>
                <rect x="46" y="46" width="28" height="28" rx="7" fill="#6366f1"/>
                <circle cx="82" cy="30" r="5" fill="#06b6d4"/>
              </svg>
            </div>
          </div>
          
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-4 leading-tight">
            Kelola Tugas <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-indigo-500">
              Lebih Terorganisir.
            </span>
          </h1>
          
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-8">
            FlowSpace adalah ruang kerja kolaboratif untuk mengatur proyek, melacak *deadline*, dan menyelesaikan tugas tepat waktu.
          </p>

          <div className="flex items-center gap-3 text-xs font-mono text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 w-fit px-4 py-2 rounded-lg border border-cyan-500/20">
            <ShieldCheck className="w-4 h-4" />
            <span>End-to-End Encrypted</span>
          </div>
        </div>
      </div>

      {/* SISI KANAN: FORM LOGIN */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative">
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none lg:hidden" />

        <div className="w-full max-w-md bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-slate-800 p-8 sm:p-10 rounded-3xl shadow-xl dark:shadow-2xl relative z-10">
          
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Selamat Datang</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Masuk ke workspace lo</p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-start gap-2">
              <span className="text-rose-500 text-sm font-medium">{error}</span>
            </div>
          )}
          
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <User className="w-4 h-4 text-slate-400" />
                </div>
                <input 
                  type="text" 
                  value={username} 
                  onChange={e => setUsername(e.target.value)} 
                  required
                  placeholder="Masukkan username"
                  className="w-full bg-slate-100 dark:bg-slate-950/50 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-200 text-sm rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all" 
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="w-4 h-4 text-slate-400" />
                </div>
                <input 
                  type="password" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  required
                  placeholder="••••••••"
                  className="w-full bg-slate-100 dark:bg-slate-950/50 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-200 text-sm rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all" 
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white py-3.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-cyan-500/20 active:scale-95 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? 'Memproses...' : (
                <>
                  Masuk ke Dashboard
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
          
          <p className="text-sm text-center mt-6 text-slate-500 dark:text-slate-400">
            Belum punya akun? <Link to="/register" className="text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 font-semibold transition-colors">Daftar Coyy</Link>
          </p>
        </div>
      </div>

    </div>
  );
}