import { type NextPage } from "next";
import Layout from "~/components/Layout";
import { api } from "~/utils/api";

const Home: NextPage = () => {
  const stocks = api.stock.getStocks.useQuery();
  const monthlyAverageStockPrice =
    api.stock.getMonthlyAverageStockPrice.useQuery({
      stockId: "clfmtwpk50000se7atjmy6avq",
    });
  return (
    <Layout>
      <h1>Flow App</h1>
      <pre>{JSON.stringify(stocks.data, null, 1)}</pre>
      <pre>{JSON.stringify(monthlyAverageStockPrice.data, null, 1)}</pre>
    </Layout>
  );
};

export default Home;
