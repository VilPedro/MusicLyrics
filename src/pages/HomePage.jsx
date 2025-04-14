import React, { useState, useEffect } from 'react';
import LyricsDisplay from '../components/LyricsDisplay'; 
import YouTubeEmbed from '../components/YouTubeEmbed';
import { Music, Heart } from 'lucide-react';
import { isFavorite, toggleFavorite } from '../utils/favorites';


const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedTrackHome, setSelectedTrackHome] = useState(null);
  const [favoritesChanged, setFavoritesChanged] = useState(false);

  useEffect(() => {
    if (searchQuery.length > 0) {
      fetch(`/api/lastfm?method=track.search&query=${encodeURIComponent(searchQuery)}`)
        .then(response => response.json())
        .then(data => {
          const tracks = data.results?.trackmatches?.track || [];
          setSuggestions(tracks.slice(0, 7));
        })
        .catch(error => console.error('Error al obtener sugerencias:', error));
    } else {
      setSuggestions([]);
    }
  }, [searchQuery]);

  const handleTrackSelect = (track) => {
    setSelectedTrackHome(track);
    setSuggestions([]);
  };

  const handleToggleFavorite = (track) => {
    toggleFavorite(track);
    setFavoritesChanged(!favoritesChanged);
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Bienvenido a mi MusicLyrics</h2>

      <div className="relative w-full mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar canciones..."
          className="w-full rounded-lg bg-zinc-800 p-3 text-white"
        />

        {suggestions.length > 0 && (
          <div className="mt-4">
            {suggestions.map((track) => (
              <div
                key={track.url}
                className="flex items-center gap-2 cursor-pointer hover:bg-zinc-700 p-2 rounded-lg"
                onClick={() => handleTrackSelect(track)}
              >
                <Music className="w-8 h-8 text-purple-500" />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{track.name}</h3>
                  <p className="text-sm text-zinc-400">{track.artist}</p>
                </div>
                <button
                  className="cursor-pointer mt-2 p-2 rounded-full bg-zinc-800 hover:bg-purple-500 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleFavorite(track);
                  }}
                >
                  {isFavorite(track) ? (
                    <Heart className="w-4 h-4 text-red-600" />
                  ) : (
                    <Heart className="w-4 h-4" />
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-zinc-900 rounded-lg overflow-hidden shadow-lg">
          <YouTubeEmbed songTitle={selectedTrackHome?.name || null} />
          <div className="p-4 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-lg">{selectedTrackHome?.name || "Nombre de la Canción"}</h3>
              <p className="text-sm text-zinc-400">{selectedTrackHome?.artist || "Artista"}</p>
            </div>
            {selectedTrackHome && (
              <button
                className="cursor-pointer mt-2 p-2 rounded-full bg-zinc-800 hover:bg-purple-500 transition-colors"
                onClick={() => handleToggleFavorite(selectedTrackHome)}
              >
                {isFavorite(selectedTrackHome) ? (
                  <Heart className="w-5 h-5 text-red-600" />
                ) : (
                  <Heart className="w-5 h-5" />
                )}
              </button>
            )}
          </div>
        </div>

        <div className="bg-zinc-900 rounded-lg overflow-hidden shadow-lg">
          <div className="p-4 border-b border-zinc-800 overflow-hidden">
            <h3 className="font-bold">Letra</h3>
          </div>
          <div className="p-4 max-h-[300px] overflow-auto">
            {selectedTrackHome ? (
              <LyricsDisplay track={selectedTrackHome} />
            ) : (
              <p className="text-zinc-500 text-sm">Selecciona una canción para ver la letra</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
