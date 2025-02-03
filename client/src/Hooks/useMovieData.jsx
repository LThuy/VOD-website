// src/hooks/useMovieData.js
import { useState, useEffect, useCallback } from 'react';
import fetchingApiData from '../Ultil/FetchingData/FetchingApi';

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache

const useMovieData = () => {
  const [movieData, setMovieData] = useState({
    phimmoiCN: [],
    phimLe: [],
    phimBo: [],
    phimHH: [],
    tvShows: [],
    slider: []
  });
  const [isLoading, setIsLoading] = useState(true)

  const updateState = useCallback((data, key) => {
    if (data && (data.items || (data.data && data.data.items))) {
      const items = data.items || data.data.items;
      setMovieData(prev => ({ ...prev, [key]: items }));
      if (key === 'phimmoiCN' && items.length > 0) {
        setMovieData(prev => ({ ...prev, slider: items.slice(0, 4) }));
      }
    }
  }, []);

  useEffect(() => {
    setIsLoading(true)
    const fetchData = async () => {
      const endpoints = [
        // { url: 'https://phimapi.com/danh-sach/phim-moi-cap-nhat?limit=12', key: 'phimmoiCN' },
        { url: '${process.env.REACT_APP_SERVER_BASE_URL}/film/list/new', key: 'phimmoiCN' },
        { url: 'https://phimapi.com/v1/api/danh-sach/phim-le?limit=12', key: 'phimLe' },
        { url: 'https://phimapi.com/v1/api/danh-sach/phim-bo?limit=12', key: 'phimBo' },
        { url: 'https://phimapi.com/v1/api/danh-sach/hoat-hinh?limit=12', key: 'phimHH' },
        { url: 'https://phimapi.com/v1/api/danh-sach/tv-shows?limit=12', key: 'tvShows' }
      ];

      try {
        const results = await fetchingApiData(endpoints.map(e => e.url), 10000, 2); // 10s timeout, 2 retries
        results.forEach((data, index) => {
          updateState(data, endpoints[index].key);
        });
      } catch (error) {
        console.error('Error fetching movie data:', error);
      }
      finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [updateState]);

  return {movieData,isLoading};
};

export default useMovieData;