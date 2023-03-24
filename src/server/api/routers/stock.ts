import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const stockRouter = createTRPCRouter({
  getStocks: publicProcedure.query(() => [
    {
      name: "Amazon",
    },
    {
      name: "Google",
    },
  ]),
});
