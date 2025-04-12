import React, { useState, useEffect } from 'react';
import translate from 'translate';
import { Languages } from "lucide-react";

const LyricsDisplay = ({ track, showTranslateButton = true }) => {
  const [lyrics, setLyrics] = useState('');
  const [translatedLyrics, setTranslatedLyrics] = useState('');
  const [isTranslated, setIsTranslated] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!track) return;
    const fetchLyrics = async () => {
      try {
        const res = await fetch(`https://api.lyrics.ovh/v1/${track.artist}/${track.name}`);
        const data = await res.json();
        setLyrics(data.lyrics || 'Letra no encontrada');
        setTranslatedLyrics('');
        setIsTranslated(false);
      } catch (error) {
        console.error('Error al obtener la letra:', error);
        setLyrics('Error al obtener la letra');
      }
    };
    fetchLyrics();
  }, [track]);

  const handleTranslate = async () => {
    if (isTranslated) {
      setIsTranslated(false);
      return;
    }
    try {
      setLoading(true);
      const translated = await translate(lyrics, { to: 'es' });
      setTranslatedLyrics(translated);
      setIsTranslated(true);
    } catch (error) {
      console.error('Error al traducir la letra:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-zinc-900 p-6 rounded-lg relative  overflow-y-auto">
      {showTranslateButton && (
        <button
          onClick={handleTranslate}
          disabled={loading}
          className="absolute top-3 right-3 text-sm flex items-center gap-1 text-purple-400 hover:text-purple-200"
        >
          <Languages className="w-4 h-4" />
          {isTranslated ? 'Ver original' : 'Traducir'}
        </button>
      )}
      <pre className="whitespace-pre-wrap text-xl text-zinc-300 font-sans mt-6">
        {isTranslated ? translatedLyrics : lyrics}
      </pre>
    </div>
  );
};

export default LyricsDisplay;
