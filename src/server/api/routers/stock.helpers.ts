import type { DailyPriceRecord } from "@prisma/client";

export function getAveragePricePerMonth(stockPrices: DailyPriceRecord[]): {
  [key: string]: number;
} {
  const result: { [key: string]: number } = {};
  const totalPrices: { [key: string]: number } = {};
  const counts: { [key: string]: number } = {};

  for (const {
    highestPriceOfTheDay,
    lowestPriceOfTheDay,
    timestamp,
  } of stockPrices) {
    const date = new Date(timestamp);
    const month = date.toLocaleString("en-US", { month: "long" });

    if (!totalPrices[month]) {
      totalPrices[month] = 0;
      counts[month] = 0;
    }

    const averagePrice = (highestPriceOfTheDay + lowestPriceOfTheDay) / 2;

    totalPrices[month] += averagePrice;
    counts[month]++;
  }

  for (const [month, total] of Object.entries(totalPrices)) {
    const daysCount = counts[month];
    if (daysCount !== undefined) {
      result[month] = total / daysCount;
    }
  }

  return result;
}

export function getBestTimeToBuyAndSellByStockForMaxProfit(
  stockPrices: DailyPriceRecord[]
) {
  const result = {
    buy: {
      date: 0,
      price: 0,
    },
    sell: {
      date: 0,
      price: 0,
    },
  };

  if (!stockPrices.length) {
    return result;
  }

  const state = {
    maxProfit: 0,
  };

  //TODO: Optimize, remove nested loops - O(n^2) -> O(n)

  for (let i = 0; i < stockPrices.length; i++) {
    const parentRecord = stockPrices[i];
    for (let j = i; j < stockPrices.length; j++) {
      const childRecord = stockPrices[j];
      if (parentRecord && childRecord) {
        if (
          parentRecord.lowestPriceOfTheDay < childRecord.highestPriceOfTheDay
        ) {
          const profit =
            childRecord.highestPriceOfTheDay - parentRecord.lowestPriceOfTheDay;
          if (profit > state.maxProfit) {
            state.maxProfit = profit;
            result.buy.price = parentRecord.lowestPriceOfTheDay;
            result.buy.date = parentRecord.timestamp;
            result.sell.price = childRecord.highestPriceOfTheDay;
            result.sell.date = childRecord.timestamp;
          }
        }
      }
    }
  }

  return result;
}
