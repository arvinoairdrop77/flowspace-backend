import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import {
  ChevronLeft, ChevronRight, Plus, Search, CheckCircle2, Circle,
  Trash2, Edit3, Calendar as CalendarIcon, Clock, Tag, Filter, Check, X, Sparkles, ArrowLeft
} from 'lucide-react';

const CATEGORIES = [
  { name: 'Work', color: 'bg-indigo-500', text: 'text-indigo-500', border: 'border-indigo-500', bgLight: 'bg-indigo-50 dark:bg-indigo-950/40' },
  { name: 'Personal', color: 'bg-emerald-500', text: 'text-emerald-500', border: 'border-emerald-500', bgLight: 'bg-emerald-50 dark:bg-emerald-950/40' },
  { name: 'Important', color: 'bg-rose-500', text: 'text-rose-500', border: 'border-rose-500', bgLight: 'bg-rose-50 dark:bg-rose-950/40' },
  { name: 'Meeting', color: 'bg-amber-500', text: 'text-amber-500', border: 'border-amber-500', bgLight: 'bg-amber-50 dark:bg-amber-950/40' },
];

export default function CalendarView() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Cek tema yang tersimpan, kalau nggak ada default ke dark
    const theme = localStorage.getItem('theme');
    if (theme === 'dark' || !theme) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().split('T')[0];
  });
  const [notes, setNotes] = useState([]);
  
  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [formData, setFormData] = useState({ title: '', description: '', category: 'Work', time: '09:00 AM', color: 'bg-indigo-500' });

  // Fetch Notes dari Backend
  const fetchNotes = async () => {
    try {
      const res = await api.get(`/boards/${id}/notes`);
      setNotes(res.data);
    } catch (err) { console.error("Gagal ambil notes:", err); }
  };

  useEffect(() => { fetchNotes(); }, [id]);

  // Date logic
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const daysOfWeek = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

  const calendarDays = useMemo(() => {
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    let startDayIndex = firstDayOfMonth.getDay() - 1;
    if (startDayIndex === -1) startDayIndex = 6;
    const daysInMonth = lastDayOfMonth.getDate();
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    const days = [];

    for (let i = startDayIndex - 1; i >= 0; i--) {
      const prevDate = new Date(year, month - 1, prevMonthLastDay - i);
      days.push({ dayNumber: prevMonthLastDay - i, dateString: new Date(prevDate.getTime() - prevDate.getTimezoneOffset() * 60000).toISOString().split('T')[0], isCurrentMonth: false, isToday: false });
    }
    const todayStr = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0];
    for (let i = 1; i <= daysInMonth; i++) {
      const dayDate = new Date(year, month, i);
      const dateStr = new Date(dayDate.getTime() - dayDate.getTimezoneOffset() * 60000).toISOString().split('T')[0];
      days.push({ dayNumber: i, dateString: dateStr, isCurrentMonth: true, isToday: dateStr === todayStr });
    }
    const remainingDays = (7 - (days.length % 7)) % 7;
    for (let i = 1; i <= remainingDays; i++) {
      const nextDate = new Date(year, month + 1, i);
      days.push({ dayNumber: i, dateString: new Date(nextDate.getTime() - nextDate.getTimezoneOffset() * 60000).toISOString().split('T')[0], isCurrentMonth: false, isToday: false });
    }
    return days;
  }, [year, month]);

  // CRUD Note Logic
  const openModal = (note = null) => {
    if (note) {
      setEditingNote(note);
      setFormData({ title: note.title, description: note.description, category: note.category, time: note.time, color: note.color });
    } else {
      setEditingNote(null);
      setFormData({ title: '', description: '', category: 'Work', time: '09:00 AM', color: 'bg-indigo-500' });
    }
    setIsModalOpen(true);
  };

  const handleSaveNote = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    try {
      if (editingNote) {
        await api.put(`/notes/${editingNote.id}`, { ...formData, date: selectedDate });
      } else {
        await api.post(`/boards/${id}/notes`, { ...formData, date: selectedDate });
      }
      setIsModalOpen(false);
      fetchNotes();
    } catch (err) { alert('Gagal simpan catatan'); }
  };

  const handleDeleteNote = async (noteId) => {
    if (!confirm("Hapus catatan ini?")) return;
    try {
      await api.delete(`/notes/${noteId}`);
      fetchNotes();
    } catch (err) { alert('Gagal hapus catatan'); }
  };

  const toggleComplete = async (note) => {
    try {
      await api.put(`/notes/${note.id}`, { ...note, completed: !note.completed });
      fetchNotes();
    } catch (err) { console.error(err); }
  };

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) || note.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || note.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const selectedDayNotes = filteredNotes.filter(note => note.date === selectedDate);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-300">
      
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur sticky top-0 z-30 px-4 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(`/board/${id}`)} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2"><CalendarIcon className="text-blue-500" /> Kalender & Catatan</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400"></p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative hidden md:block">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Cari catatan..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-64 pl-9 pr-4 py-2 text-sm bg-slate-100 dark:bg-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
      </header>

      <main className="max-w-7xl w-full mx-auto p-4 lg:p-8 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        
        {/* KIRI: Kalender */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-2xl font-bold">{monthNames[month]} <span className="text-slate-400">{year}</span></h2>
            <div className="flex items-center gap-2">
              <button onClick={() => { const d = new Date(); setCurrentDate(d); setSelectedDate(new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().split('T')[0]); }} className="px-3.5 py-1.5 text-sm font-medium text-blue-600 border border-blue-200 dark:border-blue-800/60 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all">Hari Ini</button>
              <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                <button onClick={() => setCurrentDate(new Date(year, month - 1, 1))} className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-all"><ChevronLeft className="w-5 h-5" /></button>
                <button onClick={() => setCurrentDate(new Date(year, month + 1, 1))} className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-all"><ChevronRight className="w-5 h-5" /></button>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 lg:p-6 overflow-hidden">
            <div className="grid grid-cols-7 mb-2 text-center">
              {daysOfWeek.map(day => <div key={day} className="py-2 text-xs font-semibold uppercase tracking-wider text-slate-400">{day}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1.5 md:gap-2">
              {calendarDays.map((item, idx) => {
                const dayNotes = notes.filter(n => n.date === item.dateString);
                const isSelected = item.dateString === selectedDate;
                return (
                  <button key={idx} onClick={() => setSelectedDate(item.dateString)} className={`min-h-[72px] sm:min-h-[88px] p-2 rounded-xl text-left border flex flex-col justify-between transition-all ${!item.isCurrentMonth ? 'opacity-40 bg-slate-50/50 dark:bg-slate-900/30 border-transparent' : 'border-slate-100 dark:border-slate-800/60'} ${isSelected ? 'ring-2 ring-blue-600 dark:ring-blue-500 border-transparent bg-blue-50/30 dark:bg-blue-950/20' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}>
                    <div className="flex items-center justify-between w-full">
                      <span className={`text-xs sm:text-sm font-semibold rounded-lg w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center ${item.isToday ? 'bg-blue-600 text-white' : 'text-slate-700 dark:text-slate-300'}`}>{item.dayNumber}</span>
                      {dayNotes.length > 0 && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">{dayNotes.length}</span>}
                    </div>
                    <div className="w-full mt-1 flex flex-col gap-1 overflow-hidden">
                      {dayNotes.slice(0, 2).map(n => (
                        <div key={n.id} className={`text-[10px] truncate px-1.5 py-0.5 rounded-md flex items-center gap-1 ${CATEGORIES.find(c => c.name === n.category)?.bgLight || 'bg-slate-100'} ${n.completed ? 'line-through opacity-60' : ''}`}>
                          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${n.color}`} />
                          <span className="truncate">{n.title}</span>
                        </div>
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Filter Pills */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 mr-2 flex items-center gap-1.5"><Filter className="w-3.5 h-3.5" /> Filter:</span>
            <button onClick={() => setSelectedCategory('All')} className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${selectedCategory === 'All' ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>Semua</button>
            {CATEGORIES.map(cat => (
              <button key={cat.name} onClick={() => setSelectedCategory(cat.name)} className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${selectedCategory === cat.name ? `${cat.color} text-white` : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                <span className={`w-2 h-2 rounded-full ${selectedCategory === cat.name ? 'bg-white' : cat.color}`} />{cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* KANAN: Daftar Catatan */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">Tanggal Dipilih</span>
              <h3 className="text-lg font-bold">{new Date(selectedDate + 'T00:00:00').toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</h3>
            </div>
            <button onClick={() => openModal()} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium text-sm transition-all shadow-md"><Plus className="w-4 h-4" /> Catatan</button>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex-1 flex flex-col">
            <h4 className="font-semibold text-sm mb-4 pb-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
              Daftar Tugas <span className="px-2 py-0.5 rounded-full text-xs bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-bold">{selectedDayNotes.length}</span>
            </h4>
            {selectedDayNotes.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center my-8">
                <Sparkles className="w-8 h-8 text-slate-300 dark:text-slate-600 mb-3" />
                <p className="text-sm text-slate-500 dark:text-slate-400">Belum ada catatan di tanggal ini.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3 overflow-y-auto max-h-[480px] pr-1 custom-scrollbar">
                {selectedDayNotes.map(note => {
                  const catObj = CATEGORIES.find(c => c.name === note.category);
                  return (
                    <div key={note.id} className={`p-4 rounded-xl border flex flex-col gap-2 relative group transition-all ${note.completed ? 'bg-slate-50/70 dark:bg-slate-800/30 border-slate-200 dark:border-slate-800 opacity-75' : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700/60 shadow-sm hover:shadow-md'}`}>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${catObj?.bgLight} ${catObj?.text} ${catObj?.border}`}>{note.category}</span>
                          <span className="text-[11px] text-slate-500 flex items-center gap-1"><Clock className="w-3 h-3" /> {note.time}</span>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => openModal(note)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-blue-600 rounded-lg"><Edit3 className="w-3.5 h-3.5" /></button>
                          <button onClick={() => handleDeleteNote(note.id)} className="p-1 hover:bg-rose-50 dark:hover:bg-rose-950 text-slate-400 hover:text-rose-600 rounded-lg"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      </div>
                      <div className="flex items-start gap-2.5 mt-1">
                        <button onClick={() => toggleComplete(note)} className="mt-0.5 text-slate-400 hover:text-blue-600 shrink-0">
                          {note.completed ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <Circle className="w-5 h-5" />}
                        </button>
                        <div className="flex-1 min-w-0">
                          <h5 className={`font-semibold text-sm ${note.completed ? 'line-through text-slate-400' : 'text-slate-900 dark:text-slate-100'}`}>{note.title}</h5>
                          {note.description && <p className={`text-xs mt-1 text-slate-500 ${note.completed ? 'line-through opacity-70' : ''}`}>{note.description}</p>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modal Add/Edit Note */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 dark:bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-base font-bold flex items-center gap-2"><Tag className="w-4 h-4 text-blue-600" /> {editingNote ? 'Edit Catatan' : 'Tambah Catatan'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSaveNote} className="p-6 flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Judul *</label>
                <input type="text" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Deskripsi</label>
                <textarea rows="2" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Kategori</label>
                  <select value={formData.category} onChange={(e) => { const cat = CATEGORIES.find(c => c.name === e.target.value); setFormData({ ...formData, category: e.target.value, color: cat ? cat.color : 'bg-indigo-500' }); }} className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500">
                    {CATEGORIES.map(cat => <option key={cat.name} value={cat.name}>{cat.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Waktu</label>
                  <input type="text" placeholder="10:00 AM" value={formData.time} onChange={(e) => setFormData({ ...formData, time: e.target.value })} className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl">Batal</button>
                <button type="submit" className="px-5 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-md">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}