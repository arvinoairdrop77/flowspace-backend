import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { LayoutDashboard, Plus, LogOut } from 'lucide-react';

export default function Dashboard() {
  const [boards, setBoards] = useState([]);
  const [newBoardName, setNewBoardName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const navigate = useNavigate();
  const name = localStorage.getItem('name');

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

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <div className="max-w-5xl mx-auto">
        <header className="flex justify-between items-center mb-10 bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2"><LayoutDashboard className="text-blue-400" /> Workspace {name}</h1>
            <p className="text-slate-400 text-sm mt-1">Pilih papan kerja lo di bawah ini</p>
          </div>
          <button onClick={handleLogout} className="bg-rose-500/10 text-rose-400 border border-rose-500/20 px-4 py-2 rounded-xl hover:bg-rose-500 hover:text-white transition flex items-center gap-2 text-sm font-semibold">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {boards.map(board => (
            <Link to={`/board/${board.id}`} key={board.id} className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 hover:border-blue-500 transition group cursor-pointer block">
              <div className="text-3xl mb-4">🚀</div>
              <h3 className="font-bold text-lg text-white group-hover:text-blue-400 transition">{board.name}</h3>
              <p className="text-sm text-slate-400 mt-2">{board.lists?.length || 0} Kolom Tugas</p>
            </Link>
          ))}

          <div className="bg-slate-900/40 p-6 rounded-2xl border-2 border-dashed border-slate-800 flex flex-col justify-center items-center min-h-[160px] hover:border-blue-500/50 transition">
            {!isCreating ? (
              <button onClick={() => setIsCreating(true)} className="flex flex-col items-center text-slate-400 hover:text-blue-400 transition">
                <Plus className="w-8 h-8 mb-2" />
                <span className="font-medium">Bikin Board Baru</span>
              </button>
            ) : (
              <form onSubmit={handleCreateBoard} className="w-full">
                <input autoFocus type="text" placeholder="Nama Board..." value={newBoardName} onChange={e => setNewBoardName(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm mb-2 focus:outline-none focus:border-blue-500" />
                <div className="flex gap-2">
                  <button type="submit" className="bg-blue-600 text-white text-xs px-3 py-1.5 rounded-md flex-1">Simpan</button>
                  <button type="button" onClick={() => setIsCreating(false)} className="bg-slate-800 text-white text-xs px-3 py-1.5 rounded-md flex-1">Batal</button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}