import type { Location } from '../../types/weather';

interface FavoritesProps {
  favorites: Location[];
  currentLocationId: Location['id'];
  onSelect: (location: Location) => void;
}

export function Favorites({ favorites, currentLocationId, onSelect }: FavoritesProps) {
  return (
    <section className="favorites-section" aria-labelledby="favorites-title">
      <div className="favorites-heading">
        <div>
          <p className="section-kicker">Сохранённые места</p>
          <h2 id="favorites-title">Избранное</h2>
        </div>
        <span>{favorites.length} / 5</span>
      </div>

      {favorites.length === 0 ? (
        <div className="favorites-empty">
          <span aria-hidden="true">☆</span>
          <div>
            <strong>Здесь пока пусто</strong>
            <p>Нажмите звезду рядом с названием города, чтобы сохранить его.</p>
          </div>
        </div>
      ) : (
        <div className="favorite-chips">
          {favorites.map((favorite) => (
            <button
              className={favorite.id === currentLocationId ? 'favorite-chip active' : 'favorite-chip'}
              key={favorite.id}
              type="button"
              onClick={() => onSelect(favorite)}
            >
              <span>{favorite.name}</span>
              <small>{favorite.country}</small>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
