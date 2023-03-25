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

const Chart: NextPage = () => {
  const amazonMonthlyAverageStockPrice =
    api.stock.getMonthlyAverageStockPrice.useQuery({
      stockId: "clfmtwpk50000se7atjmy6avq",
    });
  const googleMonthlyAverageStockPrice =
    api.stock.getMonthlyAverageStockPrice.useQuery({
      stockId: "clfmtwqib0002se7achr4xfgc",
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
    </Layout>
  );
};

export default Chart;
