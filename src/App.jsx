import React, { useState } from 'react';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import FavoritesPage from './pages/FavoritesPage';
import SideBar from './components/SideBar';

function App() {
  const [currentTab, setCurrentTab] = useState("home");

  return (
    <div className="min-h-screen bg-black text-white flex">   
      <SideBar currentTab={currentTab} setCurrentTab={setCurrentTab} />
      <div className="flex-1 overflow-auto p-8">
        {currentTab === "home" && <HomePage />}
        {currentTab === "favorites" && <FavoritesPage />} 
        {currentTab === "search" && <SearchPage  />}
      </div>
    </div>
  );
}

export default App;