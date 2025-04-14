
export default async function handler(req, res) {
    const { artist, track } = req.query;
  
    const apiKey = process.env.LASTFM_API;
  
    const url = `https://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=${apiKey}&artist=${encodeURIComponent(artist)}&track=${encodeURIComponent(track)}&format=json`;
  
    try {
      const response = await fetch(url);
      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
      console.error('Error al obtener datos de Last.fm:', error);
      res.status(500).json({ error: 'Error al obtener datos de Last.fm' });
    }
  }
  