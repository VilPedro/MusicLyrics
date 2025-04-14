export default async function handler(req, res) {
    const query = req.query.q;
    const YT_API_KEY = process.env.YT_API_KEY;
  
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&key=${YT_API_KEY}`
      );
      const data = await response.json();
      res.status(200).json(data);
    } catch {
      res.status(500).json({ error: "Failed to fetch" });
    }
  }