import type { CurrentWeatherData, Location, WeatherData } from '../../types/weather';
import { getWeatherCodeInfo, getWindDirection } from '../../utils/weatherCode';

interface CurrentWeatherProps {
  location: Location;
  weather: WeatherData;
  isFavorite: boolean;
  locating: boolean;
  onToggleFavorite: () => void;
  onUseLocation: () => void;
}

function formatLocalDate(current: CurrentWeatherData) {
  const date = new Date(`${current.time.slice(0, 10)}T12:00:00`);
  const formatted = new Intl.DateTimeFormat('ru-RU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(date);

  return `${formatted.charAt(0).toUpperCase()}${formatted.slice(1)} · ${current.time.slice(11, 16)}`;
}

export function CurrentWeather({
  location,
  weather,
  isFavorite,
  locating,
  onToggleFavorite,
  onUseLocation,
}: CurrentWeatherProps) {
  const condition = getWeatherCodeInfo(weather.current.weatherCode, weather.current.isDay);
  const today = weather.daily[0];

  return (
    <>
      <section className="hero" aria-labelledby="location-title">
        <div className="hero-copy">
          <p className="eyebrow"><span>●</span>{formatLocalDate(weather.current)}</p>
          <div className="location-heading">
            <div>
              <h1 id="location-title">{location.name}</h1>
              <p className="country">{[location.admin1, location.country].filter(Boolean).join(', ')}</p>
            </div>
            <button
              className={isFavorite ? 'favorite-button active' : 'favorite-button'}
              type="button"
              onClick={onToggleFavorite}
              aria-label={isFavorite ? 'Удалить город из избранного' : 'Добавить город в избранное'}
              title={isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}
            >
              {isFavorite ? '★' : '☆'}
            </button>
          </div>
          <div className="condition-line">
            <span className="weather-symbol" aria-hidden="true">{condition.symbol}</span>
            <div>
              <strong>{condition.label}</strong>
              <span>Ощущается как {Math.round(weather.current.apparentTemperature)}°</span>
            </div>
          </div>
        </div>

        <div className="temperature" aria-label={`Температура ${Math.round(weather.current.temperature)} градусов`}>
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

      <section className="highlights" aria-label="Подробности погоды">
        <article className="highlight-card">
          <p>Влажность</p>
          <strong>{weather.current.humidity}%</strong>
          <span>{weather.current.humidity < 60 ? 'Комфортный уровень' : 'Повышенная'}</span>
        </article>
        <article className="highlight-card">
          <p>Ветер</p>
          <strong>{Math.round(weather.current.windSpeed)} {weather.windSpeedUnit}</strong>
          <span>{getWindDirection(weather.current.windDirection)} · {Math.round(weather.current.windDirection)}°</span>
        </article>
        <article className="highlight-card">
          <p>Давление</p>
          <strong>{Math.round(weather.current.pressure)} гПа</strong>
          <span>На уровне моря</span>
        </article>
        <button className="location-button" type="button" onClick={onUseLocation} disabled={locating}>
          <span aria-hidden="true">{locating ? '…' : '⌖'}</span>
          <span>
            <strong>{locating ? 'Определяем…' : 'Моё местоположение'}</strong>
            <small>Определить автоматически</small>
          </span>
        </button>
      </section>
    </>
  );
}
