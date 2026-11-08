import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { ArrowLeft, Trash2, ShieldAlert } from 'lucide-react';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      setUsers(res.data);
    } catch (err) {
      alert('Akses Ditolak! Anda bukan Superadmin.');
      navigate('/dashboard');
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.put(`/users/${userId}/role`, newRole);
      fetchUsers();
    } catch (err) { alert('Gagal update role'); }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm("Yakin mau hapus user ini? Semua datanya akan hilang.")) return;
    try {
      await api.delete(`/users/${userId}`);
      fetchUsers();
    } catch (err) { alert('Gagal hapus user'); }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <header className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate('/dashboard')} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl transition">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2"><ShieldAlert className="text-indigo-400" /> User Management</h1>
            <p className="text-slate-400 text-sm">Kelola akses user yang terdaftar.</p>
          </div>
        </header>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-4 px-6">Nama</th>
                <th className="py-4 px-6">Username</th>
                <th className="py-4 px-6">Role</th>
                <th className="py-4 px-6 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-slate-800/40">
                  <td className="py-4 px-6 font-medium text-white">{u.name}</td>
                  <td className="py-4 px-6 text-slate-400">@{u.username}</td>
                  <td className="py-4 px-6">
                    <select 
                      value={u.role} 
                      onChange={(e) => handleRoleChange(u.id, e.target.value)}
                      className={`bg-slate-950 border rounded-lg px-2 py-1 text-xs font-semibold ${u.role === 'SUPERADMIN' ? 'border-indigo-500 text-indigo-400' : 'border-slate-700 text-slate-300'}`}
                    >
                      <option value="USER">USER</option>
                      <option value="SUPERADMIN">SUPERADMIN</option>
                    </select>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <button onClick={() => handleDeleteUser(u.id)} className="p-2 text-rose-400 hover:bg-rose-500/20 rounded-lg transition">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}