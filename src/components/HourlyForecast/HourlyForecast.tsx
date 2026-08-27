import type { HourlyWeatherData } from '../../types/weather';
import { getWeatherCodeInfo } from '../../utils/weatherCode';

interface HourlyForecastProps {
  hours: HourlyWeatherData[];
}

export function HourlyForecast({ hours }: HourlyForecastProps) {
  return (
    <section className="forecast-section" aria-labelledby="hourly-title">
      <div className="section-heading">
        <div>
          <p className="section-kicker">Ближайшие часы</p>
          <h2 id="hourly-title">Сегодня по часам</h2>
        </div>
        <span>Осадки · температура</span>
      </div>

      {hours.length === 0 ? (
        <div className="inline-empty">Почасовой прогноз на сегодня завершён.</div>
      ) : (
        <div className="hourly-list">
          {hours.map((hour, index) => {
            const condition = getWeatherCodeInfo(hour.weatherCode);
            return (
              <article className={index === 0 ? 'hour-card now' : 'hour-card'} key={hour.time}>
                <time>{index === 0 ? 'Сейчас' : hour.time.slice(11, 16)}</time>
                <span className="forecast-symbol" aria-label={condition.shortLabel}>{condition.symbol}</span>
                <strong>{Math.round(hour.temperature)}°</strong>
                <span className="rain-chance">⌁ {hour.precipitationProbability}%</span>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
