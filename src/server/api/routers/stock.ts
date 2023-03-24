import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { getAveragePricePerMonth } from "./stock.helpers";

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
});
