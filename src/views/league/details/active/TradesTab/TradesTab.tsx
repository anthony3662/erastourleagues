import * as React from 'react';
import { useEffect, useState } from 'react';
import { useGameboardContext } from '../useGameboardContext';
import { TradesList } from './TradesList';
import { MakeOffer } from './MakeOffer';
import { useRequest } from '../../../../../utils/useRequest';
import { ENDPOINTS, GetTradesParams, GetTradesResponse } from '../../../../../constants/endpoints';

export const TradesTab: React.FC = () => {
  const { league } = useGameboardContext();
  const [offeringTo, setOfferingTo] = useState<string | null>(null);

  const { post: fetchTrades, data: tradesList } = useRequest<GetTradesResponse, GetTradesParams>();

  const handleFetch = async () => {
    const response = await fetchTrades({
      endpoint: ENDPOINTS.trades,
      body: { leagueId: league!._id },
    });
  };

  useEffect(() => {
    handleFetch();
  }, []);

  return (
    <>
      {!offeringTo ? (
        <TradesList refetch={handleFetch} trades={tradesList?.trades} setOfferingTo={n => setOfferingTo(n)} />
      ) : (
        <MakeOffer recipient={offeringTo} onBack={() => setOfferingTo(null)} refetchList={handleFetch} />
      )}
    </>
  );
};
