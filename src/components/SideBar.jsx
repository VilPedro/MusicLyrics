import React from 'react';
import { Home, MicVocal, Heart,} from "lucide-react";

const Sidebar = ({ currentTab, setCurrentTab }) => {
  return (
    <div className="w-64 bg-zinc-900 p-6 flex flex-col">
      <a href="home"><h1 className="text-2xl font-bold text-purple-500 mb-8">MusicLyrics</h1></a>
      
      <nav className="space-y-4">
        {[{ id: "home", label: "Inicio", Icon: Home },
          { id: "search", label: "Letras", Icon: MicVocal },
          { id: "favorites", label: "Favoritos", Icon: Heart },
          
        ].map(({ id, label, Icon }) => (
          <a key={id} href="#" className={`flex items-center gap-3 p-2 rounded-md hover:bg-zinc-800 ${currentTab === id ? "bg-zinc-800 text-purple-500" : ""}`} onClick={(e) => { e.preventDefault(); setCurrentTab(id); }}>
            <Icon className="text-purple-500" />
            <span>{label}</span>
          </a>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;