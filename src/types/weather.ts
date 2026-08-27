export type TemperatureUnit = 'celsius' | 'fahrenheit';

export type DesignTheme = 'atmos' | 'gothic';

export type WeatherMood =
  | 'clear'
  | 'cloudy'
  | 'fog'
  | 'rain'
  | 'snow'
  | 'storm';

export interface Location {
  id: number | string;
  name: string;
  country?: string;
  admin1?: string;
  latitude: number;
  longitude: number;
  timezone?: string;
}

export interface CurrentWeatherData {
  time: string;
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  windDirection: number;
  weatherCode: number;
  isDay: boolean;
}

export interface HourlyWeatherData {
  time: string;
  temperature: number;
  weatherCode: number;
  precipitationProbability: number;
}

export interface DailyWeatherData {
  date: string;
  temperatureMax: number;
  temperatureMin: number;
  weatherCode: number;
  precipitationProbability: number;
  sunrise: string;
  sunset: string;
}

export interface WeatherData {
  current: CurrentWeatherData;
  hourly: HourlyWeatherData[];
  daily: DailyWeatherData[];
  timezone: string;
  temperatureUnit: string;
  windSpeedUnit: string;
}
