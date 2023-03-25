import type { FunctionComponent } from "react";
import FusionCharts from "fusioncharts";
import charts from "fusioncharts/fusioncharts.charts";
import ReactFusioncharts from "react-fusioncharts";

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
charts(FusionCharts);

interface Props {
  data: { [key: string]: { [key: string]: number } };
}

const LineChart: FunctionComponent<Props> = ({ data }) => {
  const dataSource = {
    chart: {
      caption: "Stock Prices",
      subcaption: "2023",
      showhovereffect: "1",
      numberprefix: "$",
      drawcrossline: "1",
      plottooltext: "<b>$dataValue</b> $seriesName",
      theme: "fusion",
    },
    categories: [
      {
        category: Object.keys(data.amazon || {}).map((month) => ({
          label: month,
        })),
      },
    ],
    dataset: Object.keys(data).map((stockName) => ({
      seriesname: stockName,
      data: Object.values(data[stockName] || {}).map((price) => ({
        value: price,
      })),
    })),
  };
  return (
    <ReactFusioncharts
      type="msline"
      width="100%"
      height="500"
      dataFormat="JSON"
      dataSource={dataSource}
    />
  );
};

export default LineChart;
