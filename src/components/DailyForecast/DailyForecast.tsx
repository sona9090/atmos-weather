import type { DailyWeatherData } from '../../types/weather';
import { getWeatherCodeInfo } from '../../utils/weatherCode';

interface DailyForecastProps {
  days: DailyWeatherData[];
}

function formatWeekday(dateString: string, index: number) {
  if (index === 0) return 'Сегодня';
  const date = new Date(`${dateString}T12:00:00`);
  const weekday = new Intl.DateTimeFormat('ru-RU', { weekday: 'long' }).format(date);
  return weekday.charAt(0).toUpperCase() + weekday.slice(1);
}

function formatDate(dateString: string) {
  const date = new Date(`${dateString}T12:00:00`);
  return new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'short' }).format(date);
}

export function DailyForecast({ days }: DailyForecastProps) {
  return (
    <section className="forecast-section daily-section" aria-labelledby="daily-title">
      <div className="section-heading">
        <div>
          <p className="section-kicker">Неделя впереди</p>
          <h2 id="daily-title">Прогноз на 7 дней</h2>
        </div>
        <span>Минимум / максимум</span>
      </div>

      <div className="daily-list">
        {days.map((day, index) => {
          const condition = getWeatherCodeInfo(day.weatherCode);
          return (
            <article className="day-row" key={day.date}>
              <div className="day-name">
                <strong>{formatWeekday(day.date, index)}</strong>
                <span>{formatDate(day.date)}</span>
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
