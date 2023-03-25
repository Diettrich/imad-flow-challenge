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

enum TransactionType {
  Buy = "BUY",
  Sell = "SELL",
  Hold = "HOLD",
}

interface Transaction {
  date: number;
  type: TransactionType;
  stockId: string;
  quantity: number;
  total: number;
  price: number;
  cash: number;
  portfolio: { [key: string]: number };
}

const buyStock = ({
  stockId,
  timestamp,
  buyPrice,
  cash,
  portfolio,
}: {
  stockId: string;
  timestamp: number;
  buyPrice: number;
  cash: number;
  portfolio: { [key: string]: number };
}) => {
  const quantity = Math.floor(cash / buyPrice);
  const totalCost = quantity * buyPrice;
  const newCash = cash - totalCost;
  const existingQuantity = portfolio[stockId] || 0;
  const newPortfolio = {
    ...portfolio,
    [stockId]: existingQuantity + quantity,
  };
  return {
    cash: newCash,
    portfolio: newPortfolio,
    transaction: {
      date: timestamp,
      stockId,
      price: buyPrice,
      total: quantity * buyPrice,
      type: TransactionType.Buy,
      quantity,
      cash: newCash,
      portfolio: newPortfolio,
    },
  };
};

const sellStock = ({
  stockId,
  timestamp,
  sellPrice,
  cash,
  portfolio,
}: {
  stockId: string;
  timestamp: number;
  sellPrice: number;
  cash: number;
  portfolio: { [key: string]: number };
}) => {
  const ownedQuantity = portfolio[stockId] || 0;
  const totalProfit = ownedQuantity * sellPrice;
  const newPortfolio = {
    ...portfolio,
    [stockId]: 0,
  };
  const newCash = cash + totalProfit;

  return {
    cash: newCash,
    portfolio: newPortfolio,
    transaction: {
      date: timestamp,
      stockId,
      price: sellPrice,
      total: totalProfit,
      type: TransactionType.Sell,
      quantity: ownedQuantity,
      cash: newCash,
      portfolio: newPortfolio,
    },
  };
};

export function getDailyTransactions(
  stockPrices: DailyPriceRecord[],
  initialCash: number
) {
  const state: {
    cash: number;
    transactions: Transaction[];
    portfolio: { [key: string]: number };
  } = {
    cash: initialCash,
    transactions: [],
    portfolio: {},
  };
  for (let i = 0; i < stockPrices.length; i++) {
    const record = stockPrices[i];
    const previousRecord = stockPrices[i - 1];
    const nextRecord = stockPrices[i + 1];
    if (record) {
      if (nextRecord) {
        if (record.lowestPriceOfTheDay < nextRecord.highestPriceOfTheDay) {
          if (state.cash > record.lowestPriceOfTheDay) {
            const { cash, portfolio, transaction } = buyStock({
              stockId: record.stockId,
              timestamp: record.timestamp,
              buyPrice: record.lowestPriceOfTheDay,
              cash: state.cash,
              portfolio: state.portfolio,
            });
            state.cash = cash;
            state.portfolio = portfolio;
            state.transactions.push(transaction);
          } else {
            if (
              previousRecord &&
              previousRecord.lowestPriceOfTheDay < record.highestPriceOfTheDay
            ) {
              const ownedQuantity = state.portfolio[record.stockId];
              if (ownedQuantity) {
                const { cash, portfolio, transaction } = sellStock({
                  stockId: record.stockId,
                  timestamp: record.timestamp,
                  sellPrice: record.highestPriceOfTheDay,
                  cash: state.cash,
                  portfolio: state.portfolio,
                });
                state.cash = cash;
                state.portfolio = portfolio;
                state.transactions.push(transaction);
              } else {
                state.transactions.push({
                  date: record.timestamp,
                  stockId: record.stockId,
                  price: record.highestPriceOfTheDay,
                  total: 0,
                  type: TransactionType.Hold,
                  quantity: 0,
                  cash: state.cash,
                  portfolio: state.portfolio,
                });
              }
            } else {
              state.transactions.push({
                date: record.timestamp,
                stockId: record.stockId,
                price: record.highestPriceOfTheDay,
                total: 0,
                type: TransactionType.Hold,
                quantity: 0,
                cash: state.cash,
                portfolio: state.portfolio,
              });
            }
          }
        }
      } else {
        const ownedQuantity = state.portfolio[record.stockId];
        if (ownedQuantity) {
          const { cash, portfolio, transaction } = sellStock({
            stockId: record.stockId,
            timestamp: record.timestamp,
            sellPrice: record.highestPriceOfTheDay,
            cash: state.cash,
            portfolio: state.portfolio,
          });
          state.cash = cash;
          state.portfolio = portfolio;
          state.transactions.push(transaction);
        } else {
          state.transactions.push({
            date: record.timestamp,
            stockId: record.stockId,
            price: record.highestPriceOfTheDay,
            total: 0,
            type: TransactionType.Hold,
            quantity: 0,
            cash: state.cash,
            portfolio: state.portfolio,
          });
        }
      }
    }
  }

  return { transactions: state.transactions, cash: state.cash };
}
