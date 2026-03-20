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

export default function TaskSidebar({ onSelect, selectedId, tasks = [] }) {
  return (
    <div className="p-4 space-y-3">
      {tasks.map((task) => (
        <div 
          key={task.id}
          onClick={() => onSelect(task)}
          className={`p-5 rounded-2xl border-2 transition-all duration-200 cursor-pointer 
            ${selectedId === task.id 
              ? 'border-blue-500 bg-white shadow-xl translate-x-1' 
              : 'border-white bg-white hover:border-gray-200 shadow-sm'}`}
        >
          <div className="flex justify-between items-start mb-3">
            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${getDeptStyles(task.dept)}`}>
              {task.dept}
            </span>
            <span className="text-gray-400 text-[11px] font-medium flex items-center gap-1">
               {task.date}
            </span>
          </div>
          
          <h3 className="font-bold text-gray-800 text-[14px] mb-4 leading-snug">
            {task.title}
          </h3>
          
          <div className="flex justify-between items-center border-t border-gray-50 pt-3">
             <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-100 to-purple-100 flex items-center justify-center text-[10px] font-bold text-blue-600 ring-2 ring-white">
                  {task.user?.slice(0, 2).toUpperCase() || "UN"}
                </div>
                <span className="text-[12px] font-semibold text-gray-600">Sarah M.</span>
             </div>
             
             <div className="flex items-center gap-1.5">
               <span className={`text-[11px] font-bold uppercase tracking-tight px-2 py-1 rounded-md 
                  ${task.priority === 'High' ? 'text-red-600 bg-red-100' : 
                    task.priority === 'Medium' ? 'text-orange-600 bg-orange-100' : 
                    task.priority === 'Low' ? 'text-green-600 bg-green-100' : 'text-gray-600 bg-gray-100'}`}
                >
                  {task.priority}
                </span>
             </div>
          </div>
        </div>
      ))}
    </div>
  );
}