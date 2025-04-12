import React, { useState, useEffect } from 'react';
import LyricsDisplay from '../components/LyricsDisplay';
import { Search, Music, Heart, ExternalLink } from "lucide-react";
import translate from "translate";
import Tabs from '../components/Tabs';
import {  isFavorite, toggleFavorite } from '../utils/favorites';

const LastFM_API = import.meta.env.VITE_LASTFM_API;

const SearchPage = () => {
  const [activeTab, setActiveTab] = useState("lyrics");
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [favoritesChanged, setFavoritesChanged] = useState(false);
  const [songDetails, setSongDetails] = useState({});

 const handleToggleFavorite = (track) => {
     toggleFavorite(track);
     setFavoritesChanged(!favoritesChanged);
   };

  useEffect(() => {
    const fetchSongDetails = async () => {
      if (!selectedTrack?.artist || !selectedTrack?.name) return;

      try {
        const lastfmRes = await fetch(
          `https://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=${LastFM_API}&artist=${encodeURIComponent(selectedTrack.artist)}&track=${encodeURIComponent(selectedTrack.name)}&format=json`
        );
        const lastfmData = await lastfmRes.json();

        if (lastfmData?.track) {
          const rawWiki = lastfmData.track.wiki?.content || "No hay información disponible.";
          const cleanWiki = rawWiki.replace(/<a href=.*last\.fm.*<\/a>/, "").trim();
          const wikiContent = await translate(cleanWiki, { to: "es" });

          setSongDetails({
            title: selectedTrack.name,
            artist: selectedTrack.artist,
            image: lastfmData.track?.album?.image?.[3]?.["#text"]?.trim() || "/default.png",
            wiki: wikiContent,
            tags: lastfmData.track.toptags?.tag?.map(tag => tag.name).join(", ") || "No tags disponibles",
            url: lastfmData.track.url || "#",
          });
        }
      } catch (error) {
        console.error("Error al obtener detalles de la canción:", error);
      }
    };

    fetchSongDetails();
  }, [selectedTrack]);

  useEffect(() => {
    if (searchQuery.length > 0) {
      fetch(`https://ws.audioscrobbler.com/2.0/?method=track.search&api_key=${LastFM_API}&track=${searchQuery}&format=json`)
        .then(response => response.json())
        .then(data => setSuggestions(data.results.trackmatches.track.slice(0, 7)))
        .catch(error => console.error('Error al obtener sugerencias:', error));
    } else {
      setSuggestions([]);
    }
  }, [searchQuery]);

  const TabContent = {
    lyrics: (
      <div className="space-y-4 text-zinc-300 min-h-screen relative">
        <LyricsDisplay track={selectedTrack} />
      </div>
    ),
    info: (
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium text-purple-400">Sobre la canción</h3>
          <p className="text-zinc-300">{songDetails.wiki}</p>
        </div>
        <div>
          <h3 className="text-lg font-medium text-purple-400">Género</h3>
          <p className="text-zinc-300">{songDetails.tags}</p>
        </div>
        <div>
          <a href={songDetails.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-purple-400 hover:underline">
            <h3 className="text-lg font-medium text-purple-400">Puedes saber más en LastFM </h3>
            <ExternalLink className="w-4 h-4 mt-0.5" />
          </a>
        </div>
      </div>
    ),
  };

  return (
    <div className="overflow-hidden">
      <div className="relative w-full mb-4 mt-4">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar canciones, artistas o álbumes..."
          className="w-full rounded-full bg-zinc-800 py-2 pl-10 pr-4 text-sm text-white"
        />
        {suggestions.length > 0 && (
          <div className="relative top-full left-0 right-0 mt-1 max-h-60 overflow-y-auto bg-black border shadow-lg z-20 rounded-md">
            {suggestions.map((track) => (
              <div
                key={track.url}
                className={`flex cursor-pointer items-center rounded-lg p-3 transition-colors ${
                  selectedTrack?.url === track.url ? "bg-purple-900/30" : "bg-zinc-900 hover:bg-zinc-800"
                }`}
                onClick={() => {
                  setSelectedTrack(track);
                  setSuggestions([]);
                }}
              >
                <Music className="h-8 w-8 object-cover rounded-full text-purple-500" />
                <div className="ml-3 flex-1">
                  <h3 className="font-medium text-sm">{track.name}</h3>
                  <p className="text-xs text-zinc-400">{track.artist}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-8">
        <div className="lg:col-span-2">
          {!selectedTrack ? (
            <p>Selecciona una canción para ver detalles.</p>
          ) : !songDetails ? (
            <p>Cargando información de la canción...</p>
          ) : (
            <div className="rounded-xl bg-gradient-to-b from-zinc-900 to-zinc-950 p-6">
              <div className="mb-6 flex flex-col items-center gap-6 md:flex-row">
                <div className="relative h-64 w-68 overflow-hidden rounded-lg shadow-lg">
                  <img
                    src={songDetails.image || "/placeholder.svg"}
                    alt="Album cover"
                    className="h-full w-full object-cover bg-purple-900"
                  />
                </div>
                <div className="flex flex-1 flex-col">
                  <h2 className="text-3xl font-bold text-white">{songDetails.title}</h2>
                  <p className="mb-2 text-xl text-purple-400">{songDetails.artist}</p>
                  
                  <div className="mt-4 flex space-x-3">
                    <button
                      className="cursor-pointer inline-flex items-center rounded-md border border-zinc-700 bg-transparent px-4 py-2 text-sm font-medium text-zinc-300 hover:bg-zinc-800"
                      onClick={() => handleToggleFavorite(selectedTrack)}
                    >
                      {isFavorite(selectedTrack) ? (
                        <Heart className="mr-2 h-4 w-4 text-red-600" />
                      ) : (
                        <Heart className="mr-2 h-4 w-4" />
                      )}
                      Favorito
                    </button>
                    
                  </div>
                </div>
              </div>

              <Tabs
                tabs={[
                  { id: "lyrics", label: "Letra" },
                  { id: "info", label: "Información" },
                ]}
                activeTab={activeTab}
                onChange={setActiveTab}
              >
                <div className="mt-4 rounded-lg bg-zinc-900 p-6 overflow-auto">
                  {TabContent[activeTab]}
                </div>
              </Tabs>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;