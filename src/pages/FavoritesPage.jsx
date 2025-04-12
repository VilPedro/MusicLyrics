import { Play, Music4, HeartOff } from "lucide-react";
import { useState, useEffect } from "react";
import LyricsDisplay from "../components/LyricsDisplay";
import YouTubeEmbed from "../components/YouTubeEmbed";
import { getFavorites, removeFavorite } from "../utils/favorites";


const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [selectedTrack, setSelectedTrack] = useState(null);

  useEffect(() => {
    setFavorites(getFavorites());
  }, []);

  const handleRemoveFavorite = (trackToRemove) => {
    removeFavorite(trackToRemove);
    setFavorites(getFavorites());
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Tus favoritos</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-zinc-900 rounded-lg overflow-hidden shadow-lg">
          <div className="aspect-video w-full">
            {selectedTrack ? (
              <YouTubeEmbed songTitle={`${selectedTrack.name} ${selectedTrack.artist}`} />
            ) : (
              <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                <div className="text-center">
                  <Play className="w-12 h-12 text-purple-500 mx-auto mb-2" />
                  <p className="text-zinc-400">Selecciona una canción para reproducir</p>
                </div>
              </div>
            )}
          </div>
          <div className="p-4">
            <h3 className="font-bold text-lg">{selectedTrack?.name}</h3>
            <p className="text-sm text-zinc-400">{selectedTrack?.artist}</p>
          </div>
        </div>

        <div className="bg-zinc-900 rounded-lg overflow-hidden shadow-lg">
          <div className="p-4 border-b border-zinc-800 flex justify-between items-center">
            <h3 className="font-bold">Letra</h3>
          </div>
          <div className="p-6 h-[300px] overflow-y-auto text-zinc-300 space-y-4">
            <p className="text-center text-purple-400 font-medium">
              <LyricsDisplay track={selectedTrack} />
            </p>
          </div>
        </div>
      </div>

      <div className="bg-zinc-900/50 rounded-md">
        <div className="grid grid-cols-[16px_4fr_2fr_1fr] gap-4 p-3 text-zinc-400 text-sm border-b border-zinc-800">
          <div>#</div>
          <div>TÍTULO</div>
          <div>ARTISTA</div>
          <div className="text-right">ACCIONES</div>
        </div>

        {favorites.map((track, index) => (
          <div
            key={track.url || `${track.name}-${track.artist}-${index}`}
            className="grid grid-cols-[16px_4fr_2fr_1fr] gap-4 p-3 text-sm hover:bg-zinc-800/50 rounded-md group"
          >
            <div className="flex items-center text-zinc-400">{index}</div>
            <div className="flex items-center gap-3">
              <Music4 />
              <div>
                <p className="font-medium">{track.name}</p>
                <p className="text-zinc-400">{track.album}</p>
              </div>
            </div>
            <div className="flex items-center text-zinc-400">{track.artist}</div>
            <div className="flex items-center justify-end gap-2">
              <button
                className="p-1.5 rounded-full bg-zinc-800 hover:bg-purple-500 transition-colors cursor-pointer"
                onClick={() => setSelectedTrack(track)}
              >
                <Play size={14} />
              </button>
              <button
                className="p-1.5 rounded-full bg-zinc-800 hover:bg-purple-500 transition-colors cursor-pointer"
                onClick={() => handleRemoveFavorite(track)}
              >
                <HeartOff size={14} className="size-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavoritesPage;
