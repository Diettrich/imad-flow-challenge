import { type NextPage } from "next";
import Container from "~/components/Container";
import Layout from "~/components/Layout";
import { Title } from "~/components/Typography";
import { api } from "~/utils/api";
import dynamic from "next/dynamic";

const LineChart = dynamic(() => import("../components/LineChart"), {
  loading: () => <p>Loading...</p>,
  ssr: false,
});

const formatPrice = (price: number) =>
  price.toLocaleString("fr-FR", {
    style: "currency",
    currency: "EUR",
  });

const formatDate = (timestamp: number) =>
  new Date(timestamp).toLocaleDateString("fr-FR");

const CASH = 100000;

const Chart: NextPage = () => {
  const stocks = api.stock.getStocks.useQuery();
  const amazonMonthlyAverageStockPrice =
    api.stock.getMonthlyAverageStockPrice.useQuery({
      stockId: stocks.data?.find((stock) => stock.name === "Amazon")?.id || "",
    });
  const googleMonthlyAverageStockPrice =
    api.stock.getMonthlyAverageStockPrice.useQuery({
      stockId: stocks.data?.find((stock) => stock.name === "Google")?.id || "",
    });

  const bestTimeToBuyAndSellAmazonStock =
    api.stock.getBestTimeToBuyAndSellForMaxProfit.useQuery({
      stockId: stocks.data?.find((stock) => stock.name === "Amazon")?.id || "",
      cash: CASH,
    });

  const bestTimeToBuyAndSellGoogleStock =
    api.stock.getBestTimeToBuyAndSellForMaxProfit.useQuery({
      stockId: stocks.data?.find((stock) => stock.name === "Google")?.id || "",
      cash: CASH,
    });

  return (
    <Layout>
      <Container className="mb-10">
        <Title>Amazon and Google stock prices in 2023</Title>
        {!!amazonMonthlyAverageStockPrice.data &&
          googleMonthlyAverageStockPrice.data && (
            <LineChart
              data={{
                amazon: amazonMonthlyAverageStockPrice.data,
                google: googleMonthlyAverageStockPrice.data,
              }}
            />
          )}
      </Container>
      <Container className="mb-10">
        {bestTimeToBuyAndSellAmazonStock.data && (
          <p className="mb-10">
            Aymen devrait acheter {formatPrice(CASH)} d{"'"}action Amazon le{" "}
            {formatDate(bestTimeToBuyAndSellAmazonStock.data.buy.date)} au prix
            de {formatPrice(bestTimeToBuyAndSellAmazonStock.data.buy.price)}
            <p>
              Il devrait ensuite vendre ces actions le{" "}
              {formatDate(bestTimeToBuyAndSellAmazonStock.data.sell.date)} au
              prix de{" "}
              {formatPrice(bestTimeToBuyAndSellAmazonStock.data.sell.price)}{" "}
              pour faire un gain de{" "}
              {formatPrice(bestTimeToBuyAndSellAmazonStock.data.profit)}
            </p>
          </p>
        )}
        {bestTimeToBuyAndSellGoogleStock.data && (
          <p>
            Anouar devrait acheter {formatPrice(CASH)} d{"'"}action Amazon le{" "}
            {formatDate(bestTimeToBuyAndSellGoogleStock.data.buy.date)} au prix
            de {formatPrice(bestTimeToBuyAndSellGoogleStock.data.buy.price)}
            <p>
              Il devrait ensuite vendre ces actions le{" "}
              {formatDate(bestTimeToBuyAndSellGoogleStock.data.sell.date)} au
              prix de{" "}
              {formatPrice(bestTimeToBuyAndSellGoogleStock.data.sell.price)}{" "}
              pour faire un gain de{" "}
              {formatPrice(bestTimeToBuyAndSellGoogleStock.data.profit)}
            </p>
          </p>
        )}
      </Container>
    </Layout>
  );
};

export default Chart;
