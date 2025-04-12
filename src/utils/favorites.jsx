const FAVORITES_KEY = "favorites";

export const getFavorites = () => {
  const stored = localStorage.getItem(FAVORITES_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const isFavorite = (track) => {
  const favorites = getFavorites();
  return favorites.some(f => f.name === track.name && f.artist === track.artist);
};

export const toggleFavorite = (track) => {
  const favorites = getFavorites();
  const index = favorites.findIndex(f => f.name === track.name && f.artist === track.artist);

  if (index !== -1) {
    favorites.splice(index, 1);
  } else {
    favorites.push(track);
  }

  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
};

export const removeFavorite = (trackToRemove) => {
  const favorites = getFavorites().filter(
    (track) =>
      track.name !== trackToRemove.name ||
      track.artist !== trackToRemove.artist
  );
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
};
