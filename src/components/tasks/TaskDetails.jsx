import { Check, Edit2, Trash2 } from "lucide-react";

export default function TaskDetails({ task, onEdit, onDelete }) {
  if (!task) return <div className="flex items-center justify-center h-full text-gray-400">Select a task to view details</div>;

  return (
    <div className="max-w-4xl relative">
      {/* Action Buttons removed for now */}
      <div className="absolute top-0 right-0 flex gap-2">
      </div>

      <div className="flex gap-2 mb-4">
        <span className="bg-orange-50 text-orange-600 px-3 py-1 rounded text-xs font-bold uppercase">{task.dept || 'Department'}</span>
        <span className={`px-3 py-1 rounded text-xs font-bold uppercase ${
          task.priority?.toLowerCase() === 'high' ? 'bg-red-50 text-red-600' : 
          task.priority?.toLowerCase() === 'medium' ? 'bg-amber-50 text-amber-600' : 
          'bg-emerald-50 text-emerald-600'
        }`}>
          {task.priority || 'Low'} Priority
        </span>
      </div>
      
      <h1 className="text-3xl font-bold text-gray-900 mb-4 pr-24">{task.title}</h1>
      
      <div className="flex gap-2 mb-8">
        <span className="px-3 py-1 border border-gray-200 rounded-full text-xs text-gray-500 font-medium capitalize flex items-center gap-1.5">
          <div className={`w-2 h-2 rounded-full ${
            task.status === 'completed' ? 'bg-emerald-500' :
            task.status === 'in-progress' ? 'bg-blue-500' :
            'bg-gray-400'
          }`} />
          {task.status?.replace('-', ' ') || 'To Do'}
        </span>
        {task.due_date && (
          <span className="px-3 py-1 border border-gray-200 rounded-full text-xs text-gray-500 font-medium">
            Due: {task.due_date}
          </span>
        )}
      </div>

      {/* AI Banner */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
            <span className="text-sm">AI</span>
          </div>
          <span className="text-blue-700 font-medium text-sm">AI Task Optimization Available</span>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-1.5 bg-white border border-blue-200 text-blue-600 text-sm font-bold rounded-lg hover:bg-blue-50 transition-colors">Break into smaller steps</button>
          <button className="px-4 py-1.5 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 shadow-sm transition-colors">AI Refine</button>
        </div>
      </div>

      <section className="mb-8">
        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Description</h3>
        <p className="text-gray-600 leading-relaxed bg-white border border-gray-100 p-6 rounded-xl shadow-sm whitespace-pre-wrap">
          {task.description || 'No description provided...'}
        </p>
      </section>
    </div>
  );
}