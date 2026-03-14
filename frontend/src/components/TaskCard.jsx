import React, { useState } from 'react';
import api from '../api/axiosSetup';
import { Pencil, Trash2, CheckCircle2, Circle, Clock, Check, X, User } from 'lucide-react';

export default function TaskCard({ task, onTaskUpdated, onTaskDeleted, isAdmin }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
  const [status, setStatus] = useState(task.status);
  const [isLoading, setIsLoading] = useState(false);

  const canEdit = true; // Business logic: handled in backend, UI allows always to trigger interaction

  const handleUpdate = async (e) => {
    if(e) e.preventDefault();
    setIsLoading(true);
    try {
      await api.put(`/tasks/${task.id}`, { title, description, status });
      onTaskUpdated();
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update task:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    setStatus(newStatus);
    setIsLoading(true);
    try {
      await api.put(`/tasks/${task.id}`, { status: newStatus });
      onTaskUpdated();
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    setIsLoading(true);
    try {
      await api.delete(`/tasks/${task.id}`);
      onTaskDeleted();
    } catch (error) {
      console.error('Failed to delete task:', error);
      setIsLoading(false);
    }
  };

  const statusInfo = {
    pending: {
      color: 'text-amber-400 bg-amber-400/5 border-amber-400/20',
      fill: 'bg-amber-400',
      icon: <Circle className="w-5 h-5 text-amber-500/80" />
    },
    in_progress: {
      color: 'text-sky-400 bg-sky-400/5 border-sky-400/20',
      fill: 'bg-sky-400',
      icon: <Clock className="w-5 h-5 text-sky-400/80" />
    },
    done: {
      color: 'text-emerald-400 bg-emerald-400/5 border-emerald-400/20',
      fill: 'bg-emerald-400',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-400/80" />
    },
  };

  if (isEditing) {
    return (
      <div className="glass-panel p-8 rounded-[32px] animate-fade-in border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500/40"></div>
        <form onSubmit={handleUpdate} className="space-y-6 relative z-10">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Title</label>
            <input
              type="text"
              className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-indigo-500/50 transition-all font-bold text-lg"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Description</label>
            <textarea
              className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-indigo-500/50 transition-all font-medium min-h-[120px]"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Technical parameters..."
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Status</label>
            <select 
              className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none appearance-none cursor-pointer font-bold"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-6 border-t border-white/5">
            <button
              type="button"
              className="px-6 py-3 text-sm font-bold text-slate-500 hover:text-white transition-colors"
              onClick={() => {
                setIsEditing(false);
                setTitle(task.title);
                setDescription(task.description || '');
                setStatus(task.status);
              }}
              disabled={isLoading}
            >
              Discard
            </button>
            <button
              type="submit"
              className="btn-premium bg-white text-black py-3 px-8 rounded-xl font-bold flex items-center gap-2"
              disabled={isLoading}
            >
              {isLoading ? <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div> : <Check className="w-5 h-5" />}
              Synchronize
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className={`glass-panel p-8 rounded-[32px] group relative overflow-hidden flex flex-col justify-between min-h-[260px] transition-all duration-700 hover:border-white/20 hover:-translate-y-2 ${status === 'done' ? 'opacity-50' : ''}`}>
      {/* Dynamic Status Aura */}
      <div className={`absolute top-0 right-0 w-48 h-48 blur-[80px] rounded-full -mr-24 -mt-24 opacity-0 group-hover:opacity-20 transition-all duration-700 ${statusInfo[status].fill}`}></div>

      <div className="relative z-10">
        <div className="flex justify-between items-start gap-4 mb-6">
          <button 
            onClick={() => handleStatusChange(status === 'done' ? 'pending' : 'done')}
            className={`flex-shrink-0 transition-all duration-500 hover:scale-125 disabled:opacity-50 group/status`}
            disabled={isLoading}
          >
            <div className={`transition-all duration-500 ${status === 'done' ? 'text-emerald-400' : 'text-slate-600 group-hover/status:text-indigo-400'}`}>
               {statusInfo[status].icon}
            </div>
          </button>
          
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
            <button
              className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-white transition-all rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10"
              onClick={() => setIsEditing(true)}
              disabled={isLoading}
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-rose-500 transition-all rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10"
              onClick={handleDelete}
              disabled={isLoading}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="cursor-pointer" onClick={() => setIsEditing(true)}>
          <h3 className={`text-2xl font-bold leading-[1.2] mb-3 tracking-tighter transition-all duration-500 ${status === 'done' ? 'line-through text-slate-600 font-medium' : 'text-white'}`}>
            {task.title}
          </h3>
          {task.description && (
            <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed font-semibold transition-all group-hover:text-slate-400">
              {task.description}
            </p>
          )}
        </div>
      </div>
      
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 mt-10 pt-6 border-t border-white/5">
        <div className="flex items-center gap-3">
          <div className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.15em] border ${statusInfo[status].color}`}>
            {status.replace('_', ' ')}
          </div>
          <div className="text-slate-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-slate-800"></div>
            {new Date(task.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </div>
        </div>
        
        {isAdmin && task.user && (
          <div className="flex items-center gap-3 bg-white/5 border border-white/5 px-3 py-1.5 rounded-full group-hover:border-white/10 transition-colors">
            <div className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center overflow-hidden">
               <User className="w-3 h-3 text-indigo-400" />
            </div>
            <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest group-hover:text-white transition-colors">
              {task.user.name.split(' ')[0]}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

