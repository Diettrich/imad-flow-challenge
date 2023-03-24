import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const stockRouter = createTRPCRouter({
  getStocks: publicProcedure.query(async ({ ctx }) =>
    ctx.prisma.stock.findMany()
  ),
});
