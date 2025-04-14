export default async function handler(req, res) {
  const query = req.query.q;
  // eslint-disable-next-line no-undef
  const YT_API_KEY = process.env.YT_API_KEY;

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${encodeURIComponent(query)}&key=${YT_API_KEY}&maxResults=1`
    );
    const data = await response.json();

    const videoId = data.items?.[0]?.id?.videoId;

    if (!videoId) {
      return res.status(404).json({ error: "No se encontró video." });
    }

    res.status(200).json({ videoId });
  } catch  {
    res.status(500).json({ error: "Failed to fetch" });
  }
}
