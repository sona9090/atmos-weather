import type {
  Location,
  TemperatureUnit,
  WeatherData,
} from '../types/weather';

const FORECAST_API_URL = 'https://api.open-meteo.com/v1/forecast';
const GEOCODING_API_URL = 'https://geocoding-api.open-meteo.com/v1/search';

interface GeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  timezone?: string;
  country?: string;
  admin1?: string;
}

interface GeocodingResponse {
  results?: GeocodingResult[];
}

interface ForecastResponse {
  timezone: string;
  current_units: {
    temperature_2m: string;
    wind_speed_10m: string;
  };
  current: {
    time: string;
    temperature_2m: number;
    apparent_temperature: number;
    relative_humidity_2m: number;
    weather_code: number;
    pressure_msl: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
    is_day: number;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    weather_code: number[];
    precipitation_probability: number[];
  };
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    weather_code: number[];
    precipitation_probability_max: number[];
    sunrise: string[];
    sunset: string[];
  };
  reason?: string;
}

async function getJson<T>(url: URL, signal?: AbortSignal): Promise<T> {
  const response = await fetch(url, { signal });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null) as { reason?: string } | null;
    throw new Error(errorBody?.reason ?? 'Не удалось получить данные о погоде.');
  }

  return response.json() as Promise<T>;
}

export async function searchCities(query: string, signal?: AbortSignal): Promise<Location[]> {
  const trimmedQuery = query.trim();
  if (trimmedQuery.length < 2) return [];

  const url = new URL(GEOCODING_API_URL);
  url.search = new URLSearchParams({
    name: trimmedQuery,
    count: '6',
    language: 'ru',
    format: 'json',
  }).toString();

  const data = await getJson<GeocodingResponse>(url, signal);
  return (data.results ?? []).map((result) => ({
    id: result.id,
    name: result.name,
    country: result.country,
    admin1: result.admin1,
    latitude: result.latitude,
    longitude: result.longitude,
    timezone: result.timezone,
  }));
}

export async function fetchWeather(
  location: Location,
  unit: TemperatureUnit,
  signal?: AbortSignal,
): Promise<WeatherData> {
  const url = new URL(FORECAST_API_URL);
  url.search = new URLSearchParams({
    latitude: String(location.latitude),
    longitude: String(location.longitude),
    current: [
      'temperature_2m',
      'apparent_temperature',
      'relative_humidity_2m',
      'weather_code',
      'pressure_msl',
      'wind_speed_10m',
      'wind_direction_10m',
      'is_day',
    ].join(','),
    hourly: [
      'temperature_2m',
      'weather_code',
      'precipitation_probability',
    ].join(','),
    daily: [
      'temperature_2m_max',
      'temperature_2m_min',
      'weather_code',
      'precipitation_probability_max',
      'sunrise',
      'sunset',
    ].join(','),
    temperature_unit: unit,
    wind_speed_unit: unit === 'celsius' ? 'kmh' : 'mph',
    timezone: 'auto',
    forecast_days: '7',
  }).toString();

  const data = await getJson<ForecastResponse>(url, signal);
  const currentDay = data.current.time.slice(0, 10);
  const currentHour = data.current.time.slice(0, 13);

  return {
    timezone: data.timezone,
    temperatureUnit: data.current_units.temperature_2m,
    windSpeedUnit: data.current_units.wind_speed_10m,
    current: {
      time: data.current.time,
      temperature: data.current.temperature_2m,
      apparentTemperature: data.current.apparent_temperature,
      humidity: data.current.relative_humidity_2m,
      pressure: data.current.pressure_msl,
      windSpeed: data.current.wind_speed_10m,
      windDirection: data.current.wind_direction_10m,
      weatherCode: data.current.weather_code,
      isDay: data.current.is_day === 1,
    },
    hourly: data.hourly.time
      .map((time, index) => ({
        time,
        temperature: data.hourly.temperature_2m[index],
        weatherCode: data.hourly.weather_code[index],
        precipitationProbability: data.hourly.precipitation_probability[index],
      }))
      .filter((item) => item.time.startsWith(currentDay) && item.time.slice(0, 13) >= currentHour),
    daily: data.daily.time.map((date, index) => ({
      date,
      temperatureMax: data.daily.temperature_2m_max[index],
      temperatureMin: data.daily.temperature_2m_min[index],
      weatherCode: data.daily.weather_code[index],
      precipitationProbability: data.daily.precipitation_probability_max[index],
      sunrise: data.daily.sunrise[index],
      sunset: data.daily.sunset[index],
    })),
  };
}
