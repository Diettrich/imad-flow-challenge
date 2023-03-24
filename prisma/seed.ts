import { prisma } from "../src/server/db";
import AmazonData from "../amazon.json";
import GoogleData from "../google.json";

async function main() {
  console.log("Seeding the database...");

  const amazon = await prisma.stock.upsert({
    where: { name: "Amazon" },
    update: {},
    create: {
      name: "Amazon",
    },
  });

  const google = await prisma.stock.upsert({
    where: { name: "Google" },
    update: {},
    create: {
      name: "Google",
    },
  });

  for (let index = 0; index < GoogleData.length; index++) {
    const record = GoogleData[index];
    if (record) {
      await prisma.dailyPriceRecord.upsert({
        where: { id: `${record.n}` },
        update: {},
        create: {
          highestPriceOfTheDay: record.highestPriceOfTheDay,
          lowestPriceOfTheDay: record.lowestPriceOfTheDay,
          timestamp: record.timestamp,
          stockId: google.id,
        },
      });
    }
  }
  for (let index = 0; index < AmazonData.length; index++) {
    const record = AmazonData[index];
    if (record) {
      await prisma.dailyPriceRecord.upsert({
        where: { id: `${record.n}` },
        update: {},
        create: {
          highestPriceOfTheDay: record.highestPriceOfTheDay,
          lowestPriceOfTheDay: record.lowestPriceOfTheDay,
          timestamp: record.timestamp,
          stockId: amazon.id,
        },
      });
    }
  }

  console.log("Done seeding the database");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
