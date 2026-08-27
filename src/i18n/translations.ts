import type { Language } from '../types/weather';

export interface TranslationSet {
  pageTitle: string;
  brandAria: string;
  unitAria: string;
  themeAria: string;
  lightTheme: string;
  darkTheme: string;
  languageAria: string;
  updating: string;
  updateError: string;
  retry: string;
  connectionKicker: string;
  connectionTitle: string;
  defaultError: string;
  loadingForecast: string;
  footerTagline: string;
  dataSource: string;
  close: string;
  geolocationUnsupported: string;
  geolocationFailed: string;
  search: {
    label: string;
    placeholder: string;
    loading: string;
    notFound: string;
    notFoundHint: string;
  };
  current: {
    favoriteAdd: string;
    favoriteRemove: string;
    temperature: string;
    degrees: string;
    detailsAria: string;
    feelsLike: string;
    humidity: string;
    comfortable: string;
    elevated: string;
    wind: string;
    pressure: string;
    seaLevel: string;
    myLocation: string;
    locating: string;
    detectAutomatically: string;
  };
  hourly: {
    kicker: string;
    title: string;
    legend: string;
    empty: string;
    now: string;
  };
  daily: {
    kicker: string;
    title: string;
    legend: string;
    today: string;
  };
  favorites: {
    kicker: string;
    title: string;
    emptyTitle: string;
    emptyHint: string;
  };
}

export const translations: Record<Language, TranslationSet> = {
  ru: {
    pageTitle: 'Atmos — погода в нужном настроении',
    brandAria: 'Atmos, на главную',
    unitAria: 'Единицы температуры',
    themeAria: 'Стиль оформления',
    lightTheme: 'Светлый',
    darkTheme: 'Тёмный',
    languageAria: 'Язык интерфейса',
    updating: 'Обновляем прогноз…',
    updateError: 'Не удалось обновить прогноз.',
    retry: 'Повторить',
    connectionKicker: 'Похоже, связь прервалась',
    connectionTitle: 'Прогноз затерялся в облаках',
    defaultError: 'Что-то пошло не так. Попробуйте ещё раз.',
    loadingForecast: 'Загружаем прогноз',
    footerTagline: 'Прогноз без лишнего шума.',
    dataSource: 'Данные Open-Meteo ↗',
    close: 'Закрыть',
    geolocationUnsupported: 'Браузер не поддерживает определение местоположения.',
    geolocationFailed: 'Не удалось определить местоположение. Проверьте разрешение браузера.',
    search: {
      label: 'Найти город',
      placeholder: 'Найти город…',
      loading: 'Ищем города',
      notFound: 'Город не найден',
      notFoundHint: 'Проверьте название или попробуйте другой вариант.',
    },
    current: {
      favoriteAdd: 'Добавить город в избранное',
      favoriteRemove: 'Удалить город из избранного',
      temperature: 'Температура',
      degrees: 'градусов',
      detailsAria: 'Подробности погоды',
      feelsLike: 'Ощущается как',
      humidity: 'Влажность',
      comfortable: 'Комфортный уровень',
      elevated: 'Повышенная',
      wind: 'Ветер',
      pressure: 'Давление',
      seaLevel: 'На уровне моря',
      myLocation: 'Моё местоположение',
      locating: 'Определяем…',
      detectAutomatically: 'Определить автоматически',
    },
    hourly: {
      kicker: 'Ближайшие часы',
      title: 'Сегодня по часам',
      legend: 'Осадки · температура',
      empty: 'Почасовой прогноз на сегодня завершён.',
      now: 'Сейчас',
    },
    daily: {
      kicker: 'Неделя впереди',
      title: 'Прогноз на 7 дней',
      legend: 'Минимум / максимум',
      today: 'Сегодня',
    },
    favorites: {
      kicker: 'Сохранённые места',
      title: 'Избранное',
      emptyTitle: 'Здесь пока пусто',
      emptyHint: 'Нажмите звезду рядом с названием города, чтобы сохранить его.',
    },
  },
  en: {
    pageTitle: 'Atmos — weather in the right mood',
    brandAria: 'Atmos, home',
    unitAria: 'Temperature units',
    themeAria: 'Color theme',
    lightTheme: 'Light',
    darkTheme: 'Dark',
    languageAria: 'Interface language',
    updating: 'Updating forecast…',
    updateError: 'Could not update the forecast.',
    retry: 'Try again',
    connectionKicker: 'Looks like the connection dropped',
    connectionTitle: 'The forecast got lost in the clouds',
    defaultError: 'Something went wrong. Please try again.',
    loadingForecast: 'Loading forecast',
    footerTagline: 'Weather without the noise.',
    dataSource: 'Data by Open-Meteo ↗',
    close: 'Close',
    geolocationUnsupported: 'Your browser does not support geolocation.',
    geolocationFailed: 'Could not detect your location. Check your browser permission.',
    search: {
      label: 'Find a city',
      placeholder: 'Find a city…',
      loading: 'Searching for cities',
      notFound: 'City not found',
      notFoundHint: 'Check the spelling or try another query.',
    },
    current: {
      favoriteAdd: 'Add city to favorites',
      favoriteRemove: 'Remove city from favorites',
      temperature: 'Temperature',
      degrees: 'degrees',
      detailsAria: 'Weather details',
      feelsLike: 'Feels like',
      humidity: 'Humidity',
      comfortable: 'Comfortable level',
      elevated: 'Elevated',
      wind: 'Wind',
      pressure: 'Pressure',
      seaLevel: 'At sea level',
      myLocation: 'My location',
      locating: 'Locating…',
      detectAutomatically: 'Detect automatically',
    },
    hourly: {
      kicker: 'The next few hours',
      title: 'Today by hour',
      legend: 'Precipitation · temperature',
      empty: "Today's hourly forecast is complete.",
      now: 'Now',
    },
    daily: {
      kicker: 'The week ahead',
      title: '7-day forecast',
      legend: 'Minimum / maximum',
      today: 'Today',
    },
    favorites: {
      kicker: 'Saved places',
      title: 'Favorites',
      emptyTitle: 'Nothing here yet',
      emptyHint: 'Select the star next to a city name to save it.',
    },
  },
};
