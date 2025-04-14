import React, { useEffect, useState } from 'react';
import { Play } from 'lucide-react';

function YouTubeEmbed({ songTitle }) {
  const [videoId, setVideoId] = useState(null);

  useEffect(() => {
    if (!songTitle) return;
  
    const fetchVideo = async () => {
      try {
        const res = await fetch(`/api/youtube?q=${encodeURIComponent(songTitle)}`);
        const data = await res.json();
  
        if (data.videoId) {
          setVideoId(data.videoId);
        } else {
          console.error("No se encontró video:", data.error);
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
