import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axiosSetup';
import TaskCard from '../components/TaskCard';
import { Plus, Filter, LayoutGrid, ListTodo, Search } from 'lucide-react';

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isCreating, setIsCreating] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Update debounced search term with delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchTasks = async (pageToFetch = page, status = statusFilter, searchStr = debouncedSearch) => {
    setIsLoading(true);
    try {
      const response = await api.get('/tasks', {
        params: {
          page: pageToFetch,
          limit: 10,
          status: status || undefined,
          search: searchStr || undefined
        }
      });
      
      const responseData = response.data?.data || response.data || {};
      
      let tasksList = [];
      let total = 0;
      
      if (responseData.tasks && Array.isArray(responseData.tasks)) {
        tasksList = responseData.tasks;
        total = responseData.pagination?.total ?? responseData.total ?? tasksList.length;
      } else if (Array.isArray(responseData)) {
        tasksList = responseData;
        total = response.data?.total ?? tasksList.length;
      } else if (response.data?.tasks && Array.isArray(response.data.tasks)) {
        tasksList = response.data.tasks;
        total = response.data.pagination?.total ?? response.data.total ?? tasksList.length;
      }
      
      setTasks(tasksList); 
      setTotalPages(Math.ceil(total / 10));
    } catch (error) {
      console.error('Failed to fetch tasks', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks(1, statusFilter, debouncedSearch);
    setPage(1);
  }, [statusFilter, debouncedSearch]);

  useEffect(() => {
    if (page !== 1) {
      fetchTasks(page, statusFilter, debouncedSearch);
    }
  }, [page]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    
    try {
      await api.post('/tasks', { 
        title: newTaskTitle, 
        description: newTaskDesc 
      });
      setNewTaskTitle('');
      setNewTaskDesc('');
      setIsCreating(false);
      fetchTasks(1, statusFilter, debouncedSearch);
      setPage(1);
    } catch (error) {
      console.error('Failed to create task', error);
    }
  };

  const isAdmin = user?.role === 'admin';

  // Stats calculation
  const totalTasksCount = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'done').length;
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress').length;
  const completionRate = totalTasksCount > 0 ? Math.round((completedTasks / totalTasksCount) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-10 lg:p-16 animate-fade-in relative">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8">
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-indigo-400 font-bold tracking-[0.2em] uppercase text-[10px] bg-indigo-500/10 w-fit px-3 py-1.5 rounded-full border border-indigo-500/20">
            <LayoutGrid className="w-3.5 h-3.5" />
            Workspace Core
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-white tracking-tighter leading-none">
            Welcome, <span className="text-indigo-400 opacity-90">{user?.name?.split(' ')[0]}</span>.
          </h1>
          <p className="text-slate-400 text-lg font-medium max-w-lg leading-relaxed">
            Your technical ecosystem is optimized. You have <span className="text-white">{totalTasksCount}</span> active objectives across the project.
          </p>
        </div>
        
        <div className="flex gap-4">
          <button
            onClick={() => setIsCreating(true)}
            className="btn-premium bg-white text-black px-8 py-4 rounded-2xl font-bold text-sm tracking-tight flex items-center gap-2 group shadow-xl shadow-white/5"
          >
            <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" />
            Initialize Task
          </button>
        </div>
      </div>

      {/* Bento Grid Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
        <div className="glass-panel p-8 rounded-[32px] flex flex-col justify-between group hover:border-indigo-500/30 transition-all duration-500">
          <div className="flex justify-between items-start">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
              <ListTodo className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold text-indigo-400/50 tracking-widest uppercase">Total</span>
          </div>
          <div>
            <div className="text-5xl font-extrabold text-white mb-1">{totalTasksCount}</div>
            <p className="text-slate-500 font-medium text-sm">System Objectives</p>
          </div>
        </div>

        <div className="glass-panel p-8 rounded-[32px] flex flex-col justify-between group hover:border-emerald-500/30 transition-all duration-500">
          <div className="flex justify-between items-start">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <div className="w-6 h-6 border-2 border-current rounded-full flex items-center justify-center text-[10px] font-black">✓</div>
            </div>
            <span className="text-[10px] font-bold text-emerald-400/50 tracking-widest uppercase">Verified</span>
          </div>
          <div>
            <div className="text-5xl font-extrabold text-white mb-1">{completedTasks}</div>
            <p className="text-slate-500 font-medium text-sm">Success Deployments</p>
          </div>
        </div>

        <div className="col-span-1 md:col-span-2 glass-panel p-8 rounded-[32px] flex flex-col justify-between group relative overflow-hidden transition-all duration-500 hover:border-white/20">
          <div className="absolute top-0 right-0 p-8">
            <Search className="w-24 h-24 text-white/5 -mr-8 -mt-8 rotate-12" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-8">
               <div className="h-1 w-24 bg-indigo-500/20 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 transition-all duration-1000" style={{ width: `${completionRate}%` }}></div>
               </div>
               <span className="text-2xl font-black text-white">{completionRate}%</span>
               <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Efficiency Rate</span>
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-bold text-white tracking-tight">Project Health</h3>
              <p className="text-slate-500 font-medium text-sm max-w-sm">The current completion velocity is optimal. Keep maintaining the same throughput for the next milestone.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Actions */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6 border-y border-white/5 py-8">
        <div className="flex items-center gap-8 w-full md:w-auto">
          {['', 'pending', 'in_progress', 'done'].map((status) => (
            <button
              key={status}
              onClick={() => { setStatusFilter(status); setPage(1); }}
              className={`text-sm font-bold tracking-tight transition-all relative py-2 ${
                statusFilter === status ? 'text-white' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {status === '' ? 'All Tasks' : status.replace('_', ' ').charAt(0).toUpperCase() + status.slice(1)}
              {statusFilter === status && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 animate-fade-in"></div>
              )}
            </button>
          ))}
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search objectives..." 
              className="w-full bg-white/5 border border-white/5 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-white/20 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Creation Modal/Section */}
      {isCreating && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="glass-panel w-full max-w-lg p-10 rounded-[40px] border border-white/10 shadow-2xl relative">
            <button 
              onClick={() => setIsCreating(false)}
              className="absolute top-8 right-8 text-slate-500 hover:text-white transition-colors"
            >
              <Plus className="w-6 h-6 rotate-45" />
            </button>

            <h3 className="text-3xl font-extrabold text-white mb-2 tracking-tighter">New Objective</h3>
            <p className="text-slate-400 text-sm mb-10 font-medium">Define the technical parameters for the next deployment.</p>
            
            <form onSubmit={handleCreateTask} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Title</label>
                <input
                  type="text"
                  className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-indigo-500/50 transition-all font-medium"
                  placeholder="Task title..."
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Description</label>
                <textarea
                  className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-indigo-500/50 transition-all font-medium min-h-[120px]"
                  placeholder="Add context..."
                  value={newTaskDesc}
                  onChange={(e) => setNewTaskDesc(e.target.value)}
                />
              </div>
              
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="btn-premium flex-1 bg-indigo-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-500/20"
                >
                  Create Objective
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Content Section */}
      <div className="relative">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-32 space-y-6">
            <div className="w-16 h-16 border-4 border-white/5 border-t-indigo-500 rounded-full animate-spin"></div>
            <p className="text-slate-500 font-bold tracking-[.3em] uppercase text-[10px]">Synchronizing...</p>
          </div>
        ) : tasks.length === 0 ? (
          <div className="glass-panel p-32 rounded-[40px] text-center flex flex-col items-center border border-dashed border-white/10">
            <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/5 flex items-center justify-center text-slate-400 mb-8">
              <ListTodo className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Clean Architecture</h2>
            <p className="text-slate-500 font-medium mb-12 max-w-sm mx-auto">Your system is currently idle. No tasks match the current filter parameters.</p>
            <button
               onClick={() => setIsCreating(true)}
               className="btn-premium bg-white text-black px-10 py-4 rounded-2xl font-bold text-sm"
            >
              Start New Flow
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tasks.map((task) => (
              <TaskCard 
                key={task.id} 
                task={task} 
                isAdmin={isAdmin}
                onTaskUpdated={() => fetchTasks(page, statusFilter, debouncedSearch)}
                onTaskDeleted={() => fetchTasks(page, statusFilter, debouncedSearch)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {!isLoading && totalPages > 1 && (
        <div className="flex justify-center items-center gap-6 mt-20">
          <button
            className="w-12 h-12 flex items-center justify-center glass-panel rounded-2xl text-slate-500 hover:text-white transition-all disabled:opacity-20"
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
          >
            <Plus className="w-5 h-5 rotate-45" />
          </button>
          <div className="flex flex-col items-center">
            <span className="text-xl font-black text-white">{page}</span>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Page</span>
          </div>
          <button
            className="w-12 h-12 flex items-center justify-center glass-panel rounded-2xl text-slate-500 hover:text-white transition-all disabled:opacity-20"
            disabled={page === totalPages}
            onClick={() => setPage(p => p + 1)}
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
