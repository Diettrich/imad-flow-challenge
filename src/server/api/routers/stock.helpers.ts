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
