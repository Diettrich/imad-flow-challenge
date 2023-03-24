import { appRouter } from "~/server/api/root";
import { describe, expect, test } from "vitest";
import { createInnerTRPCContext } from "../trpc";
import type { PrismaClient, Stock } from "@prisma/client";
import { mockDeep } from "vitest-mock-extended";

describe("stock router", () => {
  test("getStocks procedure", async () => {
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
});
