import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { 
  LayoutDashboard, LogOut, Trash2, FolderPlus, AlertCircle, Users, Edit, X, 
  Sun, Moon, Search, Plus, FolderOpen, Code, CheckSquare, Clock, 
  Settings, User 
} from 'lucide-react';

export default function AdminDashboard() {
  const [boards, setBoards] = useState([]);
  const [newBoardName, setNewBoardName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // State Hapus & Edit
  const [boardToDelete, setBoardToDelete] = useState(null);
  const [boardToEdit, setBoardToEdit] = useState(null);
  const [editName, setEditName] = useState('');
  const [editTags, setEditTags] = useState([]);
  const [newTagInput, setNewTagInput] = useState('');
  
  // State Jam & Tema
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isDark, setIsDark] = useState(() => localStorage.getItem('theme') === 'dark');

  const navigate = useNavigate();
  const name = localStorage.getItem('name');
  const role = localStorage.getItem('role');

  // Efek Tema
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  // Efek Jam
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchBoards = async () => {
    try {
      const res = await api.get('/boards');
      setBoards(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchBoards(); }, []);

  const handleCreateBoard = async (e) => {
    e.preventDefault();
    if (!newBoardName.trim()) return;
    try {
      await api.post('/boards', { name: newBoardName });
      setNewBoardName('');
      setIsCreating(false);
      fetchBoards();
    } catch (err) { alert('Gagal bikin board'); }
  };

  const handleDeleteBoard = async () => {
    if (!boardToDelete) return;
    try {
      await api.delete(`/boards/${boardToDelete.id}`);
      setBoardToDelete(null);
      fetchBoards();
    } catch (err) { alert('Gagal hapus board'); }
  };

  const openEditModal = (board) => {
    setBoardToEdit(board);
    setEditName(board.name);
    try {
      const tagsArr = board.tags ? JSON.parse(board.tags) : [];
      setEditTags(tagsArr);
    } catch { setEditTags([]); }
    setNewTagInput('');
  };

  const handleUpdateBoard = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/boards/${boardToEdit.id}`, {
        name: editName,
        tags: JSON.stringify(editTags)
      });
      setBoardToEdit(null);
      fetchBoards();
    } catch (err) { alert('Gagal update board'); }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  // Filter Board berdasarkan pencarian
  const filteredBoards = boards.filter(b => b.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="min-h-screen flex flex-col font-sans antialiased text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-950 relative selection:bg-cyan-500 selection:text-white transition-colors duration-300 overflow-x-hidden">
      
      {/* Mesh Background Keren */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-60 dark:opacity-20" style={{
        backgroundImage: 'radial-gradient(at 0% 0%, rgba(6, 182, 212, 0.15) 0px, transparent 40%), radial-gradient(at 100% 0%, rgba(99, 102, 241, 0.15) 0px, transparent 40%), radial-gradient(#cbd5e1 0.75px, transparent 0.75px)',
        backgroundSize: '100% 100%, 100% 100%, 24px 24px'
      }} />
      <div className="fixed -top-24 -left-24 w-96 h-96 bg-cyan-300/20 dark:bg-cyan-900/20 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed top-1/3 -right-24 w-96 h-96 bg-indigo-300/20 dark:bg-indigo-900/20 rounded-full blur-3xl pointer-events-none" />

      {/* Header Global */}
      <header className="w-full border-b border-slate-200/70 dark:border-slate-800/70 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-40 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center drop-shadow-md">
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
            <div>
              <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">FlowSpace</span>
              <span className="text-[10px] font-semibold text-cyan-600 bg-cyan-50 dark:bg-cyan-950/50 border border-cyan-200 dark:border-cyan-800 px-2 py-0.5 rounded-full ml-1.5 hidden sm:inline-block">Workspace</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={() => setIsDark(!isDark)} className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center transition-colors">
              {isDark ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4" />}
            </button>
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-1"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-md">
                {name?.charAt(0).toUpperCase()}
              </div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 hidden md:inline">{name}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6 relative z-10">
        
        {/* Banner Admin */}
        <div className="w-full bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:shadow-md">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white flex items-center justify-center text-xl shrink-0 shadow-lg shadow-cyan-500/20">
              <LayoutDashboard className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">Admin Workspace</h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Halo <span className="font-semibold text-slate-700 dark:text-slate-300">{name}</span>, atur semua catatanmu di sini.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {role === 'SUPERADMIN' && (
              <button onClick={() => navigate('/users')} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2 active:scale-95">
                <Users className="w-4 h-4" /> User Management
              </button>
            )}
            <div className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>{currentTime.toLocaleTimeString('id-ID')} WIB</span>
            </div>
            <button onClick={handleLogout} className="px-4 py-2 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-200/60 dark:border-rose-800/60 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2">
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>

        {/* Section Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Papan Kerja Utama</span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">All Boards</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Pilih papan kerja untuk mengelola alur kanban & tugas anggota tim.</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Cari board..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 shadow-sm transition-all" 
              />
            </div>
          </div>
        </div>

        {/* Grid Board */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {filteredBoards.map(board => (
            <div key={board.id} className="bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-900/30 text-amber-500 flex items-center justify-center text-2xl shadow-sm group-hover:scale-110 transition-transform">
                    <FolderOpen className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                    Aktif
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">{board.name}</h3>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">{board.lists?.length || 0} Kolom Tugas</p>
              </div>

              <div className="flex items-center gap-2 mt-6">
                <button onClick={() => navigate(`/board/${board.id}`)} className="flex-1 py-2.5 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white text-xs font-bold rounded-xl transition-colors text-center">
                  Buka Board
                </button>
                <button onClick={() => openEditModal(board)} className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-cyan-50 dark:hover:bg-cyan-950 hover:text-cyan-600 text-slate-500 dark:text-slate-400 flex items-center justify-center transition-colors" title="Edit Board">
                  <Edit className="w-4 h-4" />
                </button>
                <button onClick={() => setBoardToDelete(board)} className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 text-rose-500 flex items-center justify-center transition-colors" title="Hapus Board">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {/* Add New Board Card */}
          <button onClick={() => setIsCreating(true)} className="w-full h-full min-h-[220px] rounded-3xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-cyan-500 bg-white/40 dark:bg-slate-900/40 hover:bg-cyan-50/30 dark:hover:bg-cyan-950/30 transition-all duration-300 p-6 flex flex-col items-center justify-center text-center group">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 group-hover:bg-cyan-500 dark:group-hover:bg-cyan-600 text-slate-500 dark:text-slate-400 group-hover:text-white flex items-center justify-center text-2xl mb-3 shadow-sm transition-all group-hover:scale-110">
              <FolderPlus className="w-7 h-7" />
            </div>
            <span className="font-bold text-slate-800 dark:text-slate-200 text-base group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">Bikin Board Baru</span>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-[200px]">Tambah ruang kerja baru untuk manajemen proyek tim</p>
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-200/70 dark:border-slate-800/70 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm py-4 mt-8 relative z-10 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
          <p>© 2026 FlowSpace Management • Dynamic Dashboard System</p>
        </div>
      </footer>

      {/* MODAL CREATE BOARD */}
      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 dark:bg-slate-950/80 backdrop-blur-sm transition-colors">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-sm p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Tambah Board Baru</h3>
            <form onSubmit={handleCreateBoard}>
              <input autoFocus required type="text" placeholder="Nama Board..." value={newBoardName} onChange={e => setNewBoardName(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:border-cyan-500 focus:outline-none mb-4 transition-colors" />
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setIsCreating(false)} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">Batal</button>
                <button type="submit" className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold rounded-xl shadow-md transition-colors">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL EDIT BOARD */}
      {boardToEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 dark:bg-slate-950/80 backdrop-blur-sm transition-colors">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Edit Board</h3>
            <form onSubmit={handleUpdateBoard} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Nama Board</label>
                <input type="text" value={editName} onChange={e => setEditName(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-900 dark:text-white focus:border-cyan-500 focus:outline-none transition-colors" required />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Tag Filter Board</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {editTags.map(tag => (
                    <span key={tag} className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs px-2.5 py-1 rounded-full flex items-center gap-1.5 border border-slate-300 dark:border-slate-700 transition-colors">
                      {tag}
                      <button type="button" onClick={() => setEditTags(editTags.filter(t => t !== tag))} className="text-slate-400 hover:text-rose-500"><X className="w-3 h-3" /></button>
                    </span>
                  ))}
                  {editTags.length === 0 && <span className="text-xs text-slate-500 italic">Belum ada tag.</span>}
                </div>
                <div className="flex gap-2">
                  <input type="text" placeholder="Ketik tag baru..." value={newTagInput} onChange={e => setNewTagInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); if (newTagInput.trim() && !editTags.includes(newTagInput.trim())) { setEditTags([...editTags, newTagInput.trim()]); setNewTagInput(''); } } }} className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white focus:border-cyan-500 focus:outline-none transition-colors" />
                  <button type="button" onClick={() => { if (newTagInput.trim() && !editTags.includes(newTagInput.trim())) { setEditTags([...editTags, newTagInput.trim()]); setNewTagInput(''); } }} className="px-4 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-white rounded-xl text-sm font-semibold transition-colors">+</button>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button type="button" onClick={() => setBoardToEdit(null)} className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs rounded-xl hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors">Batal</button>
                <button type="submit" className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold rounded-xl transition-colors">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CUSTOM MODAL HAPUS */}
      {boardToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 dark:bg-slate-950/80 backdrop-blur-sm transition-colors">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-sm p-6 shadow-2xl">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-500/20 flex items-center justify-center mb-4 transition-colors">
                <AlertCircle className="w-6 h-6 text-rose-600 dark:text-rose-500" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Hapus Board?</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                Yakin mau hapus <strong className="text-slate-700 dark:text-slate-200">{boardToDelete.name}</strong>? Semua tugas di dalamnya akan hilang permanen.
              </p>
              <div className="flex gap-3 w-full">
                <button onClick={() => setBoardToDelete(null)} className="flex-1 px-4 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold transition-colors">Batal</button>
                <button onClick={handleDeleteBoard} className="flex-1 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold shadow-lg transition-colors">Ya, Hapus</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}