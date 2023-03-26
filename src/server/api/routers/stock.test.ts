import { describe, expect, test } from "vitest";
import type { DailyPriceRecord, PrismaClient, Stock } from "@prisma/client";
import type { inferProcedureInput } from "@trpc/server";
import { mockDeep } from "vitest-mock-extended";

import { type AppRouter, appRouter } from "~/server/api/root";
import { createInnerTRPCContext } from "../trpc";

import AmazonData from "../../../../amazon.json";

describe("stock router", () => {
  test("getStocks should return array of stocks", async () => {
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
  test("getStocks should return empty array if no stocks found in database", async () => {
    const prisma = mockDeep<PrismaClient>();
    const mockOutput: Stock[] = [];

    prisma.stock.findMany.mockResolvedValue(mockOutput);

    const ctx = createInnerTRPCContext({ prisma });

    const caller = appRouter.createCaller(ctx);

    const response = await caller.stock.getStocks();

    expect(response).toHaveLength(mockOutput.length);
    expect(response).toStrictEqual(mockOutput);
  });

  test("getMonthlyAverageStockPrice should return average price per month", async () => {
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
  test("getMonthlyAverageStockPrice should empty object if no price records found in database", async () => {
    const prisma = mockDeep<PrismaClient>();

    type Input = inferProcedureInput<
      AppRouter["stock"]["getMonthlyAverageStockPrice"]
    >;
    const input: Input = {
      stockId: "1",
    };

    const mockDailyPriceRecords = [] as DailyPriceRecord[];

    const mockOutput = {};

    prisma.dailyPriceRecord.findMany.mockResolvedValue(mockDailyPriceRecords);

    const ctx = createInnerTRPCContext({ prisma });

    const caller = appRouter.createCaller(ctx);

    const response = await caller.stock.getMonthlyAverageStockPrice(input);

    expect(response).toMatchObject(mockOutput);
  });
  test("getMonthlyAverageStockPrice should return 0 in average price per month if all prices has max 0 and min 0", async () => {
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
      highestPriceOfTheDay: 0,
      lowestPriceOfTheDay: 0,
      timestamp: record.timestamp,
      stockId: "1",
    }));

    const mockOutput = {
      January: 0,
      February: 0,
      March: 0,
      April: 0,
      May: 0,
      June: 0,
      July: 0,
      August: 0,
      September: 0,
      October: 0,
      November: 0,
      December: 0,
    };

    prisma.dailyPriceRecord.findMany.mockResolvedValue(mockDailyPriceRecords);

    const ctx = createInnerTRPCContext({ prisma });

    const caller = appRouter.createCaller(ctx);

    const response = await caller.stock.getMonthlyAverageStockPrice(input);

    expect(response).toMatchObject(mockOutput);
  });
  test("getMonthlyAverageStockPrice should return same average price per month if all records have same min and max", async () => {
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
      highestPriceOfTheDay: 100,
      lowestPriceOfTheDay: 0,
      timestamp: record.timestamp,
      stockId: "1",
    }));

    const mockOutput = {
      January: 50,
      February: 50,
      March: 50,
      April: 50,
      May: 50,
      June: 50,
      July: 50,
      August: 50,
      September: 50,
      October: 50,
      November: 50,
      December: 50,
    };

    prisma.dailyPriceRecord.findMany.mockResolvedValue(mockDailyPriceRecords);

    const ctx = createInnerTRPCContext({ prisma });

    const caller = appRouter.createCaller(ctx);

    const response = await caller.stock.getMonthlyAverageStockPrice(input);

    expect(response).toMatchObject(mockOutput);
  });
  test("getMonthlyAverageStockPrice should return 0 in average price per month if max is less than min", async () => {
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
      highestPriceOfTheDay: 0,
      lowestPriceOfTheDay: 100,
      timestamp: record.timestamp,
      stockId: "1",
    }));

    const mockOutput = {
      January: 0,
      February: 0,
      March: 0,
      April: 0,
      May: 0,
      June: 0,
      July: 0,
      August: 0,
      September: 0,
      October: 0,
      November: 0,
      December: 0,
    };

    prisma.dailyPriceRecord.findMany.mockResolvedValue(mockDailyPriceRecords);

    const ctx = createInnerTRPCContext({ prisma });

    const caller = appRouter.createCaller(ctx);

    const response = await caller.stock.getMonthlyAverageStockPrice(input);

    expect(response).toMatchObject(mockOutput);
  });

  test("getBestTimeToBuyAndSellForMaxProfit should returns best time to buy and to sell to get the highest profit possible", async () => {
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

    const response = await caller.stock.getBestTimeToBuyAndSellForMaxProfit(
      input
    );

    expect(response).toMatchObject(mockOutput);
  });
  test("getBestTimeToBuyAndSellForMaxProfit should returns 0 buy in buy and sell and 0 in profit if max and min equals 0", async () => {
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
      highestPriceOfTheDay: 0,
      lowestPriceOfTheDay: 0,
      timestamp: record.timestamp,
      stockId: "1",
    }));

    const mockOutput = {
      buy: {
        date: 0,
        price: 0,
      },
      sell: {
        date: 0,
        price: 0,
      },
      profit: 0,
    };

    prisma.dailyPriceRecord.findMany.mockResolvedValue(mockDailyPriceRecords);

    const ctx = createInnerTRPCContext({ prisma });

    const caller = appRouter.createCaller(ctx);

    const response = await caller.stock.getBestTimeToBuyAndSellForMaxProfit(
      input
    );

    expect(response).toMatchObject(mockOutput);
  });
  test("getBestTimeToBuyAndSellForMaxProfit should returns 0 buy in buy and sell and 0 in profit if no price records found in database", async () => {
    const prisma = mockDeep<PrismaClient>();

    type Input = inferProcedureInput<
      AppRouter["stock"]["getBestTimeToBuyAndSellForMaxProfit"]
    >;

    const input: Input = {
      stockId: "1",
      cash: 10000,
    };

    const mockDailyPriceRecords = [] as DailyPriceRecord[];

    const mockOutput = {
      buy: {
        date: 0,
        price: 0,
      },
      sell: {
        date: 0,
        price: 0,
      },
      profit: 0,
    };

    prisma.dailyPriceRecord.findMany.mockResolvedValue(mockDailyPriceRecords);

    const ctx = createInnerTRPCContext({ prisma });

    const caller = appRouter.createCaller(ctx);

    const response = await caller.stock.getBestTimeToBuyAndSellForMaxProfit(
      input
    );

    expect(response).toMatchObject(mockOutput);
  });

  test("getDailyTransactionsForMaxProfit should returns daily transactions to get the highest profit possible", async () => {
    const prisma = mockDeep<PrismaClient>();

    type Input = inferProcedureInput<
      AppRouter["stock"]["getDailyTransactionsForMaxProfit"]
    >;

    const input: Input = {
      stockId: "1",
      cash: 1000,
    };

    const mockDailyPriceRecords = AmazonData.slice(0, 5).map((record) => ({
      id: "1",
      createdAt: new Date(),
      updatedAt: new Date(),
      highestPriceOfTheDay: record.highestPriceOfTheDay,
      lowestPriceOfTheDay: record.lowestPriceOfTheDay,
      timestamp: record.timestamp,
      stockId: "1",
    }));

    const mockOutput = {
      transactions: [
        {
          date: 1641186000000,
          stockId: "1",
          price: 166.1605,
          total: 996.9630000000001,
          type: "BUY",
          quantity: 6,
          cash: 3.036999999999921,
          portfolio: {
            "1": {
              quantity: 6,
              cost: 996.9630000000001,
            },
          },
        },
        {
          date: 1641272400000,
          stockId: "1",
          price: 171.4,
          total: 1028.4,
          type: "SELL",
          quantity: 6,
          cash: 1031.437,
          portfolio: {
            "1": {
              quantity: 0,
              cost: 0,
            },
          },
        },
        {
          date: 1641358800000,
          stockId: "1",
          price: 164.357,
          total: 986.142,
          type: "BUY",
          quantity: 6,
          cash: 45.294999999999845,
          portfolio: {
            "1": {
              quantity: 6,
              cost: 986.142,
            },
          },
        },
        {
          date: 1641445200000,
          stockId: "1",
          price: 164.8,
          total: 988.8000000000001,
          type: "SELL",
          quantity: 6,
          cash: 1034.0949999999998,
          portfolio: {
            "1": {
              quantity: 0,
              cost: 0,
            },
          },
        },
        {
          date: 1641531600000,
          stockId: "1",
          price: 165.2433,
          total: 0,
          type: "HOLD",
          quantity: 0,
          cash: 1034.0949999999998,
          portfolio: {
            "1": {
              quantity: 0,
              cost: 0,
            },
          },
        },
      ],
      cash: 1034.0949999999998,
    };

    prisma.dailyPriceRecord.findMany.mockResolvedValue(mockDailyPriceRecords);

    const ctx = createInnerTRPCContext({ prisma });

    const caller = appRouter.createCaller(ctx);

    const response = await caller.stock.getDailyTransactionsForMaxProfit(input);

    expect(response).toMatchObject(mockOutput);
  });
  test("getDailyTransactionsForMaxProfit should returns all daily transactions with HOLD type and cash equal 0 if initial cash is 0", async () => {
    const prisma = mockDeep<PrismaClient>();

    type Input = inferProcedureInput<
      AppRouter["stock"]["getDailyTransactionsForMaxProfit"]
    >;

    const input: Input = {
      stockId: "1",
      cash: 0,
    };

    const mockDailyPriceRecords = AmazonData.slice(0, 5).map((record) => ({
      id: "1",
      createdAt: new Date(),
      updatedAt: new Date(),
      highestPriceOfTheDay: record.highestPriceOfTheDay,
      lowestPriceOfTheDay: record.lowestPriceOfTheDay,
      timestamp: record.timestamp,
      stockId: "1",
    }));

    const mockOutput = {
      transactions: [
        {
          date: 1641272400000,
          stockId: "1",
          price: 171.4,
          total: 0,
          type: "HOLD",
          quantity: 0,
          cash: 0,
          portfolio: {},
        },
        {
          date: 1641358800000,
          stockId: "1",
          price: 167.1263,
          total: 0,
          type: "HOLD",
          quantity: 0,
          cash: 0,
          portfolio: {},
        },
        {
          date: 1641445200000,
          stockId: "1",
          price: 164.8,
          total: 0,
          type: "HOLD",
          quantity: 0,
          cash: 0,
          portfolio: {},
        },
        {
          date: 1641531600000,
          stockId: "1",
          price: 165.2433,
          total: 0,
          type: "HOLD",
          quantity: 0,
          cash: 0,
          portfolio: {},
        },
      ],
      cash: 0,
    };

    prisma.dailyPriceRecord.findMany.mockResolvedValue(mockDailyPriceRecords);

    const ctx = createInnerTRPCContext({ prisma });

    const caller = appRouter.createCaller(ctx);

    const response = await caller.stock.getDailyTransactionsForMaxProfit(input);

    expect(response).toMatchObject(mockOutput);
  });
  test("getDailyTransactionsForMaxProfit should returns all daily transactions with HOLD type and same negative cash value if initial cash is a negative value", async () => {
    const prisma = mockDeep<PrismaClient>();

    type Input = inferProcedureInput<
      AppRouter["stock"]["getDailyTransactionsForMaxProfit"]
    >;

    const input: Input = {
      stockId: "1",
      cash: -1000,
    };

    const mockDailyPriceRecords = AmazonData.slice(0, 5).map((record) => ({
      id: "1",
      createdAt: new Date(),
      updatedAt: new Date(),
      highestPriceOfTheDay: record.highestPriceOfTheDay,
      lowestPriceOfTheDay: record.lowestPriceOfTheDay,
      timestamp: record.timestamp,
      stockId: "1",
    }));

    const mockOutput = {
      transactions: [
        {
          date: 1641272400000,
          stockId: "1",
          price: 171.4,
          total: 0,
          type: "HOLD",
          quantity: 0,
          cash: -1000,
          portfolio: {},
        },
        {
          date: 1641358800000,
          stockId: "1",
          price: 167.1263,
          total: 0,
          type: "HOLD",
          quantity: 0,
          cash: -1000,
          portfolio: {},
        },
        {
          date: 1641445200000,
          stockId: "1",
          price: 164.8,
          total: 0,
          type: "HOLD",
          quantity: 0,
          cash: -1000,
          portfolio: {},
        },
        {
          date: 1641531600000,
          stockId: "1",
          price: 165.2433,
          total: 0,
          type: "HOLD",
          quantity: 0,
          cash: -1000,
          portfolio: {},
        },
      ],
      cash: -1000,
    };

    prisma.dailyPriceRecord.findMany.mockResolvedValue(mockDailyPriceRecords);

    const ctx = createInnerTRPCContext({ prisma });

    const caller = appRouter.createCaller(ctx);

    const response = await caller.stock.getDailyTransactionsForMaxProfit(input);

    expect(response).toMatchObject(mockOutput);
  });
  test("getDailyTransactionsForMaxProfit should returns empty array of transactions and same cash if no price records found in database", async () => {
    const prisma = mockDeep<PrismaClient>();

    type Input = inferProcedureInput<
      AppRouter["stock"]["getDailyTransactionsForMaxProfit"]
    >;

    const initialCash = 1000;
    const input: Input = {
      stockId: "1",
      cash: initialCash,
    };

    const mockDailyPriceRecords = [] as DailyPriceRecord[];

    const mockOutput = {
      transactions: [],
      cash: initialCash,
    };

    prisma.dailyPriceRecord.findMany.mockResolvedValue(mockDailyPriceRecords);

    const ctx = createInnerTRPCContext({ prisma });

    const caller = appRouter.createCaller(ctx);

    const response = await caller.stock.getDailyTransactionsForMaxProfit(input);

    expect(response).toMatchObject(mockOutput);
  });
});
