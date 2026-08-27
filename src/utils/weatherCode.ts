import type { Language, WeatherMood } from '../types/weather';

interface WeatherCodeInfo {
  label: string;
  shortLabel: string;
  symbol: string;
  mood: WeatherMood;
  note: string;
}

const copy = {
  ru: {
    clearDay: 'Ясно',
    clearNight: 'Ясная ночь',
    mostlyClear: 'Преимущественно ясно',
    cloudy: 'Облачно',
    fog: 'Туман',
    rain: 'Дождь',
    drizzle: 'Морось',
    snow: 'Снег',
    storm: 'Гроза',
    variable: 'Переменная погода',
    variableShort: 'Переменно',
    clearDayNote: 'Ясный день — можно планировать прогулку.',
    clearNightNote: 'Спокойная ночь без облаков.',
    cloudyNote: 'Мягкий рассеянный свет и переменная облачность.',
    fogNote: 'Видимость снижена — будьте внимательнее в дороге.',
    rainNote: 'Зонт сегодня точно пригодится.',
    snowNote: 'Снежно и свежо — выбирайте обувь потеплее.',
    stormNote: 'Гроза рядом — лучше переждать её в помещении.',
    variableNote: 'Погода может меняться в течение дня.',
  },
  en: {
    clearDay: 'Clear',
    clearNight: 'Clear night',
    mostlyClear: 'Mostly clear',
    cloudy: 'Cloudy',
    fog: 'Fog',
    rain: 'Rain',
    drizzle: 'Drizzle',
    snow: 'Snow',
    storm: 'Thunderstorm',
    variable: 'Variable weather',
    variableShort: 'Variable',
    clearDayNote: 'A clear day — perfect for a walk.',
    clearNightNote: 'A calm, cloudless night.',
    cloudyNote: 'Soft diffused light with changing cloud cover.',
    fogNote: 'Visibility is reduced — take extra care on the road.',
    rainNote: 'An umbrella will definitely come in handy today.',
    snowNote: 'Fresh and snowy — choose warmer footwear.',
    stormNote: 'A storm is nearby — it is best to stay indoors.',
    variableNote: 'Conditions may change throughout the day.',
  },
} as const;

export function getWeatherCodeInfo(
  code: number,
  isDay = true,
  language: Language = 'ru',
): WeatherCodeInfo {
  const text = copy[language];

  if (code === 0) {
    return {
      label: isDay ? text.clearDay : text.clearNight,
      shortLabel: text.clearDay,
      symbol: isDay ? '☀' : '☾',
      mood: 'clear',
      note: isDay ? text.clearDayNote : text.clearNightNote,
    };
  }

  if (code <= 3) {
    return {
      label: code === 1 ? text.mostlyClear : text.cloudy,
      shortLabel: text.cloudy,
      symbol: code === 1 ? '◒' : '☁',
      mood: 'cloudy',
      note: text.cloudyNote,
    };
  }

  if (code === 45 || code === 48) {
    return { label: text.fog, shortLabel: text.fog, symbol: '≋', mood: 'fog', note: text.fogNote };
  }

  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) {
    return {
      label: code >= 61 ? text.rain : text.drizzle,
      shortLabel: text.rain,
      symbol: '☂',
      mood: 'rain',
      note: text.rainNote,
    };
  }

  if ((code >= 71 && code <= 77) || code === 85 || code === 86) {
    return { label: text.snow, shortLabel: text.snow, symbol: '✣', mood: 'snow', note: text.snowNote };
  }

  if (code >= 95) {
    return { label: text.storm, shortLabel: text.storm, symbol: 'ϟ', mood: 'storm', note: text.stormNote };
  }

  return {
    label: text.variable,
    shortLabel: text.variableShort,
    symbol: '◌',
    mood: 'cloudy',
    note: text.variableNote,
  };
}

export function getWindDirection(degrees: number, language: Language = 'ru'): string {
  const directions = language === 'ru'
    ? ['С', 'СВ', 'В', 'ЮВ', 'Ю', 'ЮЗ', 'З', 'СЗ']
    : ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return directions[Math.round(degrees / 45) % directions.length];
}
