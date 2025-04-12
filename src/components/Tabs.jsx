export default function Tabs({ tabs, activeTab, onChange, children }) {
  return (
    <div className="mt-6">
      <div className="flex rounded-md bg-zinc-800">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`flex-1 px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${
              activeTab === tab.id ? "bg-zinc-700 text-white" : "text-zinc-400 hover:bg-zinc-700/50 hover:text-white"
            }`}
            onClick={() => onChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {children}
    </div>
  )
}
