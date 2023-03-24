import { appRouter } from "~/server/api/root";
import { expect, test } from "vitest";
import { createInnerTRPCContext } from "../trpc";

test("stock router", async () => {
  const ctx = createInnerTRPCContext({});
  const caller = appRouter.createCaller(ctx);

  const stocks = await caller.stock.getStocks();

  expect(stocks).toMatchObject([
    {
      name: "Amazon",
    },
    {
      name: "Google",
    },
  ]);
});
