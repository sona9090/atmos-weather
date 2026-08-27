import { useEffect, useState } from 'react';
import { CurrentWeather } from './components/CurrentWeather/CurrentWeather';
import { DailyForecast } from './components/DailyForecast/DailyForecast';
import { Favorites } from './components/Favorites/Favorites';
import { HourlyForecast } from './components/HourlyForecast/HourlyForecast';
import { SearchBar } from './components/SearchBar/SearchBar';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useWeather } from './hooks/useWeather';
import { translations } from './i18n/translations';
import type {
  DesignTheme,
  Language,
  Location,
  TemperatureUnit,
  WeatherMood,
} from './types/weather';
import { getWeatherCodeInfo } from './utils/weatherCode';

const YEREVAN_ID = 616052;

function getDefaultLocation(language: Language): Location {
  return {
    id: YEREVAN_ID,
    name: language === 'ru' ? 'Ереван' : 'Yerevan',
    country: language === 'ru' ? 'Армения' : 'Armenia',
    latitude: 40.18111,
    longitude: 44.51361,
    timezone: 'Asia/Yerevan',
  };
}

type StoredTheme = DesignTheme | 'atmos' | 'gothic';

export default function App() {
  const [language, setLanguage] = useLocalStorage<Language>('atmos-language', 'ru');
  const [location, setLocation] = useState<Location>(() => getDefaultLocation(language));
  const [unit, setUnit] = useLocalStorage<TemperatureUnit>('atmos-unit', 'celsius');
  const [storedTheme, setStoredTheme] = useLocalStorage<StoredTheme>('atmos-theme', 'gothic');
  const [favorites, setFavorites] = useLocalStorage<Location[]>('atmos-favorites', []);
  const [locating, setLocating] = useState(false);
  const [isThemeSelectOpen, setThemeSelectOpen] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const { data, loading, error, refetch } = useWeather(location, unit);

  const theme: DesignTheme = storedTheme === 'gothic'
    ? 'dark'
    : storedTheme === 'atmos'
      ? 'light'
      : storedTheme;
  const text = translations[language];
  const weatherMood: WeatherMood = data
    ? getWeatherCodeInfo(data.current.weatherCode, data.current.isDay, language).mood
    : 'cloudy';
  const isFavorite = favorites.some((favorite) => favorite.id === location.id);

  useEffect(() => {
    document.documentElement.lang = language;
    document.title = text.pageTitle;
    setLocation((currentLocation) => {
      if (currentLocation.id === YEREVAN_ID) return getDefaultLocation(language);
      if (typeof currentLocation.id === 'string' && currentLocation.id.startsWith('geo-')) {
        return { ...currentLocation, name: text.current.myLocation };
      }
      return currentLocation;
    });
  }, [language, text.current.myLocation, text.pageTitle]);

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
      setLocationError(text.geolocationUnsupported);
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
          name: text.current.myLocation,
          latitude,
          longitude,
        });
        setLocating(false);
      },
      () => {
        setLocationError(text.geolocationFailed);
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
        <a className="brand" href="#top" aria-label={text.brandAria}>
          <span className="brand-mark" aria-hidden="true">A</span>
          <span>Atmos</span>
        </a>

        <SearchBar language={language} translations={text.search} onSelect={selectLocation} />

        <div className="top-actions">
          <div className="language-toggle" role="group" aria-label={text.languageAria}>
            <button
              className={language === 'ru' ? 'active' : ''}
              type="button"
              onClick={() => setLanguage('ru')}
              aria-pressed={language === 'ru'}
            >RU</button>
            <button
              className={language === 'en' ? 'active' : ''}
              type="button"
              onClick={() => setLanguage('en')}
              aria-pressed={language === 'en'}
            >EN</button>
          </div>
          <div className="unit-toggle" role="group" aria-label={text.unitAria}>
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
          <label
            className="theme-select"
            onPointerDown={(event) => {
              if (event.button === 0) setThemeSelectOpen((isOpen) => !isOpen);
            }}
          >
            <span className="visually-hidden">{text.themeAria}</span>
            <select
              id="theme_select"
              value={theme}
              onBlur={() => setThemeSelectOpen(false)}
              onKeyDown={(event) => {
                if (['Enter', ' ', 'ArrowDown', 'ArrowUp'].includes(event.key)) setThemeSelectOpen(true);
                if (['Escape', 'Tab'].includes(event.key)) setThemeSelectOpen(false);
              }}
              onChange={(event) => {
                setStoredTheme(event.target.value as DesignTheme);
                setThemeSelectOpen(false);
              }}
            >
              <option value="light">{text.lightTheme}</option>
              <option value="dark">{text.darkTheme}</option>
            </select>
            <span
              aria-hidden="true"
              className={`theme-select-arrow${isThemeSelectOpen ? ' is-open' : ''}`}
            />
          </label>
        </div>
      </header>

      <main id="top">
        {locationError && (
          <div className="status-banner" role="alert">
            <span>{locationError}</span>
            <button type="button" onClick={() => setLocationError(null)} aria-label={text.close}>×</button>
          </div>
        )}

        {error && data && (
          <div className="status-banner" role="alert">
            <span>{text.updateError}</span>
            <button type="button" onClick={refetch}>{text.retry}</button>
          </div>
        )}

        {loading && !data && <WeatherSkeleton label={text.loadingForecast} />}

        {error && !data && !loading && (
          <section className="error-state" role="alert">
            <span aria-hidden="true">☂</span>
            <p className="section-kicker">{text.connectionKicker}</p>
            <h1>{text.connectionTitle}</h1>
            <p>{text.defaultError}</p>
            <button type="button" onClick={refetch}>{text.retry}</button>
          </section>
        )}

        {data && (
          <div className={loading ? 'weather-content is-refreshing' : 'weather-content'}>
            {loading && <span className="refresh-indicator">{text.updating}</span>}
            <CurrentWeather
              location={location}
              weather={data}
              language={language}
              translations={text.current}
              isFavorite={isFavorite}
              locating={locating}
              onToggleFavorite={toggleFavorite}
              onUseLocation={useCurrentLocation}
            />
            <HourlyForecast hours={data.hourly} language={language} translations={text.hourly} />
            <DailyForecast days={data.daily} language={language} translations={text.daily} />
          </div>
        )}

        <Favorites
          favorites={favorites}
          currentLocationId={location.id}
          translations={text.favorites}
          onSelect={selectLocation}
        />
      </main>

      <footer>
        <p>{text.footerTagline}</p>
        <a href="https://open-meteo.com/" target="_blank" rel="noreferrer">{text.dataSource}</a>
      </footer>
    </div>
  );
}

function WeatherSkeleton({ label }: { label: string }) {
  return (
    <section className="weather-skeleton" aria-label={label} aria-busy="true">
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
