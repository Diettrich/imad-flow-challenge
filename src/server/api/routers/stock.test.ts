import { describe, expect, test } from "vitest";
import type { PrismaClient, Stock } from "@prisma/client";
import type { inferProcedureInput } from "@trpc/server";
import { mockDeep } from "vitest-mock-extended";

import { type AppRouter, appRouter } from "~/server/api/root";
import { createInnerTRPCContext } from "../trpc";

import AmazonData from "../../../../amazon.json";

describe("stock router", () => {
  test("getStocks returns array of stocks", async () => {
    const prisma = mockDeep<PrismaClient>();
    const mockOutput: Stock[] = [
      {
        id: "1",
        name: "Amazon",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "1",
        name: "Google",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    prisma.stock.findMany.mockResolvedValue(mockOutput);

    const ctx = createInnerTRPCContext({ prisma });

    const caller = appRouter.createCaller(ctx);

    const response = await caller.stock.getStocks();

    expect(response).toHaveLength(mockOutput.length);
    expect(response).toStrictEqual(mockOutput);
  });
  test("getMonthlyAverageStockPrice returns average price per month", async () => {
    const prisma = mockDeep<PrismaClient>();

    type Input = inferProcedureInput<
      AppRouter["stock"]["getMonthlyAverageStockPrice"]
    >;
    const input: Input = {
      stockId: "1",
    };

    const mockDailyPriceRecords = AmazonData.map((record) => ({
      id: "1",
      createdAt: new Date(),
      updatedAt: new Date(),
      highestPriceOfTheDay: record.highestPriceOfTheDay,
      lowestPriceOfTheDay: record.lowestPriceOfTheDay,
      timestamp: record.timestamp,
      stockId: "1",
    }));

    const mockOutput = {
      January: 155.6432825,
      February: 153.80048684210524,
      March: 154.23422391304345,
      April: 151.79796000000005,
      May: 112.30992380952378,
      June: 113.04387380952382,
      July: 116.48066250000002,
      August: 137.8055413043478,
      September: 123.19693571428573,
      October: 114.32116904761904,
      November: 94.25089999999997,
      December: 88.13136904761903,
    };

    prisma.dailyPriceRecord.findMany.mockResolvedValue(mockDailyPriceRecords);

    const ctx = createInnerTRPCContext({ prisma });

    const caller = appRouter.createCaller(ctx);

    const response = await caller.stock.getMonthlyAverageStockPrice(input);

    expect(response).toMatchObject(mockOutput);
  });
  test("getBestTimeToBuyAndSellByStockForAGivenYear returns best time to buy and to sell to get the highest profit possible", async () => {
    const prisma = mockDeep<PrismaClient>();

    type Input = inferProcedureInput<
      AppRouter["stock"]["getBestTimeToBuyAndSellForMaxProfit"]
    >;

    const input: Input = {
      stockId: "1",
      cash: 10000,
    };

    const mockDailyPriceRecords = AmazonData.map((record) => ({
      id: "1",
      createdAt: new Date(),
      updatedAt: new Date(),
      highestPriceOfTheDay: record.highestPriceOfTheDay,
      lowestPriceOfTheDay: record.lowestPriceOfTheDay,
      timestamp: record.timestamp,
      stockId: "1",
    }));

    const mockOutput = {
      buy: {
        date: 1653364800000,
        price: 101.26,
      },
      sell: {
        date: 1660622400000,
        price: 146.57,
      },
      profit: 4474.61979063796,
    };

    prisma.dailyPriceRecord.findMany.mockResolvedValue(mockDailyPriceRecords);

    const ctx = createInnerTRPCContext({ prisma });

    const caller = appRouter.createCaller(ctx);

    const response = await caller.stock.getBestTimeToBuyAndSellForMaxProfit(input);

    expect(response).toMatchObject(mockOutput);
  });
});
