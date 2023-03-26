import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import {
  getAveragePricePerMonth,
  getBestTimeToBuyAndSellByStockForMaxProfit,
  getDailyTransactions,
} from "./stock.helpers";

export const stockRouter = createTRPCRouter({
  getStocks: publicProcedure.query(async ({ ctx }) =>
    ctx.prisma.stock.findMany()
  ),
  getMonthlyAverageStockPrice: publicProcedure
    .input(z.object({ stockId: z.string() }))
    .query(async ({ ctx, input }) => {
      const dailyPriceRecords = await ctx.prisma.dailyPriceRecord.findMany({
        where: {
          stockId: input.stockId,
        },
      });
      return getAveragePricePerMonth(dailyPriceRecords);
    }),
  getBestTimeToBuyAndSellForMaxProfit: publicProcedure
    .input(z.object({ stockId: z.string(), cash: z.number() }))
    .query(async ({ ctx, input }) => {
      const dailyPriceRecords = await ctx.prisma.dailyPriceRecord.findMany({
        where: {
          stockId: input.stockId,
        },
      });

      const bestPrices =
        getBestTimeToBuyAndSellByStockForMaxProfit(dailyPriceRecords);

      const amountOfShares = input.cash / bestPrices.buy.price;

      return {
        ...bestPrices,
        buy: {
          date: bestPrices.buy.date,
          price: bestPrices.buy.price,
        },
        sell: {
          date: bestPrices.sell.date,
          price: bestPrices.sell.price,
        },
        profit:
          bestPrices.sell.price * amountOfShares -
          bestPrices.buy.price * amountOfShares,
      };
    }),
  getDailyTransactionsForMaxProfit: publicProcedure
    .input(z.object({ stockId: z.string(), cash: z.number() }))
    .query(async ({ ctx, input }) => {
      const dailyPriceRecords = await ctx.prisma.dailyPriceRecord.findMany({
        where: {
          stockId: input.stockId,
        },
      });
      const start = performance.now();
      const transactions = getDailyTransactions(dailyPriceRecords, input.cash);
      const end = performance.now();

      const elapsedTime = end - start;
      const minutes = Math.floor(elapsedTime / 60000);
      const seconds = ((elapsedTime % 60000) / 1000).toFixed(3);

      return {
        ...transactions,
        debug: {
          executionTime: {
            minutes: minutes,
            seconds: seconds,
          },
        },
      };
    }),
});
