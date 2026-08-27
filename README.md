# Atmos

A focused weather application built with React, TypeScript, and Vite. Forecast and location data come from the free Open-Meteo Forecast and Geocoding APIs, so no API key is required.

## Features

- City search with autocomplete
- Current conditions, an hourly forecast, and a 7-day forecast
- Browser geolocation
- Celsius and Fahrenheit units
- Up to five favorite cities stored in `localStorage`
- Russian and English interface languages
- Light and dark visual themes
- Loading, error, and empty states
- Responsive and accessible layout

## Getting started

Install the dependencies and start the development server:

```bash
pnpm install
pnpm dev
```

Create a production build:

```bash
pnpm build
```

## Project structure

```text
src/
├── components/
│   ├── SearchBar/
│   ├── CurrentWeather/
│   ├── HourlyForecast/
│   ├── DailyForecast/
│   └── Favorites/
├── hooks/
│   ├── useWeather.ts
│   └── useLocalStorage.ts
├── i18n/
│   └── translations.ts
├── services/
│   └── weatherApi.ts
├── types/
│   └── weather.ts
├── utils/
│   └── weatherCode.ts
├── App.tsx
└── main.tsx
```

UI sections are kept in `src/components`. API requests live in `src/services`, reusable state logic lives in `src/hooks`, translations are centralized in `src/i18n`, and shared weather types and WMO code mapping live in `src/types` and `src/utils`.

## Data source

- [Open-Meteo Weather Forecast API](https://open-meteo.com/en/docs)
- [Open-Meteo Geocoding API](https://open-meteo.com/en/docs/geocoding-api)
