import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import {
  Plus, Search, List, Kanban, Trash2, Edit3,
  X, AlertCircle, CheckCircle2, Calendar, CheckSquare,
  User, Sparkles, LogOut, PlusCircle, FolderPlus,
  ChevronDown, Briefcase, BarChart3, Flame,
  MessageSquare, Send, ArrowLeft, LayoutDashboard,
  Sun, Moon
} from 'lucide-react';
import { WorkspaceLayersLogo } from '../components/WorkspaceLayersLogo';

const COVER_COLORS = [
  { name: 'Blue', border: 'border-blue-500/50', bg: 'bg-blue-500/10', glow: 'shadow-blue-500/10', text: 'text-blue-400', badge: 'bg-blue-500/20 border-blue-500/30' },
  { name: 'Purple', border: 'border-purple-500/50', bg: 'bg-purple-500/10', glow: 'shadow-purple-500/10', text: 'text-purple-400', badge: 'bg-purple-500/20 border-purple-500/30' },
  { name: 'Emerald', border: 'border-emerald-500/50', bg: 'bg-emerald-500/10', glow: 'shadow-emerald-500/10', text: 'text-emerald-400', badge: 'bg-emerald-500/20 border-emerald-500/30' },
  { name: 'Amber', border: 'border-amber-500/50', bg: 'bg-amber-500/10', glow: 'shadow-amber-500/10', text: 'text-amber-400', badge: 'bg-amber-500/20 border-amber-500/30' },
  { name: 'Rose', border: 'border-rose-500/50', bg: 'bg-rose-500/10', glow: 'shadow-rose-500/10', text: 'text-rose-400', badge: 'bg-rose-500/20 border-rose-500/30' },
  { name: 'Cyan', border: 'border-cyan-500/50', bg: 'bg-cyan-500/10', glow: 'shadow-cyan-500/10', text: 'text-cyan-400', badge: 'bg-cyan-500/20 border-cyan-500/30' }
];

const PRIORITY_STYLES = {
  High: 'bg-red-500/20 text-red-400 border-red-500/40',
  Medium: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
  Low: 'bg-slate-500/20 text-slate-400 border-slate-500/40'
};

// Warna Kolom
const getColumnColor = (name) => {
  const lowerName = name.toLowerCase();
  if (lowerName.includes('backlog')) return 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600';
  if (lowerName.includes('to do') || lowerName.includes('todo')) return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30';
  if (lowerName.includes('progress')) return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30';
  if (lowerName.includes('review') || lowerName.includes('qa')) return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30';
  if (lowerName.includes('done') || lowerName.includes('selesai')) return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30';
  return 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'; // Default
};

// Fungsi buat nentuin warna dari database ke CSS
const getColumnStyle = (colorClass) => {
  if (!colorClass) return {};
  
  // Pilihan warna versi Terang
  const lightColors = {
    'bg-slate-500': { bg: '#f1f5f9', text: '#334155', border: '#cbd5e1' },
    'bg-blue-500': { bg: '#dbeafe', text: '#1d4ed8', border: '#bfdbfe' },
    'bg-amber-500': { bg: '#fef3c7', text: '#b45309', border: '#fde68a' },
    'bg-emerald-500': { bg: '#d1fae5', text: '#047857', border: '#a7f3d0' },
    'bg-rose-500': { bg: '#ffe4e6', text: '#be123c', border: '#fecdd3' },
    'bg-purple-500': { bg: '#f3e8ff', text: '#7e22ce', border: '#e9d5ff' },
    'bg-cyan-500': { bg: '#cffafe', text: '#0e7490', border: '#a5f3fc' },
  };

  // Pilihan warna versi Gelap (transparan & teks terang)
  const darkColors = {
    'bg-slate-500': { bg: 'rgba(100, 116, 139, 0.2)', text: '#cbd5e1', border: '#475569' },
    'bg-blue-500': { bg: 'rgba(59, 130, 246, 0.2)', text: '#93c5fd', border: '#1d4ed8' },
    'bg-amber-500': { bg: 'rgba(245, 158, 11, 0.2)', text: '#fcd34d', border: '#b45309' },
    'bg-emerald-500': { bg: 'rgba(16, 185, 129, 0.2)', text: '#6ee7b7', border: '#047857' },
    'bg-rose-500': { bg: 'rgba(244, 63, 94, 0.2)', text: '#fda4af', border: '#be123c' },
    'bg-purple-500': { bg: 'rgba(168, 85, 247, 0.2)', text: '#d8b4fe', border: '#7e22ce' },
    'bg-cyan-500': { bg: 'rgba(6, 182, 212, 0.2)', text: '#67e8f9', border: '#0e7490' },
  };

  const isDarkMode = document.documentElement.classList.contains('dark');
  const selected = isDarkMode ? darkColors[colorClass] : lightColors[colorClass];

  return {
    backgroundColor: (selected || lightColors['bg-slate-500']).bg,
    color: (selected || lightColors['bg-slate-500']).text,
    borderColor: (selected || lightColors['bg-slate-500']).border
  };
};

