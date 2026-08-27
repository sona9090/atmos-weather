import type { TranslationSet } from '../../i18n/translations';
import type { CurrentWeatherData, Language, Location, WeatherData } from '../../types/weather';
import { getWeatherCodeInfo, getWindDirection } from '../../utils/weatherCode';

interface CurrentWeatherProps {
  location: Location;
  weather: WeatherData;
  language: Language;
  translations: TranslationSet['current'];
  isFavorite: boolean;
  locating: boolean;
  onToggleFavorite: () => void;
  onUseLocation: () => void;
}

function formatLocalDate(current: CurrentWeatherData, language: Language) {
  const date = new Date(`${current.time.slice(0, 10)}T12:00:00`);
  const formatted = new Intl.DateTimeFormat(language === 'ru' ? 'ru-RU' : 'en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(date);

  return `${formatted.charAt(0).toUpperCase()}${formatted.slice(1)} · ${current.time.slice(11, 16)}`;
}

export function CurrentWeather({
  location,
  weather,
  language,
  translations,
  isFavorite,
  locating,
  onToggleFavorite,
  onUseLocation,
}: CurrentWeatherProps) {
  const condition = getWeatherCodeInfo(weather.current.weatherCode, weather.current.isDay, language);
  const today = weather.daily[0];

  return (
    <>
      <section className="hero" aria-labelledby="location-title">
        <div className="hero-copy">
          <p className="eyebrow"><span>●</span>{formatLocalDate(weather.current, language)}</p>
          <div className="location-heading">
            <div>
              <h1 id="location-title">{location.name}</h1>
              <p className="country">{[location.admin1, location.country].filter(Boolean).join(', ')}</p>
            </div>
            <button
              className={isFavorite ? 'favorite-button active' : 'favorite-button'}
              type="button"
              onClick={onToggleFavorite}
              aria-label={isFavorite ? translations.favoriteRemove : translations.favoriteAdd}
              title={isFavorite ? translations.favoriteRemove : translations.favoriteAdd}
            >
              {isFavorite ? '★' : '☆'}
            </button>
          </div>
          <div className="condition-line">
            <span className="weather-symbol" aria-hidden="true">{condition.symbol}</span>
            <div>
              <strong>{condition.label}</strong>
              <span>{translations.feelsLike} {Math.round(weather.current.apparentTemperature)}°</span>
            </div>
          </div>
        </div>

        <div className="temperature" aria-label={`${translations.temperature} ${Math.round(weather.current.temperature)} ${translations.degrees}`}>
          <span>{Math.round(weather.current.temperature)}</span><sup>°</sup>
        </div>

        <p className="hero-note">{condition.note}</p>

        {today && (
          <div className="sun-orbit" aria-hidden="true">
            <span className="sun">✦</span>
            <span className="orbit-label sunrise">{today.sunrise.slice(11, 16)}</span>
            <span className="orbit-label sunset">{today.sunset.slice(11, 16)}</span>
          </div>
        )}
      </section>

      <section className="highlights" aria-label={translations.detailsAria}>
        <article className="highlight-card">
          <p>{translations.humidity}</p>
          <strong>{weather.current.humidity}%</strong>
          <span>{weather.current.humidity < 60 ? translations.comfortable : translations.elevated}</span>
        </article>
        <article className="highlight-card">
          <p>{translations.wind}</p>
          <strong>{Math.round(weather.current.windSpeed)} {weather.windSpeedUnit}</strong>
          <span>{getWindDirection(weather.current.windDirection, language)} · {Math.round(weather.current.windDirection)}°</span>
        </article>
        <article className="highlight-card">
          <p>{translations.pressure}</p>
          <strong>{Math.round(weather.current.pressure)} {language === 'ru' ? 'гПа' : 'hPa'}</strong>
          <span>{translations.seaLevel}</span>
        </article>
        <button className="location-button" type="button" onClick={onUseLocation} disabled={locating}>
          <span aria-hidden="true">{locating ? '…' : '⌖'}</span>
          <span>
            <strong>{locating ? translations.locating : translations.myLocation}</strong>
            <small>{translations.detectAutomatically}</small>
          </span>
        </button>
      </section>
    </>
  );
}
