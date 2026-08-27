import { useEffect, useRef, useState } from 'react';
import type { TranslationSet } from '../../i18n/translations';
import { searchCities } from '../../services/weatherApi';
import type { Language, Location } from '../../types/weather';

interface SearchBarProps {
  language: Language;
  translations: TranslationSet['search'];
  onSelect: (location: Location) => void;
}

export function SearchBar({ language, translations, onSelect }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [hasSearched, setHasSearched] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function focusSearch(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        inputRef.current?.focus();
      }
    }

    function closeOnOutsideClick(event: MouseEvent) {
      if (!searchRef.current?.contains(event.target as Node)) setIsOpen(false);
    }

    document.addEventListener('keydown', focusSearch);
    document.addEventListener('mousedown', closeOnOutsideClick);
    return () => {
      document.removeEventListener('keydown', focusSearch);
      document.removeEventListener('mousedown', closeOnOutsideClick);
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const trimmedQuery = query.trim();

    if (trimmedQuery.length < 2) {
      setResults([]);
      setHasSearched(false);
      setLoading(false);
      return () => controller.abort();
    }

    setLoading(true);
    const timeoutId = window.setTimeout(async () => {
      try {
        const cities = await searchCities(trimmedQuery, language, controller.signal);
        setResults(cities);
        setHasSearched(true);
        setActiveIndex(-1);
        setIsOpen(true);
      } catch (error) {
        if (!(error instanceof DOMException && error.name === 'AbortError')) {
          setResults([]);
          setHasSearched(true);
          setIsOpen(true);
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 320);

    return () => {
      controller.abort();
      window.clearTimeout(timeoutId);
    };
  }, [language, query]);

  function selectLocation(location: Location) {
    onSelect(location);
    setQuery('');
    setResults([]);
    setIsOpen(false);
    inputRef.current?.blur();
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (!isOpen || results.length === 0) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((index) => Math.min(index + 1, results.length - 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, 0));
    } else if (event.key === 'Enter') {
      event.preventDefault();
      selectLocation(results[activeIndex >= 0 ? activeIndex : 0]);
    } else if (event.key === 'Escape') {
      setIsOpen(false);
    }
  }

  return (
    <div className="search-wrap" ref={searchRef}>
      <div className="search" role="search">
        <span className="search-icon" aria-hidden="true">⌕</span>
        <input
          ref={inputRef}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onFocus={() => query.trim().length >= 2 && setIsOpen(true)}
          onKeyDown={handleKeyDown}
          aria-label={translations.label}
          aria-controls="city-results"
          aria-expanded={isOpen}
          aria-autocomplete="list"
          placeholder={translations.placeholder}
        />
        {loading ? <span className="mini-loader" aria-label={translations.loading} /> : <kbd>⌘ K</kbd>}
      </div>

      {isOpen && (
        <div className="search-results" id="city-results" role="listbox">
          {results.map((location, index) => (
            <button
              className={index === activeIndex ? 'search-result active' : 'search-result'}
              key={location.id}
              type="button"
              role="option"
              aria-selected={index === activeIndex}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => selectLocation(location)}
            >
              <span>
                <strong>{location.name}</strong>
                <small>{[location.admin1, location.country].filter(Boolean).join(', ')}</small>
              </span>
              <span aria-hidden="true">↗</span>
            </button>
          ))}

          {hasSearched && !loading && results.length === 0 && (
            <div className="search-empty">
              <span aria-hidden="true">◌</span>
              <strong>{translations.notFound}</strong>
              <small>{translations.notFoundHint}</small>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
