import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { Sparkles, User, Lock, ArrowRight, ShieldCheck, Type } from 'lucide-react';

export default function Register() {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/auth/register', { name, username, password });
      
      setToast({ message: 'Registrasi berhasil! Mengalihkan ke halaman login...', type: 'success' });
      
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
      
    } catch (err) {
      setError(err.response?.data?.message || 'Registrasi gagal');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 transition-colors duration-300">
      
      {/* CUSTOM TOAST */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl animate-bounce">
          <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-500">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-semibold text-sm text-slate-900 dark:text-white">Berhasil!</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{toast.message}</p>
          </div>
        </div>
      )}

      {/* SISI KIRI: BRANDING */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-100 dark:bg-slate-900 overflow-hidden items-center justify-center border-r border-slate-200 dark:border-slate-800">
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-cyan-500/20 dark:bg-cyan-600/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-indigo-500/20 dark:bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
        
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
            Mulai Perjalanan <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-indigo-500">
              Produktif Lo.
            </span>
          </h1>
          
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-8">
            Bergabung dengan FlowSpace untuk mengatur tugas, berkolaborasi dengan tim, dan pantau deadline dalam satu tempat.
          </p>
        </div>
      </div>

      {/* SISI KANAN: FORM REGISTER */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none lg:hidden" />

        <div className="w-full max-w-md bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-slate-800 p-8 sm:p-10 rounded-3xl shadow-xl dark:shadow-2xl relative z-10">
          
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Daftar Akun</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Bikin workspace lo sendiri sekarang</p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-start gap-2">
              <span className="text-rose-500 text-sm font-medium">{error}</span>
            </div>
          )}
          
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Nama Lengkap</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Type className="w-4 h-4 text-slate-400" />
                </div>
                <input type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="Masukkan nama" className="w-full bg-slate-100 dark:bg-slate-950/50 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-200 text-sm rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <User className="w-4 h-4 text-slate-400" />
                </div>
                <input type="text" value={username} onChange={e => setUsername(e.target.value)} required placeholder="Username unik" className="w-full bg-slate-100 dark:bg-slate-950/50 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-200 text-sm rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="w-4 h-4 text-slate-400" />
                </div>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} placeholder="Minimal 6 karakter" className="w-full bg-slate-100 dark:bg-slate-950/50 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-200 text-sm rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all" />
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white py-3.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-cyan-500/20 active:scale-95 flex items-center justify-center gap-2 mt-4">
              {loading ? 'Memproses...' : (
                <>
                  Daftar Sekarang
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
          
          <p className="text-sm text-center mt-6 text-slate-500 dark:text-slate-400">
            Udah punya akun? <Link to="/" className="text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 font-semibold transition-colors">Login di sini</Link>
          </p>
        </div>
      </div>

    </div>
  );
}