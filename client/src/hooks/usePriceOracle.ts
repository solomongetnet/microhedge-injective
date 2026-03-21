import { useReadContract } from 'wagmi';
import { PRICE_ORACLE_ADDRESS, priceOracleAbi } from '@/lib/contracts';
import { formatEther } from 'viem';
import { COMMODITIES } from '@/utils/commodities';

export interface Commodity {
  symbol: string;
  name: string;
  price: number;
}

export function usePriceOracle() {
  const { data, isLoading, isError, refetch } = useReadContract({
    address: PRICE_ORACLE_ADDRESS,
    abi: priceOracleAbi,
    functionName: 'getAllCommodityData',
  });

  let commodities: Commodity[] = [...COMMODITIES];

  if (data) {
    const rawData = data as { name: string; price: bigint }[];
    commodities = commodities.map(c => {
      const oracleItem = rawData.find(
        (o) => o.name.toLowerCase() === c.symbol.toLowerCase() || o.name.toLowerCase() === c.name.toLowerCase()
      );
      
      return {
        ...c,
        price: oracleItem ? parseFloat(formatEther(oracleItem.price)) : 0,
      };
    });
  }

  return {
    commodities,
    isLoading,
    isError,
    refetch,
  };
}
