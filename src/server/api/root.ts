import { createTRPCRouter } from "~/server/api/trpc";
import { stockRouter } from "~/server/api/routers/stock";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  stock: stockRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
