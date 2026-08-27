import type { TranslationSet } from '../../i18n/translations';
import type { Location } from '../../types/weather';

interface FavoritesProps {
  favorites: Location[];
  currentLocationId: Location['id'];
  translations: TranslationSet['favorites'];
  onSelect: (location: Location) => void;
}

export function Favorites({ favorites, currentLocationId, translations, onSelect }: FavoritesProps) {
  return (
    <section className="favorites-section" aria-labelledby="favorites-title">
      <div className="favorites-heading">
        <div>
          <p className="section-kicker">{translations.kicker}</p>
          <h2 id="favorites-title">{translations.title}</h2>
        </div>
        <span>{favorites.length} / 5</span>
      </div>

      {favorites.length === 0 ? (
        <div className="favorites-empty">
          <span aria-hidden="true">☆</span>
          <div>
            <strong>{translations.emptyTitle}</strong>
            <p>{translations.emptyHint}</p>
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
