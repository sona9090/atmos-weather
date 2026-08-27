import type { WeatherMood } from '../types/weather';

interface WeatherCodeInfo {
  label: string;
  shortLabel: string;
  symbol: string;
  mood: WeatherMood;
  note: string;
}

export function getWeatherCodeInfo(code: number, isDay = true): WeatherCodeInfo {
  if (code === 0) {
    return {
      label: isDay ? 'Ясно' : 'Ясная ночь',
      shortLabel: 'Ясно',
      symbol: isDay ? '☀' : '☾',
      mood: 'clear',
      note: isDay ? 'Ясный день — можно планировать прогулку.' : 'Спокойная ночь без облаков.',
    };
  }

  if (code <= 3) {
    return {
      label: code === 1 ? 'Преимущественно ясно' : 'Облачно',
      shortLabel: 'Облачно',
      symbol: code === 1 ? '◒' : '☁',
      mood: 'cloudy',
      note: 'Мягкий рассеянный свет и переменная облачность.',
    };
  }

  if (code === 45 || code === 48) {
    return {
      label: 'Туман',
      shortLabel: 'Туман',
      symbol: '≋',
      mood: 'fog',
      note: 'Видимость снижена — будьте внимательнее в дороге.',
    };
  }

  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) {
    return {
      label: code >= 61 ? 'Дождь' : 'Морось',
      shortLabel: 'Дождь',
      symbol: '☂',
      mood: 'rain',
      note: 'Зонт сегодня точно пригодится.',
    };
  }

  if ((code >= 71 && code <= 77) || code === 85 || code === 86) {
    return {
      label: 'Снег',
      shortLabel: 'Снег',
      symbol: '✣',
      mood: 'snow',
      note: 'Снежно и свежо — выбирайте обувь потеплее.',
    };
  }

  if (code >= 95) {
    return {
      label: 'Гроза',
      shortLabel: 'Гроза',
      symbol: 'ϟ',
      mood: 'storm',
      note: 'Гроза рядом — лучше переждать её в помещении.',
    };
  }

  return {
    label: 'Переменная погода',
    shortLabel: 'Переменно',
    symbol: '◌',
    mood: 'cloudy',
    note: 'Погода может меняться в течение дня.',
  };
}

export function getWindDirection(degrees: number): string {
  const directions = ['С', 'СВ', 'В', 'ЮВ', 'Ю', 'ЮЗ', 'З', 'СЗ'];
  return directions[Math.round(degrees / 45) % directions.length];
}
