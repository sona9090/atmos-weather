import { useState } from 'react';
import { CurrentWeather } from './components/CurrentWeather/CurrentWeather';
import { DailyForecast } from './components/DailyForecast/DailyForecast';
import { Favorites } from './components/Favorites/Favorites';
import { HourlyForecast } from './components/HourlyForecast/HourlyForecast';
import { SearchBar } from './components/SearchBar/SearchBar';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useWeather } from './hooks/useWeather';
import type {
  DesignTheme,
  Location,
  TemperatureUnit,
  WeatherMood,
} from './types/weather';
import { getWeatherCodeInfo } from './utils/weatherCode';

const DEFAULT_LOCATION: Location = {
  id: 616052,
  name: 'Ереван',
  country: 'Армения',
  latitude: 40.18111,
  longitude: 44.51361,
  timezone: 'Asia/Yerevan',
};

export default function App() {
  const [location, setLocation] = useState<Location>(DEFAULT_LOCATION);
  const [unit, setUnit] = useLocalStorage<TemperatureUnit>('atmos-unit', 'celsius');
  const [theme, setTheme] = useLocalStorage<DesignTheme>('atmos-theme', 'atmos');
  const [favorites, setFavorites] = useLocalStorage<Location[]>('atmos-favorites', []);
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const { data, loading, error, refetch } = useWeather(location, unit);

  const weatherMood: WeatherMood = data
    ? getWeatherCodeInfo(data.current.weatherCode, data.current.isDay).mood
    : 'cloudy';
  const isFavorite = favorites.some((favorite) => favorite.id === location.id);

  function selectLocation(nextLocation: Location) {
    setLocation(nextLocation);
    setLocationError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function toggleFavorite() {
    setFavorites((currentFavorites) => {
      const exists = currentFavorites.some((favorite) => favorite.id === location.id);
      if (exists) return currentFavorites.filter((favorite) => favorite.id !== location.id);

      return [...currentFavorites.slice(-4), location];
    });
  }

  function useCurrentLocation() {
    if (!navigator.geolocation) {
      setLocationError('Браузер не поддерживает определение местоположения.');
      return;
    }

    setLocating(true);
    setLocationError(null);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const latitude = Number(coords.latitude.toFixed(4));
        const longitude = Number(coords.longitude.toFixed(4));
        setLocation({
          id: `geo-${latitude}-${longitude}`,
          name: 'Моё местоположение',
          latitude,
          longitude,
        });
        setLocating(false);
      },
      () => {
        setLocationError('Не удалось определить местоположение. Проверьте разрешение браузера.');
        setLocating(false);
      },
      { enableHighAccuracy: false, timeout: 10_000, maximumAge: 300_000 },
    );
  }

  return (
    <div className="app-shell" data-theme={theme} data-mood={weatherMood}>
      <div className="weather-backdrop" aria-hidden="true">
        <span className="backdrop-orb" />
        <span className="backdrop-cloud cloud-one" />
        <span className="backdrop-cloud cloud-two" />
      </div>

      <header className="topbar">
        <a className="brand" href="#top" aria-label="Atmos, на главную">
          <span className="brand-mark" aria-hidden="true">A</span>
          <span>Atmos</span>
        </a>

        <SearchBar onSelect={selectLocation} />

        <div className="top-actions">
          <div className="unit-toggle" aria-label="Единицы температуры">
            <button
              className={unit === 'celsius' ? 'active' : ''}
              type="button"
              onClick={() => setUnit('celsius')}
              aria-pressed={unit === 'celsius'}
            >°C</button>
            <button
              className={unit === 'fahrenheit' ? 'active' : ''}
              type="button"
              onClick={() => setUnit('fahrenheit')}
              aria-pressed={unit === 'fahrenheit'}
            >°F</button>
          </div>
          <label className="theme-select">
            <span className="visually-hidden">Стиль оформления</span>
            <select value={theme} onChange={(event) => setTheme(event.target.value as DesignTheme)}>
              <option value="atmos">Светлый mood</option>
              <option value="gothic">Готический mood</option>
            </select>
            <span aria-hidden="true">⌄</span>
          </label>
        </div>
      </header>

      <main id="top">
        {locationError && (
          <div className="status-banner" role="alert">
            <span>{locationError}</span>
            <button type="button" onClick={() => setLocationError(null)} aria-label="Закрыть">×</button>
          </div>
        )}

        {error && data && (
          <div className="status-banner" role="alert">
            <span>Не удалось обновить прогноз.</span>
            <button type="button" onClick={refetch}>Повторить</button>
          </div>
        )}

        {loading && !data && <WeatherSkeleton />}

        {error && !data && !loading && (
          <section className="error-state" role="alert">
            <span aria-hidden="true">☂</span>
            <p className="section-kicker">Похоже, связь прервалась</p>
            <h1>Прогноз затерялся в облаках</h1>
            <p>{error}</p>
            <button type="button" onClick={refetch}>Попробовать снова</button>
          </section>
        )}

        {data && (
          <div className={loading ? 'weather-content is-refreshing' : 'weather-content'}>
            {loading && <span className="refresh-indicator">Обновляем прогноз…</span>}
            <CurrentWeather
              location={location}
              weather={data}
              isFavorite={isFavorite}
              locating={locating}
              onToggleFavorite={toggleFavorite}
              onUseLocation={useCurrentLocation}
            />
            <HourlyForecast hours={data.hourly} />
            <DailyForecast days={data.daily} />
          </div>
        )}

        <Favorites
          favorites={favorites}
          currentLocationId={location.id}
          onSelect={selectLocation}
        />
      </main>

      <footer>
        <p>Прогноз без лишнего шума.</p>
        <a href="https://open-meteo.com/" target="_blank" rel="noreferrer">Данные Open-Meteo ↗</a>
      </footer>
    </div>
  );
}

function WeatherSkeleton() {
  return (
    <section className="weather-skeleton" aria-label="Загружаем прогноз" aria-busy="true">
      <div>
        <span className="skeleton-line short" />
        <span className="skeleton-line title" />
        <span className="skeleton-line medium" />
      </div>
      <span className="skeleton-temperature" />
      <div className="skeleton-cards">
        {Array.from({ length: 4 }, (_, index) => <span key={index} />)}
      </div>
    </section>
  );
}
