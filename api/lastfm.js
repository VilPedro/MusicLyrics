export default async function handler(req, res) {
    const { method, artist, track, query } = req.query;
  
    const apiKey = process.env.LASTFM_API_KEY; 
  
    if (!method) {
      return res.status(400).json({ error: "Missing 'method' parameter" });
    }
  
    let url;
    switch (method) {
    
      case "track.getInfo":
        if (!artist || !track) {
          return res.status(400).json({ error: "Missing artist or track" });
        }
        url = `https://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=${apiKey}&artist=${encodeURIComponent(artist)}&track=${encodeURIComponent(track)}&format=json`;
        break;
  
      
      case "track.search":
        if (!query) {
          return res.status(400).json({ error: "Missing query" });
        }
        url = `https://ws.audioscrobbler.com/2.0/?method=track.search&track=${encodeURIComponent(query)}&api_key=${apiKey}&format=json`;
        break;
  
      default:
        return res.status(400).json({ error: "Invalid Last.fm API method" });
    }
  
    try {
      const response = await fetch(url);
      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
      console.error("Last.fm API error:", error);
      res.status(500).json({ error: "Failed to fetch from Last.fm" });
    }
  }