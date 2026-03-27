import { useState, useEffect } from "react";
import { 
  Clock,
  MoreHorizontal,
  Plus
} from 'lucide-react';

const priorityStyles = {
  high: "bg-red-50 text-red-600 border-red-100",
  medium: "bg-orange-50 text-orange-600 border-orange-100", 
  low: "bg-emerald-50 text-emerald-600 border-emerald-100",
  all: "bg-gray-50 text-gray-600 border-gray-100"
};

const getDeptStyles = (dept) => {
  const styles = {
    MARKETING: "bg-orange-50 text-orange-600",
    PRODUCT: "bg-purple-50 text-purple-600",
    FINANCE: "bg-emerald-50 text-emerald-600",
    ENGINEERING: "bg-blue-50 text-blue-600",
    DESIGN: "bg-pink-50 text-pink-600",
  };
  return styles[dept?.toUpperCase()] || "bg-gray-50 text-gray-600";
};

const columnConfig = {
  "to-do": { title: "To Do", countColor: "text-gray-400" },
  "in-progress": { title: "In Progress", countColor: "text-blue-500" },
  "completed": { title: "Completed", countColor: "text-emerald-500" }
};

function TaskCard({ task, onDragStart }) {
  return (
    <div 
      draggable
      onDragStart={(e) => onDragStart(e, task)}
      className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:border-blue-400 hover:shadow-md transition-all cursor-grab active:cursor-grabbing group"
    >
      <div className="flex justify-between items-start mb-3">
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${getDeptStyles(task.dept || 'Product')}`}>
          {task.dept || 'Product'}
        </span>
        <button className="text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
          <MoreHorizontal size={14} />
        </button>
      </div>

      <h4 className="font-bold text-gray-900 text-sm mb-4 leading-tight">
        {task.title}
      </h4>

      <div className="flex items-center justify-between pt-3 border-t border-gray-50">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-600 border border-white">
            {task.user?.slice(0, 2).toUpperCase() || "JD"}
          </div>
          <span className="text-[11px] text-gray-400 flex items-center gap-1 font-medium">
            <Clock size={12} /> {task.due_date || 'Oct 24'}
          </span>
        </div>

        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md border ${priorityStyles[task.priority?.toLowerCase() || 'low']}`}>
          {task.priority || 'LOW'}
        </span>
      </div>
    </div>
  );
}

export default function KanbanBoard({ tasks = [], onStatusChange }) {
  const [columnTasks, setColumnTasks] = useState({
    "to-do": [],
    "in-progress": [],
    "completed": []
  });

  const [draggedTaskId, setDraggedTaskId] = useState(null);

  useEffect(() => {
    const newColumns = { "to-do": [], "in-progress": [], "completed": [] };
    tasks.forEach(task => {
      if (task.status === 'completed') newColumns["completed"].push(task);
      else if (task.status === 'in-progress') newColumns["in-progress"].push(task);
      else newColumns["to-do"].push(task);
    });
    setColumnTasks(newColumns);
  }, [tasks]);

  const handleDragStart = (e, task) => {
    e.dataTransfer.setData("taskId", task.id);
    setDraggedTaskId(task.id);
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // Necessary to allow dropping
  };

  const handleDrop = (e, columnId) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
    setDraggedTaskId(null);
    if (taskId && onStatusChange) {
      onStatusChange(taskId, columnId);
    }
  };

  return (
    <div className="flex gap-6 h-full overflow-x-auto pb-4">
      {Object.entries(columnConfig).map(([columnId, config]) => (
        <div 
          key={columnId} 
          className="flex-shrink-0 w-[350px] flex flex-col"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, columnId)}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4 px-2">
            <div className="flex items-center gap-3">
              <h2 className="text-sm font-bold text-gray-800">{config.title}</h2>
              <span className={`text-xs font-bold px-2 py-0.5 bg-gray-200/50 rounded-full ${config.countColor}`}>
                {columnTasks[columnId]?.length || 0}
              </span>
            </div>
            <button className="p-1 hover:bg-gray-200 rounded text-gray-500 transition-colors">
              <Plus size={16} />
            </button>
          </div>

          {/* Column Content */}
          <div className="flex-1 bg-gray-100/50 rounded-2xl p-3 border border-gray-200/50 space-y-3 overflow-y-auto max-h-[calc(100vh-250px)]">
            {columnTasks[columnId]?.map((task) => (
              <TaskCard 
                key={task.id} 
                task={task} 
                onDragStart={handleDragStart} 
              />
            ))}
            
            {columnTasks[columnId]?.length === 0 && (
              <div className="py-10 text-center border-2 border-dashed border-gray-200 rounded-xl">
                <p className="text-xs text-gray-400 font-medium">No tasks in this stage</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}