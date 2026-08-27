import type { TranslationSet } from '../../i18n/translations';
import type { HourlyWeatherData, Language } from '../../types/weather';
import { getWeatherCodeInfo } from '../../utils/weatherCode';

interface HourlyForecastProps {
  hours: HourlyWeatherData[];
  language: Language;
  translations: TranslationSet['hourly'];
}

export function HourlyForecast({ hours, language, translations }: HourlyForecastProps) {
  return (
    <section className="forecast-section" aria-labelledby="hourly-title">
      <div className="section-heading">
        <div>
          <p className="section-kicker">{translations.kicker}</p>
          <h2 id="hourly-title">{translations.title}</h2>
        </div>
        <span>{translations.legend}</span>
      </div>

      {hours.length === 0 ? (
        <div className="inline-empty">{translations.empty}</div>
      ) : (
        <div className="hourly-list">
          {hours.map((hour, index) => {
            const condition = getWeatherCodeInfo(hour.weatherCode, true, language);
            return (
              <article className={index === 0 ? 'hour-card now' : 'hour-card'} key={hour.time}>
                <time>{index === 0 ? translations.now : hour.time.slice(11, 16)}</time>
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