export default function BoardDetail() {
  const navigate = useNavigate();

  const [board, setBoard] = useState(null);
  const [boardTags, setBoardTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [columnToDelete, setColumnToDelete] = useState(null);
  const [newColumnColor, setNewColumnColor] = useState('bg-slate-500');

  const [viewMode, setViewMode] = useState(() => {
  return localStorage.getItem('viewMode') || 'board';
  });

  const handleViewModeChange = (mode) => {
  setViewMode(mode);
  localStorage.setItem('viewMode', mode);
  };

  const { id } = useParams();

  // State buat Dark/Light Mode
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('theme') !== 'light';
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('ALL');
  const [selectedPriority, setSelectedPriority] = useState('ALL');

  // Drag State (HTML5)
  const [draggedTaskId, setDraggedTaskId] = useState(null);
  const [dragOverColumnId, setDragOverColumnId] = useState(null);

  // Modals & Drawers
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);
  const [activeTaskDrawer, setActiveTaskDrawer] = useState(null);

  // Forms
  const [editingTask, setEditingTask] = useState(null);
  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formColumn, setFormColumn] = useState('');
  const [formTag, setFormTag] = useState('Frontend');
  const [formPriority, setFormPriority] = useState('Medium');
  const [formCover, setFormCover] = useState('Blue');
  const [formDueDate, setFormDueDate] = useState('');
  const [formAssignee, setFormAssignee] = useState('');
  const [newColumnTitle, setNewColumnTitle] = useState('');
  const [newSubtask, setNewSubtask] = useState('');
  const [drawerSubtasks, setDrawerSubtasks] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [drawerComments, setDrawerComments] = useState([]);
  const [newBoardName, setNewBoardName] = useState('');
  const [isBoardModalOpen, setIsBoardModalOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const [toast, setToast] = useState(null);
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const handleClickOutside = () => setIsProfileOpen(false);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  useEffect(() => {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark' || !theme) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);


  
  // Fetch Board dari Backend
  const fetchBoard = async (selectedBoardId = null) => {
    try {
      const res = await api.get('/boards');

      if (res.data.length > 0) {
        // Prioritas 1: ID dari URL (rute /board/1)
        // Prioritas 2: ID dari dropdown
        // Prioritas 3: Board pertama
        const targetId = id || selectedBoardId;
        const foundBoard = targetId
          ? res.data.find(b => b.id.toString() === targetId.toString())
          : res.data[0];

        setBoard(foundBoard || res.data[0]);

        // --- LOGIKA BUAT PARSE TAG DARI DATABASE ---
        if (foundBoard && foundBoard.tags) {
          try {
            setBoardTags(JSON.parse(foundBoard.tags));
          } catch (e) {
            setBoardTags([]); // Kalau formatnya error, kosongin aja
          }
        } else if (foundBoard) {
          // Kalau belum ada tag di database, kasih tag default
          setBoardTags(['Backend', 'Frontend', 'Database', 'DevOps', 'Learning', 'General']);
        }
        // -------------------------------------------

        if (foundBoard?.lists?.length > 0 && !formColumn) {
          setFormColumn(foundBoard.lists[0].id.toString());
        }
      } else {
        const createRes = await api.post('/boards', { name: "Software Engineering" });
        setBoard({ ...createRes.data, lists: [] });
        setBoardTags(['Backend', 'Frontend', 'Database', 'DevOps', 'Learning', 'General']); // Default tag buat board baru
      }
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.clear();
        window.location.href = '/';
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBoard(); }, [id]);

  const handleCreateBoard = async (e) => {
    e.preventDefault();
    if (!newBoardName.trim()) return;
    try {
      await api.post('/boards', { name: newBoardName });
      setNewBoardName('');
      setIsBoardModalOpen(false);
      fetchBoard();
      showToast('Board baru berhasil dibuat!');
    } catch (err) {
      showToast('Gagal membuat board', 'error');
    }
  };

  // --- CRUD ACTIONS ---
  const handleAddColumn = async (e) => {
    e.preventDefault();
    if (!newColumnTitle.trim()) return;
    try {
      // Kirim color ke Backend
      await api.post(`/lists/board/${board.id}`, { 
        name: newColumnTitle,
        color: newColumnColor 
      });
      setNewColumnTitle('');
      setIsColumnModalOpen(false);
      fetchBoard();
      showToast('Kolom berhasil ditambahkan!');
    } catch (err) { showToast('Gagal tambah kolom', 'error'); }
  };

  const handleDeleteColumn = async () => {
    if (!columnToDelete) return;
    try {
      await api.delete(`/lists/${columnToDelete.id}`);
      showToast('Kolom berhasil dihapus!');
      setColumnToDelete(null); // Tutup modal
      fetchBoard();
    } catch (err) {
      showToast('Gagal menghapus kolom', 'error');
    }
  };

  const handleSaveTask = async (e) => {
    e.preventDefault();
    if (!formTitle.trim()) return;
    if (!formColumn) return showToast('Bikin kolom dulu bree!', 'error');

    try {
      if (editingTask) {
        await api.put(`/cards/${editingTask.id}`, {
          title: formTitle, description: formDesc, tag: formTag,
          priority: formPriority, dueDate: formDueDate, labelColor: formCover
        });
        showToast('Catatan berhasil diperbarui!');
      } else {
        await api.post(`/cards/list/${formColumn}`, {
          title: formTitle, description: formDesc, tag: formTag,
          priority: formPriority, dueDate: formDueDate, labelColor: formCover
        });
        showToast('Catatan baru berhasil dibuat!');
      }
      
      setIsTaskModalOpen(false);
      setActiveTaskDrawer(null);
      
      // Tambahin await biar React nunggu fetch selesai
      await fetchBoard(); 

    } catch (err) {
      console.error("ERROR SIMPAN TASK:", err.response || err);
      showToast('Gagal menyimpan catatan', 'error');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!confirm("Yakin mau hapus catatan ini?")) return;
    try {
      // Tembak API hapus
      await api.delete(`/cards/${taskId}`);
      
      // Kalau berhasil, hapus dari UI tanpa perlu nunggu fetch ulang
      setBoard(prev => ({
        ...prev,
        lists: prev.lists.map(l => ({ ...l, cards: l.cards.filter(c => c.id !== taskId) }))
      }));
      
      if (activeTaskDrawer?.id === taskId) setActiveTaskDrawer(null);
      showToast('Catatan berhasil dihapus', 'success');
      
    } catch (err) {
      // Kalau error 404 (data nggak ketemu), tetep hapus dari UI biar sinkron
      if (err.response?.status === 404) {
        setBoard(prev => ({
          ...prev,
          lists: prev.lists.map(l => ({ ...l, cards: l.cards.filter(c => c.id !== taskId) }))
        }));
        if (activeTaskDrawer?.id === taskId) setActiveTaskDrawer(null);
        showToast('Data sudah tidak ada di database', 'info');
      } else {
        showToast('Gagal menghapus catatan', 'error');
      }
    }
  };

  // --- DRAG & DROP (HTML5) ---
  const handleDragStart = (e, taskId) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, columnId) => {
    e.preventDefault();
    if (dragOverColumnId !== columnId) setDragOverColumnId(columnId);
  };

  const handleDrop = async (e, targetColId) => {
    e.preventDefault();
    setDragOverColumnId(null);
    if (!draggedTaskId) return;

    const newBoard = { ...board };
    const sourceListIndex = newBoard.lists.findIndex(l => l.cards.some(c => c.id.toString() === draggedTaskId));
    const destListIndex = newBoard.lists.findIndex(l => l.id.toString() === targetColId);

    if (sourceListIndex > -1 && destListIndex > -1) {
      const task = newBoard.lists[sourceListIndex].cards.find(c => c.id.toString() === draggedTaskId);
      newBoard.lists[sourceListIndex].cards = newBoard.lists[sourceListIndex].cards.filter(c => c.id.toString() !== draggedTaskId);
      newBoard.lists[destListIndex].cards.push(task);
      setBoard(newBoard);
    }

    try {
      await api.put(`/cards/${draggedTaskId}/move/${targetColId}`);
      showToast('Task dipindahkan!');
    } catch (err) {
      fetchBoard();
      showToast('Gagal memindahkan task', 'error');
    }
    setDraggedTaskId(null);
  };

  const handleMoveTask = async (taskId, newColId) => {
    if (!newColId) return;

    const newBoard = { ...board };
    const sourceListIndex = newBoard.lists.findIndex(l => l.cards.some(c => c.id === taskId));
    const destListIndex = newBoard.lists.findIndex(l => l.id.toString() === newColId);

    if (sourceListIndex > -1 && destListIndex > -1) {
      const task = newBoard.lists[sourceListIndex].cards.find(c => c.id === taskId);
      newBoard.lists[sourceListIndex].cards = newBoard.lists[sourceListIndex].cards.filter(c => c.id !== taskId);
      newBoard.lists[destListIndex].cards.push(task);
      setBoard(newBoard);
    }

    try {
      await api.put(`/cards/${taskId}/move/${newColId}`);
      showToast('Status dipindahkan!');
      await fetchBoard();
    } catch (err) {
      fetchBoard();
      showToast('Gagal memindahkan status', 'error');
    }
  };

  // --- FORM HELPERS ---
  const openCreateTaskModal = (colId) => {
    if (!board.lists || board.lists.length === 0) {
      return showToast('Bikin kolom dulu sebelum nambah task!', 'error');
    }
    setEditingTask(null);
    setFormTitle('');
    setFormDesc('');
    setFormColumn(colId || board.lists[0]?.id || '');
    setFormTag('Frontend');
    setFormPriority('Medium');
    setFormCover('Blue');
    setFormDueDate(new Date().toISOString().split('T')[0]);
    setFormAssignee('Saya');
    setIsTaskModalOpen(true);
  };

  const openEditTaskModal = (task) => {
    setEditingTask(task);
    setFormTitle(task.title);
    setFormDesc(task.description || '');
    setFormColumn(board.lists.find(l => l.cards.some(c => c.id === task.id))?.id || '');
    setFormTag(task.tag || 'Frontend');
    setFormPriority(task.priority || 'Medium');
    setFormCover(task.labelColor || 'Blue');
    setFormDueDate(task.dueDate || '');
    setFormAssignee('Saya');
    setIsTaskModalOpen(true);
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  const filteredTasks = (list) => {
    return (list.cards || []).filter(task => {
      const matchSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchTag = selectedTag === 'ALL' || task.tag === selectedTag;
      const matchPriority = selectedPriority === 'ALL' || task.priority === selectedPriority;
      return matchSearch && matchTag && matchPriority;
    });
  };

  // Kalkulasi Statistik Header
  const totalTasks = board?.lists?.flatMap(l => l.cards || []).length || 0;
  const doneList = board?.lists?.find(l => l.name.toLowerCase().includes('done') || l.name.toLowerCase().includes('selesai'));
  const completedTasks = doneList ? doneList.cards.length : 0;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const urgentTasks = board?.lists?.flatMap(l => l.cards || []).filter(c => c.priority === 'High').length || 0;

  // Pas drawer dibuka, sinkronin data subtask-nya
  useEffect(() => {
    if (activeTaskDrawer) {
      setDrawerSubtasks(activeTaskDrawer.subtasks || []);
      setDrawerComments(activeTaskDrawer.comments || []); // <--- TAMBAHIN INI
    }
  }, [activeTaskDrawer]);

  const handleAddSubtask = async (e) => {
    e.preventDefault();
    if (!newSubtask.trim()) return;
    try {
      const res = await api.post(`/subtasks/card/${activeTaskDrawer.id}`, { title: newSubtask });
      setDrawerSubtasks([...drawerSubtasks, res.data]);
      setNewSubtask('');
      fetchBoard(); // Refresh board di belakang
    } catch (err) { showToast('Gagal tambah subtask', 'error'); }
  };

  const toggleSubtask = async (subtaskId, index) => {
    // Update UI dulu (Optimistic)
    const updated = [...drawerSubtasks];
    updated[index].completed = !updated[index].completed;
    setDrawerSubtasks(updated);

    try {
      await api.put(`/subtasks/${subtaskId}/toggle`);
      fetchBoard();
    } catch (err) { showToast('Gagal update subtask', 'error'); }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      const res = await api.post(`/comments/card/${activeTaskDrawer.id}`, { text: newComment });
      setDrawerComments([...drawerComments, res.data]);
      setNewComment('');
      fetchBoard();
    } catch (err) { showToast('Gagal kirim komentar', 'error'); }
  };

  const toggleTheme = () => {
  const nextTheme = !isDark;
  setIsDark(nextTheme);
  localStorage.setItem('theme', nextTheme ? 'dark' : 'light');
  if (nextTheme) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Loading Workspace...</div>;
  if (!board) return null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans antialiased transition-colors duration-300">

    {/* MESH BACKGROUND*/}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-60 dark:opacity-20" style={{
        backgroundImage: 'radial-gradient(at 0% 0%, rgba(6, 182, 212, 0.15) 0px, transparent 40%), radial-gradient(at 100% 0%, rgba(99, 102, 241, 0.15) 0px, transparent 40%), radial-gradient(#cbd5e1 0.75px, transparent 0.75px)',
        backgroundSize: '100% 100%, 100% 100%, 24px 24px'
      }} />
      <div className="fixed -top-24 -left-24 w-96 h-96 bg-cyan-300/20 dark:bg-cyan-900/20 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed top-1/3 -right-24 w-96 h-96 bg-indigo-300/20 dark:bg-indigo-900/20 rounded-full blur-3xl pointer-events-none" />

      {toast && (
        <div className="fixed top-6 right-6 z-[100] flex items-center gap-3 px-5 py-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl animate-bounce transition-all">
          {toast.type === 'error' ? (
            <AlertCircle className="w-5 h-5 text-amber-500" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          )}
          <span className="text-sm font-semibold text-slate-900 dark:text-white">
            {toast.message}
          </span>
        </div>
      )}

      {/* HEADER NAVBAR (Sesuai Desain UI V2) */}
      <header className="relative z-10 border-b border-slate-200 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 backdrop-blur sticky top-0 z-30 transition-colors">

        {/* BARIS ATAS: Logo, Search, Action Buttons */}
        <div className="px-4 lg:px-8 py-3 flex flex-col md:flex-row gap-4 items-center justify-between border-b border-slate-200 dark:border-slate-800/60">
          <div className="flex items-center gap-3 w-full md:w-auto justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                <WorkspaceLayersLogo className="w-6 h-6" />
              </div>

              <div>
                <h1 className="font-bold text-base md:text-lg text-slate-900 dark:text-slate-100 tracking-wide">
                  {board.name}
                </h1>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Spring Boot + React V2 Ecosystem</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap md:flex-nowrap items-center gap-2.5 w-full md:w-auto">
            
            {/* INPUT SEARCH */}
            <div className="relative flex-1 md:w-60">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Cari task / catatan..." 
                value={searchQuery} 
                onChange={e => setSearchQuery(e.target.value)} 
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 dark:text-slate-200 focus:border-blue-500 transition-all" 
              />
            </div> {/* <--- INI PENUTUP DIV YANG TADI KURANG */}

            {/* TOGGLE BOARD/LIST */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-1">
              <button onClick={() => handleViewModeChange('board')} className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${viewMode === 'board' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 dark:text-slate-400'}`}><Kanban className="w-3.5 h-3.5" /> Board</button>
              <button onClick={() => handleViewModeChange('list')} className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${viewMode === 'list' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 dark:text-slate-400'}`}><List className="w-3.5 h-3.5" /> List</button>
            </div>

            {/* TOMBOL KOLOM & TASK */}
            <button onClick={() => setIsColumnModalOpen(true)} className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-medium border border-slate-200 dark:border-slate-700 transition-colors flex items-center gap-1.5"><PlusCircle className="w-3.5 h-3.5 text-indigo-500" /> Kolom</button>
            <button onClick={() => openCreateTaskModal()} className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium text-xs shadow-lg shadow-blue-600/25 transition-all flex items-center gap-1.5"><Plus className="w-4 h-4" /> Task Baru</button>
            <button onClick={() => navigate(`/board/${id}/calendar`)} className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium text-xs shadow-lg transition-all flex items-center gap-1.5">
              <Calendar className="w-4 h-4" /> Kalender
            </button>

            {/* PROFILE DROPDOWN */}
            <div className="relative ml-2 hidden md:block">
              <button 
                onClick={(e) => { e.stopPropagation(); setIsProfileOpen(!isProfileOpen); }}
                className="flex items-center gap-2 pl-4 border-l border-slate-200 dark:border-slate-800 outline-none"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold text-xs shadow-md">
                  {localStorage.getItem('name')?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">
                    {localStorage.getItem('name') || 'User'}
                  </span>
                  <span className="text-[10px] text-blue-600 dark:text-blue-400 font-mono font-semibold">
                    {localStorage.getItem('role') || 'USER'}
                  </span>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>

              {/* PROFILE DROPDOWN MENU */}
              {isProfileOpen && (
                <div 
                  onClick={(e) => e.stopPropagation()}
                  className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                  <div className="p-4 border-b border-slate-200 dark:border-slate-800">
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{localStorage.getItem('name')}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">@{localStorage.getItem('username')}</p>
                  </div>
                  <div className="p-2">
                  
                    {/* TOMBOL TOGGLE DARK/LIGHT DI SINI BREE */}
                    <button 
                      onClick={toggleTheme} 
                      className="w-full text-left flex items-center justify-between px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors font-medium mb-1">
                      <div className="flex items-center gap-2">
                        {isDark ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-blue-500" />}
                        <span>{isDark ? 'Mode Terang' : 'Mode Gelap'}</span>
                      </div>
                      {/* Ikon panah kecil opsional */}
                    </button>

                    <button 
                      onClick={() => navigate('/dashboard')} 
                      className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-colors font-medium">
                      <LayoutDashboard className="w-4 h-4" /> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div> {/* <--- PENUTUP BARIS ATAS */}

        {/* BARIS BAWAH: Statistik & Filter Tag */}
        <div className="px-4 lg:px-8 py-2.5 bg-slate-50 dark:bg-slate-950/40 flex flex-wrap items-center justify-between gap-4 text-xs transition-colors">
          
          <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-blue-500" />
              <span>Total: <strong className="text-slate-800 dark:text-slate-200">{totalTasks}</strong></span>
            </div>
            <div className="h-3 w-[1px] bg-slate-300 dark:bg-slate-800" />
            <div className="flex items-center gap-1.5">
              <BarChart3 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Selesai: <strong className="text-emerald-500">{completionPercentage}%</strong></span>
            </div>
            <div className="h-3 w-[1px] bg-slate-300 dark:bg-slate-800" />
            <div className="flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-red-500" />
              <span>Prioritas Tinggi: <strong className="text-red-500">{urgentTasks}</strong></span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar py-0.5">
            <span className="text-[11px] text-slate-500 font-medium">Tag Filter:</span>
            <button onClick={() => setSelectedTag('ALL')} className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium border transition-all ${selectedTag === 'ALL' ? 'bg-blue-500/10 text-blue-500 dark:text-blue-400 border-blue-500/30' : 'bg-slate-200 dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-300 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700'}`}>Semua</button>
            {boardTags.map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium border transition-all ${selectedTag === tag
                    ? 'bg-blue-500/10 text-blue-500 dark:text-blue-400 border-blue-500/30'
                    : 'bg-slate-200 dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-300 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700'
                  }`}>
                {tag}
              </button>
            ))}
          </div>
        </div>

      </header>

      {/* MAIN KANBAN BOARD */}
      <main className="relative z-10 flex-1 p-4 md:p-6 lg:p-8 overflow-x-auto">
        {viewMode === 'board' && (
          <div className="flex gap-5 h-full min-w-max items-start">
            {board.lists.length === 0 && (
              <div className="w-full text-center py-20 text-slate-500">
                Belum ada kolom. Klik tombol "+ Kolom" di atas untuk memulai.
              </div>
            )}
            {board.lists.map(column => {
              const tasks = filteredTasks(column);
              const isOver = dragOverColumnId === column.id.toString();

              return (
                <div key={column.id} onDragOver={(e) => handleDragOver(e, column.id)} onDrop={(e) => handleDrop(e, column.id)} className={`w-80 flex-shrink-0 bg-slate-100 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/80 rounded-2xl flex flex-col max-h-[calc(100vh-190px)] transition-all shadow-sm dark:shadow-none ${isOver ? 'border-blue-500/80 ring-2 ring-blue-500/20' : ''}`}>

                  <div className="p-3.5 pb-2 border-b border-slate-800/60 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span 
                        className="px-2.5 py-0.5 rounded-lg text-xs font-semibold border transition-colors"
                        style={getColumnStyle(column.color)}>
                        {column.name}
                      </span>
                      <span className="text-xs font-bold text-slate-600 dark:text-slate-400 bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded-full transition-colors">{tasks.length}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button onClick={() => openCreateTaskModal(column.id)} className="p-1 hover:bg-slate-800 text-slate-400 rounded-lg" title="Tambah Task">
                        <Plus className="w-4 h-4" />
                      </button>
                      <button onClick={() => setColumnToDelete(column)} className="p-1 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 rounded-lg transition-colors" title="Hapus Kolom">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
                    {tasks.map((task) => {
                      const coverStyle = COVER_COLORS.find(c => c.name === task.labelColor) || COVER_COLORS[0];
                      return (
                        <div
                          key={task.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, task.id)}
                          onClick={() => setActiveTaskDrawer(task)}
                          className={`group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-slate-700 rounded-xl p-3.5 shadow-sm dark:shadow-md cursor-grab relative overflow-hidden transition-colors ${coverStyle.border}`}>

                          {/* Garis Warna di Atas Card */}
                          <div className={`absolute top-0 left-0 right-0 h-1 ${coverStyle.bg}`} />

                          {/* Tag & Priority */}
                          <div className="flex items-center justify-between mb-2 pt-1">
                            <div className="flex items-center gap-1.5">
                              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${coverStyle.badge} ${coverStyle.text}`}>
                                {task.tag || 'General'}
                              </span>
                              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${PRIORITY_STYLES[task.priority] || PRIORITY_STYLES.Medium}`}>
                                {task.priority}
                              </span>
                            </div>
                          </div>

                          {/* Judul & Deskripsi */}
                          <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm mb-1">{task.title}</h3>
                          {task.description && (
                            <p className="text-xs text-slate-400 line-clamp-2 mb-3">{task.description}</p>
                          )}

                          {/* Progress Bar Subtasks (Checklist) */}
                          {task.subtasks && task.subtasks.length > 0 && (
                            <div className="mb-3 bg-slate-950/70 p-2 rounded-lg border border-slate-800/60">
                              <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                                <span className="flex items-center gap-1">
                                  <CheckSquare className="w-3.5 h-3.5 text-blue-400" /> Subtasks
                                </span>
                                <span className="font-mono text-[10px]">
                                  {task.subtasks.filter(s => s.completed).length}/{task.subtasks.length}
                                </span>
                              </div>
                              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                                <div
                                  className="bg-gradient-to-r from-blue-500 to-indigo-500 h-1.5 rounded-full transition-all duration-300"
                                  style={{ width: `${(task.subtasks.filter(s => s.completed).length / task.subtasks.length) * 100}%` }}
                                />
                              </div>
                            </div>
                          )}

                          {/* Footer: Due Date & Assignee */}
                          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/60 mt-2">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" /> {task.dueDate || '-'}
                            </span>

                            <div className="flex items-center gap-2">
                              {/* 👇 TAMBAHIN DROPDOWN INI BREE 👇 */}
                              <select
                                value={column.id}
                                onChange={(e) => handleMoveTask(task.id, e.target.value)}
                                className="bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-400 text-[10px] border border-slate-300 dark:border-slate-800 rounded px-1.5 py-0.5 focus:outline-none cursor-pointer hover:border-slate-400 dark:hover:border-slate-700 transition-colors"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {board.lists.map(c => (
                                  <option key={c.id} value={c.id} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-200">
                                    {c.name}
                                  </option>
                                ))}
                              </select>

                              <div className="w-6 h-6 rounded-full bg-blue-600/30 text-blue-300 flex items-center justify-center font-bold text-[10px]" title={task.assignee || 'Unassigned'}>
                                {task.assignee ? task.assignee.substring(0, 2).toUpperCase() : <User className="w-3 h-3" />}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* LIST VIEW */}
        {viewMode === 'list' && (
          <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm dark:shadow-xl transition-colors">
            <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
              <thead className="bg-slate-100 dark:bg-slate-950/80 text-slate-500 dark:text-slate-400 uppercase text-[10px] border-b border-slate-200 dark:border-slate-800 transition-colors">
                <tr>
                  <th className="py-3 px-4">Task</th>
                  <th className="py-3 px-4">Kolom</th>
                  <th className="py-3 px-4">Tag</th>
                  <th className="py-3 px-4">Prioritas</th>
                  <th className="py-3 px-4">Due Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
                {board.lists.flatMap(list => filteredTasks(list)).map(task => (
                  <tr key={task.id} onClick={() => setActiveTaskDrawer(task)} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-900 dark:text-slate-100">{task.title}</td>
                    <td className="py-3 px-4"><span className="bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded">{board.lists.find(l => l.cards.some(c => c.id === task.id))?.name}</span></td>
                    <td className="py-3 px-4"><span className="bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded">{task.tag}</span></td>
                    <td className="py-3 px-4"><span className={`px-2 py-0.5 rounded border ${PRIORITY_STYLES[task.priority]}`}>{task.priority}</span></td>
                    <td className="py-3 px-4 font-mono">{task.dueDate || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* DRAWER (Detail View) */}
      {activeTaskDrawer && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 w-full max-w-lg h-full p-6 shadow-2xl flex flex-col transition-colors">

            {/* Header Drawer */}
            <div className="flex justify-between items-center mb-6">
              <span className={`px-2.5 py-0.5 rounded text-xs font-semibold border ${PRIORITY_STYLES[activeTaskDrawer.priority]}`}>
                {activeTaskDrawer.priority} Priority
              </span>
              <button onClick={() => setActiveTaskDrawer(null)} className="p-1 hover:bg-slate-800 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">{activeTaskDrawer.title}</h2>

            {/* Status & Assignee Info */}
            <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mb-4">
              <span>Status: <strong className="text-blue-400">
                {board.lists.find(l => l.id === activeTaskDrawer.listId)?.name ||
                  board.lists.find(l => l.cards.some(c => c.id === activeTaskDrawer.id))?.name || 'Unknown'}
              </strong></span>
              <span>Assignee: <strong className="text-slate-700 dark:text-slate-200">{activeTaskDrawer.assignee || 'Unassigned'}</strong></span>
            </div>

            {/* Deskripsi */}
            <div className="bg-slate-100 dark:bg-slate-950/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800 mb-6 transition-colors">
              <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">Deskripsi</h4>
              <p className="text-xs text-slate-700 dark:text-slate-300">{activeTaskDrawer.description || 'Tidak ada deskripsi.'}</p>
            </div>

            {/* Scrollable Content (Subtasks & Comments) */}
            <div className="flex-1 overflow-y-auto pr-2 space-y-6">

              {/* SUBTASKS SECTION */}
              <div className="border-t border-slate-800 pt-4">
                <h4 className="text-xs font-semibold text-slate-400 mb-3 flex items-center justify-between">
                  <span>Checklist / Subtasks</span>
                  <span className="font-mono text-[10px]">
                    {drawerSubtasks.filter(s => s.completed).length} / {drawerSubtasks.length}
                  </span>
                </h4>

                <form onSubmit={handleAddSubtask} className="flex gap-2 mb-4">
                  <input
                    type="text"
                    placeholder="Tambah checklist..."
                    value={newSubtask}
                    onChange={e => setNewSubtask(e.target.value)}
                    className="flex-1 bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-900 dark:text-slate-200 focus:border-blue-500 focus:outline-none transition-colors"/>
                  <button type="submit" className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs rounded-xl">
                    Tambah
                  </button>
                </form>

                <div className="space-y-2">
                  {drawerSubtasks.map((st, idx) => (
                    <div key={st.id} onClick={() => toggleSubtask(st.id, idx)} className="flex items-center gap-3 p-2.5 bg-slate-950/40 border border-slate-800 rounded-xl cursor-pointer hover:border-slate-700 transition-colors">
                      <input
                        type="checkbox"
                        checked={st.completed}
                        onChange={() => { }}
                        className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-blue-600 focus:ring-0 cursor-pointer"
                      />
                      <span className={`text-xs ${st.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                        {st.title}
                      </span>
                    </div>
                  ))}
                  {drawerSubtasks.length === 0 && (
                    <p className="text-[11px] text-slate-500 italic">Belum ada checklist.</p>
                  )}
                </div>
              </div>

              {/* ACTIVITY LOG / COMMENTS */}
              <div className="mb-6 border-t border-slate-800 pt-4 flex-1 overflow-y-auto">
                <h4 className="text-xs font-semibold text-slate-400 mb-3 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-blue-400" /> Activity & Comments Log
                </h4>

                <form onSubmit={handleAddComment} className="flex gap-2 mb-4">
                  <input
                    type="text"
                    placeholder="Tulis komentar atau update..."
                    value={newComment}
                    onChange={e => setNewComment(e.target.value)}
                    className="flex-1 bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-900 dark:text-slate-200 focus:border-blue-500 focus:outline-none transition-colors"/>

                  <button type="submit" className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-colors">
                    <Send className="w-4 h-4" />
                  </button>
                </form>

                <div className="space-y-3">
                  {drawerComments.map((act) => (
                    <div key={act.id} className="bg-slate-950/40 border border-slate-800/60 p-3 rounded-xl text-xs space-y-1">
                      <div className="flex items-center justify-between text-slate-400">
                        <strong className="text-slate-200">{act.userName}</strong>
                        <span className="text-[10px] text-slate-500 font-mono">{act.timestamp}</span>
                      </div>
                      <p className="text-slate-300">{act.text}</p>
                    </div>
                  ))}
                  {drawerComments.length === 0 && (
                    <p className="text-[11px] text-slate-500 italic">Belum ada komentar.</p>
                  )}
                </div>
              </div>

              {/* Tombol Edit & Hapus (Hanya Ada Satu) */}
              <div className="mt-4 pt-4 border-t border-slate-800 flex gap-3 shrink-0">
                <button onClick={() => openEditTaskModal(activeTaskDrawer)} className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-xl text-xs font-semibold transition">
                  Edit Task
                </button>
                <button onClick={() => handleDeleteTask(activeTaskDrawer.id)} className="flex-1 bg-rose-500/10 text-rose-400 py-2 rounded-xl border border-rose-500/20 text-xs font-semibold hover:bg-rose-500 hover:text-white transition">
                  Hapus
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* MODAL CREATE / EDIT TASK */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-xl shadow-2xl transition-colors">
            
            {/* Header */}
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <h2 className="text-base font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                <Sparkles className="w-5 h-5 text-blue-500" /> 
                {editingTask ? 'Edit Task' : 'Tambah Task Baru'}
              </h2>
              <button onClick={() => setIsTaskModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Form */}
            <form onSubmit={handleSaveTask} className="p-5 space-y-4">
              
              {/* Judul */}
              <input 
                required 
                type="text" 
                placeholder="Judul catatan..." 
                value={formTitle} 
                onChange={e => setFormTitle(e.target.value)} 
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 focus:border-blue-500 focus:outline-none transition-colors" 
              />
              
              {/* Deskripsi */}
              <textarea 
                rows={3} 
                placeholder="Detail penjelasan..." 
                value={formDesc} 
                onChange={e => setFormDesc(e.target.value)} 
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 focus:border-blue-500 focus:outline-none resize-none transition-colors" 
              />

              {/* Dropdowns */}
              <div className="grid grid-cols-3 gap-3">
                <select 
                  value={formColumn} 
                  onChange={e => setFormColumn(e.target.value)} 
                  className="bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-200 focus:outline-none transition-colors"
                >
                  {board.lists.map(col => (
                    <option key={col.id} value={col.id} className="bg-white dark:bg-slate-900">{col.name}</option>
                  ))}
                </select>
                
                <select 
                  value={formTag} 
                  onChange={e => setFormTag(e.target.value)} 
                  className="bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-200 focus:outline-none transition-colors"
                >
                  {boardTags.map(t => (
                    <option key={t} value={t} className="bg-white dark:bg-slate-900">{t}</option>
                  ))}
                </select>
                
                <select 
                  value={formPriority} 
                  onChange={e => setFormPriority(e.target.value)} 
                  className="bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-200 focus:outline-none transition-colors"
                >
                  <option value="High" className="bg-white dark:bg-slate-900">High 🔴</option>
                  <option value="Medium" className="bg-white dark:bg-slate-900">Medium 🟡</option>
                  <option value="Low" className="bg-white dark:bg-slate-900">Low ⚪</option>
                </select>
              </div>

              {/* Due Date & Assignee */}
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="date"
                  value={formDueDate}
                  onChange={e => setFormDueDate(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-200 focus:outline-none transition-colors"/>

                <input
                  type="text"
                  placeholder="Assignee (Nama Karyawan)"
                  value={formAssignee}
                  onChange={e => setFormAssignee(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-200 focus:outline-none transition-colors"/>

              </div>

              {/* Tombol Action */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button 
                  type="button" 
                  onClick={() => setIsTaskModalOpen(false)} 
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                  Batal
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl transition-colors shadow-md">
                  {editingTask ? 'Simpan Perubahan' : 'Simpan Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL CREATE COLUMN */}
      {isColumnModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-sm p-5 shadow-2xl transition-colors">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm mb-3">Tambah Kolom Custom Baru</h3>
            <form onSubmit={handleAddColumn}>
              <input required type="text" placeholder="Nama kolom (e.g. To Do, Done)..." value={newColumnTitle} onChange={e => setNewColumnTitle(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 focus:border-blue-500 mb-4 transition-colors" />
              
              {/* PILIHAN WARNA */}
              <div className="mb-6">
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">Pilih Warna Kolom</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { name: 'Slate', color: 'bg-slate-500' },
                    { name: 'Blue', color: 'bg-blue-500' },
                    { name: 'Amber', color: 'bg-amber-500' },
                    { name: 'Emerald', color: 'bg-emerald-500' },
                    { name: 'Rose', color: 'bg-rose-500' },
                    { name: 'Purple', color: 'bg-purple-500' },
                    { name: 'Cyan', color: 'bg-cyan-500' },
                  ].map((c) => (
                    <button
                      key={c.color}
                      type="button"
                      onClick={() => setNewColumnColor(c.color)}
                      className={`w-8 h-8 rounded-full ${c.color} transition-all ${
                        newColumnColor === c.color ? 'ring-2 ring-offset-2 ring-slate-400 dark:ring-offset-slate-900 scale-110' : 'opacity-60 hover:opacity-100 hover:scale-105'
                      }`}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setIsColumnModalOpen(false)} className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">Batal</button>
                <button type="submit" className="px-4 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-xl hover:bg-blue-500 transition-colors">Tambah Kolom</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* MODAL CREATE BOARD */}
      {isBoardModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm p-5 shadow-2xl">
            <h3 className="font-bold text-slate-100 text-sm mb-3">Tambah Board Baru</h3>
            <form onSubmit={handleCreateBoard}>
              <input
                required
                type="text"
                placeholder="Nama board (e.g. Project Alpha)..."
                value={newBoardName}
                onChange={e => setNewBoardName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:border-blue-500 mb-4"
              />
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setIsBoardModalOpen(false)} className="px-3 py-1.5 bg-slate-800 text-slate-300 text-xs rounded-xl">Batal</button>
                <button type="submit" className="px-4 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-xl">Tambah Board</button>
              </div>
            </form>
          </div>
        </div>
      )}
            {/* CUSTOM MODAL HAPUS KOLOM */}
      {columnToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/50 dark:bg-slate-950/80 backdrop-blur-sm transition-colors">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-sm p-6 shadow-2xl transition-colors">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-500/20 flex items-center justify-center mb-4 transition-colors">
                <AlertCircle className="w-6 h-6 text-rose-600 dark:text-rose-500" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Hapus Kolom?</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                Yakin mau hapus kolom <strong className="text-slate-800 dark:text-slate-200">"{columnToDelete.name}"</strong>? Semua tugas di dalamnya akan hilang permanen.
              </p>
              <div className="flex gap-3 w-full">
                <button 
                  onClick={() => setColumnToDelete(null)} 
                  className="flex-1 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold transition-colors"
                >
                  Batal
                </button>
                <button 
                  onClick={handleDeleteColumn} 
                  className="flex-1 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-rose-600/20 transition-colors"
                >
                  Ya, Hapus
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}