export default async function handler(req, res) {
    const query = req.query.q;
  
    if (!query) {
      return res.status(400).json({ error: "Missing search query" });
    }
  
    const YT_API_KEY = process.env.YT_API_KEY;
  
    try {
      const ytRes = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=1&key=${YT_API_KEY}`
      );
      const ytData = await ytRes.json();
  
      if (!ytData.items || ytData.items.length === 0) {
        return res.status(404).json({ error: "No video found" });
      }
  
      const videoId = ytData.items[0].id.videoId;
      res.status(200).json({ videoId });
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch from YouTube" });
    }
  }
  