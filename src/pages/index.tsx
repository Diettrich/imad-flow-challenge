import { type NextPage } from "next";
import Link from "next/link";
import Container from "~/components/Container";
import Layout from "~/components/Layout";

const Home: NextPage = () => {
  return (
    <Layout>
      <Container className="max-w-3xl py-20 px-10 text-center">
        <h1 className="mb-5 text-3xl font-extrabold text-gray-900 lg:text-4xl xl:text-5xl">
          Take Control of Your Investments with Our Stock Price Analyzer
        </h1>
        <h2 className="mb-10 text-lg text-gray-700 lg:text-2xl xl:text-3xl">
          Get Actionable Insights on Monthly Average Prices and Optimal Buy-Sell
          Times to Maximize Your Returns
        </h2>
        <Link
          href="/chart"
          className="bg-blue-700 rounded py-4 px-8 text-xl text-white transition-colors hover:bg-blue-800"
        >
          Explore
        </Link>
      </Container>
    </Layout>
  );
};

export default Home;
