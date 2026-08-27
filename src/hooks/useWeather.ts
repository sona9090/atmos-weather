import { useCallback, useEffect, useState } from 'react';
import { fetchWeather } from '../services/weatherApi';
import type { Location, TemperatureUnit, WeatherData } from '../types/weather';

export function useWeather(location: Location, unit: TemperatureUnit) {
  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requestVersion, setRequestVersion] = useState(0);

  const refetch = useCallback(() => {
    setRequestVersion((version) => version + 1);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function loadWeather() {
      setLoading(true);
      setError(null);

      try {
        const weather = await fetchWeather(location, unit, controller.signal);
        setData(weather);
      } catch (requestError) {
        if (requestError instanceof DOMException && requestError.name === 'AbortError') return;
        setError(requestError instanceof Error
          ? requestError.message
          : 'Что-то пошло не так. Попробуйте ещё раз.');
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    void loadWeather();
    return () => controller.abort();
  }, [location, requestVersion, unit]);

  return { data, loading, error, refetch };
}
