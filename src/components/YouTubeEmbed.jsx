import React, { useEffect, useState } from 'react';
import { Play } from 'lucide-react';
const YT_API_KEY = import.meta.env.VITE_YT_API;

function YouTubeEmbed({ songTitle }) {
  const [videoId, setVideoId] = useState(null);

  useEffect(() => {
    if (!songTitle) return;
    const fetchVideo = async () => {
      try {
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(songTitle)}&type=video&key=${YT_API_KEY}`
        );
        const data = await response.json();
        if (!data.items || data.items.length === 0) {
          console.error("No se encontraron videos para esta búsqueda");
          return;
        }
        if (data.items.length > 0) {
          const firstVideoId = data.items[0].id.videoId;
          setVideoId(firstVideoId);
        }
      } catch (error) {
        console.error("Error al obtener el video de YouTube:", error);
      }
    };
    fetchVideo();
  }, [songTitle]);

  return (
    <div className="aspect-video w-full bg-zinc-800">
      {videoId ? (
        <iframe
          className="w-full h-full"
          src={`https://www.youtube.com/embed/${videoId}`}
          title="YouTube video player"
          allowFullScreen
        />
      ) : (
        <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
          <div className="text-center">
            <Play className="w-12 h-12 text-purple-500 mx-auto mb-2" />
            <p className="text-zinc-400">Selecciona una canción para reproducir</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default YouTubeEmbed;
