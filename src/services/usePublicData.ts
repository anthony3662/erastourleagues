import { Concert } from '../models/concert';
import { Outfit } from '../models/outfit';
import { SurpriseSong } from '../models/surpriseSong';
import { createContext } from '../utils/createContext';
import { useRequest } from '../utils/useRequest';
import { AllPublicResponse, ConcertsResponse, ENDPOINTS } from '../constants/endpoints';
import { useEffect, useState } from 'react';
import { Leaderboard } from '../models/leaderboard';

type PublicDataContext = {
  initialize: () => Promise<void>;
  concerts: Concert[] | null;
  currentConcert: Concert | null;
  outfits: Outfit[] | null;
  surpriseSongs: SurpriseSong[] | null;
  leaderboards: Leaderboard[] | null;
  isLoading: boolean;
  transactionsLocked: boolean; // cannot set lineup or trade when concert ongoing
};

const [usePublicData, PublicDataProvider, publicDataContext] = createContext<PublicDataContext>(() => {
  const { get: fetchData, isLoading: isLoading, data } = useRequest<AllPublicResponse>();

  // need to poll this endpoint every 3 minutes
  const { get: fetchConcerts, data: concertsData } = useRequest<ConcertsResponse>();

  const [intervalId, setIntervalId] = useState<NodeJS.Timer | undefined>();
  const [lastFetchedIncreasingId, setLastFetchedIncreasingId] = useState<number | null>(null);

  const initialize = async () => {
    fetchData(ENDPOINTS.allPublic);
  };

  const startPolling = () => {
    // production timer interval is 3 minutes
    setIntervalId(setInterval(() => fetchConcerts(ENDPOINTS.concerts), 3 * 60 * 1000));
  };

  const stopPolling = () => {
    if (intervalId) {
      clearInterval(intervalId);
    }
    setIntervalId(undefined);
    window.location.reload();
  };

  useEffect(() => {
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    if (!data?.currentConcert?.startTime) {
      return;
    }
    if (Date.now() >= Number(data.currentConcert.startTime)) {
      startPolling();
    } else {
      const eventStartsIn = Number(data.currentConcert.startTime) - Date.now();
      setTimeout(startPolling, eventStartsIn);
    }
  }, [data]);

  useEffect(() => {
    if (!concertsData?.currentConcert?.endTime) {
      return;
    }
    const eventEndsIn = Number(concertsData.currentConcert.endTime) - Date.now();
    if (eventEndsIn) {
      setTimeout(stopPolling, eventEndsIn);
    } else {
      stopPolling();
    }
  }, [concertsData]);

  useEffect(() => {
    if (lastFetchedIncreasingId && concertsData?.currentConcert?.increasingId !== lastFetchedIncreasingId) {
      stopPolling();
    }
    setLastFetchedIncreasingId(concertsData?.currentConcert?.increasingId || null);
  }, [concertsData]);

  if (!data) {
    return {
      initialize,
      transactionsLocked: false,
      concerts: null,
      currentConcert: null,
      outfits: null,
      surpriseSongs: null,
      leaderboards: null,
      isLoading,
    };
  }

  return {
    transactionsLocked: Boolean(intervalId),
    initialize,
    isLoading,
    ...data,
    ...(concertsData || {}),
  };
});

export { usePublicData, PublicDataProvider, publicDataContext };
export type { PublicDataContext };
