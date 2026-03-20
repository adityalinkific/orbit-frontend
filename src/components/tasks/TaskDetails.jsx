export default function TaskDetails({ task }) {
  if (!task) return <div className="flex items-center justify-center h-full text-gray-400">Select a task to view details</div>;

  return (
    <div className="max-w-4xl">
      <div className="flex gap-2 mb-4">
        <span className="bg-orange-50 text-orange-600 px-3 py-1 rounded text-xs font-bold uppercase">Marketing</span>
        <span className="bg-red-50 text-red-600 px-3 py-1 rounded text-xs font-bold uppercase">High Priority</span>
      </div>
      
      <h1 className="text-3xl font-bold text-gray-900 mb-4">{task.title}</h1>
      
      <div className="flex gap-2 mb-8">
        {['#planning', '#strategy', '#quarterly'].map(tag => (
          <span key={tag} className="px-3 py-1 border border-gray-200 rounded-full text-xs text-gray-500 font-medium">
            {tag}
          </span>
        ))}
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
        <p className="text-gray-600 leading-relaxed bg-white border border-gray-100 p-6 rounded-xl shadow-sm italic">
          Complete overhaul of the Q4 marketing plan to focus on the new product line launch...
        </p>
      </section>

      <section>
        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Suggested Execution Steps</h3>
        <div className="space-y-3">
          {[
            { text: "Audit previous Q3 campaign performance data", done: true },
            { text: "Define core KPIs and budget limits for Q4", done: false },
            { text: "Draft new creative assets brief for design team", done: false },
          ].map((step, i) => (
            <div key={i} className="flex items-center gap-4 bg-white p-4 border border-gray-100 rounded-xl group hover:border-blue-200 transition-all cursor-pointer">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${step.done ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-gray-200'}`}>
                {step.done && <Check className="w-3 h-3" />}
              </div>
              <span className={`text-sm font-medium ${step.done ? 'text-gray-400 line-through' : 'text-gray-700'}`}>{step.text}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}