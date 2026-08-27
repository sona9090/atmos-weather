import type { TranslationSet } from '../../i18n/translations';
import type { DailyWeatherData, Language } from '../../types/weather';
import { getWeatherCodeInfo } from '../../utils/weatherCode';

interface DailyForecastProps {
  days: DailyWeatherData[];
  language: Language;
  translations: TranslationSet['daily'];
}

function formatWeekday(
  dateString: string,
  index: number,
  language: Language,
  todayLabel: string,
) {
  if (index === 0) return todayLabel;
  const date = new Date(`${dateString}T12:00:00`);
  const weekday = new Intl.DateTimeFormat(language === 'ru' ? 'ru-RU' : 'en-US', { weekday: 'long' }).format(date);
  return weekday.charAt(0).toUpperCase() + weekday.slice(1);
}

function formatDate(dateString: string, language: Language) {
  const date = new Date(`${dateString}T12:00:00`);
  return new Intl.DateTimeFormat(language === 'ru' ? 'ru-RU' : 'en-US', { day: 'numeric', month: 'short' }).format(date);
}

export function DailyForecast({ days, language, translations }: DailyForecastProps) {
  return (
    <section className="forecast-section daily-section" aria-labelledby="daily-title">
      <div className="section-heading">
        <div>
          <p className="section-kicker">{translations.kicker}</p>
          <h2 id="daily-title">{translations.title}</h2>
        </div>
        <span>{translations.legend}</span>
      </div>

      <div className="daily-list">
        {days.map((day, index) => {
          const condition = getWeatherCodeInfo(day.weatherCode, true, language);
          return (
            <article className="day-row" key={day.date}>
              <div className="day-name">
                <strong>{formatWeekday(day.date, index, language, translations.today)}</strong>
                <span>{formatDate(day.date, language)}</span>
              </div>
              <div className="day-condition">
                <span className="forecast-symbol" aria-hidden="true">{condition.symbol}</span>
                <span>{condition.shortLabel}</span>
              </div>
              <span className="day-rain">⌁ {day.precipitationProbability}%</span>
              <div className="day-temperature">
                <span>{Math.round(day.temperatureMin)}°</span>
                <div className="temperature-range" aria-hidden="true"><i /></div>
                <strong>{Math.round(day.temperatureMax)}°</strong>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
