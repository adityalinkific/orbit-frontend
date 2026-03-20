export function TaskTabs({ tab, setTab }) {
  const tabs = [
    { key: "ongoing", label: "Ongoing" },
    { key: "completed", label: "Completed" },
    { key: "delegated", label: "Delegated"},
    { key: "archive", label: "Archive" }
  ];

  return (
    <div className="flex gap-6 items-center">
      {tabs.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => setTab(key)}
          className={`text-[13px] px-1 py-4 transition-all relative ${
            tab === key ? "text-blue-600" : "text-gray-400 hover:text-gray-600"
          }`}
        >
          {label}
          {tab === key && (
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-blue-600 rounded-full" />
          )}
        </button>
      ))}
    </div>
  );
}