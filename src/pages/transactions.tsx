import { type NextPage } from "next";
import Container from "~/components/Container";
import Layout from "~/components/Layout";
import { Title } from "~/components/Typography";
import { api } from "~/utils/api";
import { formatDate, formatPrice } from "~/utils/formatting";

const CASH = 100000;

const Chart: NextPage = () => {
  const stocks = api.stock.getStocks.useQuery();

  const amazonStock = stocks.data?.find((stock) => stock.name === "Amazon");
  const googleStock = stocks.data?.find((stock) => stock.name === "Google");

  const dailyTransactionsForMaxProfit =
    api.stock.getDailyTransactionsForMaxProfit.useQuery({
      stockId: amazonStock?.id || "",
      cash: CASH,
    });

  if (stocks.isError || dailyTransactionsForMaxProfit.isError) {
    return (
      <Layout>
        <Container className="mb-10">
          <Title>Something went wrong</Title>
          <p>Try refreshing the page</p>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container className="mb-10">
        <Title>Meilleur moment pour acheter et pour vendre</Title>
        {dailyTransactionsForMaxProfit.data ? (
          <>
            <p>Liste des achats et ventes quotidien d&apos;Erwan</p>
            <div className="mt-5 flex max-h-96 justify-center overflow-y-auto border border-slate-500">
              <table className="w-full table-auto border-collapse border border-slate-500">
                <thead className="sticky top-0 bg-gray-100">
                  <tr>
                    <th className="border border-slate-600 px-5">DATE</th>
                    <th className="border border-slate-600 px-5">ACTION</th>
                    <th className="border border-slate-600 px-5">NAME</th>
                    <th className="border border-slate-600 px-5">
                      PRIX UNITAIRE
                    </th>
                    <th className="border border-slate-600 px-5">
                      NOMBRE ACTION
                    </th>
                    <th className="border border-slate-600 px-5">TOTAL</th>
                    <th className="border border-slate-600 px-5">
                      PORTFEUILLE
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {dailyTransactionsForMaxProfit.data?.transactions.map(
                    (transaction) => (
                      <tr className="text-center" key={transaction.date}>
                        <td className="border border-slate-700">
                          {formatDate(transaction.date)}
                        </td>
                        <td className="border border-slate-700">
                          {transaction.type}
                        </td>
                        <td className="border border-slate-700">
                          {transaction.stockId === amazonStock?.id && "AMAZON"}
                          {transaction.stockId === googleStock?.id && "GOOGLE"}
                        </td>
                        <td className="border border-slate-700">
                          {formatPrice(transaction.price)}
                        </td>
                        <td className="border border-slate-700">
                          {transaction.quantity}
                        </td>
                        <td className="border border-slate-700">
                          {formatPrice(transaction.total)}
                        </td>
                        <td className="border border-slate-700">
                          {formatPrice(transaction.cash)}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
            <p className="mt-5">
              Temps total d&apos;execution:{" "}
              {dailyTransactionsForMaxProfit.data?.debug.executionTime.minutes}{" "}
              minutes et{" "}
              {dailyTransactionsForMaxProfit.data?.debug.executionTime.seconds}{" "}
              secondes
            </p>
          </>
        ) : (
          <p>Loading</p>
        )}
      </Container>
    </Layout>
  );
};

export default Chart;
