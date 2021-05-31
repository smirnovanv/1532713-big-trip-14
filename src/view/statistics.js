
import SmartView from './smart.js';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {getDuration, getFormattedDuration} from '../utils/point.js';
import {makeItemsUnique} from '../utils/common.js';

const BAR_HEIGHT = 55;

const ChartLabels = {
  MONEY: 'MONEY',
  TYPE: 'TYPE',
  TIME: 'TIME-SPEND',
};

const moneyFormat = (val) => `€ ${val}`;
const typeFormat = (val) => `${val} x`;
const timeFormat = (val) => `${getFormattedDuration(val)}`;

const sortByPrice = (typeA, typeB) => {
  return typeB.price - typeA.price;
};

const sortByCount = (typeA, typeB) => {
  return typeB.count - typeA.count;
};

const sortByDuration = (typeA, typeB) => {
  return typeB.time - typeA.time;
};

const getChartData = (points, types) => {
  const reducer = (initialValue, value) => Number(initialValue) + Number(value);

  const chartData = [];
  types.forEach((type) => {
    const pointsByType = points.filter((point) => type === point.type);
    const typeTotalData = {
      name: type,
      price: pointsByType.map((point) => point.basePrice).reduce(reducer),
      count: pointsByType.length,
      time: pointsByType.map((point) => getDuration(point)).reduce(reducer),
    };
    chartData.push(typeTotalData);
  });
  return chartData;
};

const renderChart = (chartType, sortedTypes, sortedData, label, format) => {
  return new Chart(chartType, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: sortedTypes,
      datasets: [{
        data: sortedData,
        backgroundColor: '#ffffff',
        hoverBackgroundColor: '#ffffff',
        anchor: 'start',
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13,
          },
          color: '#000000',
          anchor: 'end',
          align: 'start',
          formatter: format,
        },
      },
      title: {
        display: true,
        text: label,
        fontColor: '#000000',
        fontSize: 23,
        position: 'left',
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#000000',
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          minBarLength: 50,
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

const createStatisticsTemplate = () => {
  return `<div><div class="statistics__item statistics__item--money">
  <canvas class="statistics__chart  statistics__chart--money" width="900"></canvas>
</div>

<div class="statistics__item statistics__item--transport">
  <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
</div>

<div class="statistics__item statistics__item--time-spend">
  <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>
</div></div>`;
};

export default class Statistics extends SmartView {
  constructor(points) {
    super();

    this._data = points;
    this._moneyChart = null;
    this._typeChart = null;
    this._timeChart = null;

    this._setCharts();
  }

  getTemplate() {
    return createStatisticsTemplate(this._data);
  }

  _setCharts() {
    if (this._moneyChart !== null || this._typeChart !== null || this._timeChart !== null) {
      this._moneyChart = null;
      this._typeChart = null;
      this._timeChart = null;
    }

    const moneyCtx = this.getElement().querySelector('.statistics__chart--money');
    const typeCtx = this.getElement().querySelector('.statistics__chart--transport');
    const timeCtx = this.getElement().querySelector('.statistics__chart--time');

    const uniqueTypes = makeItemsUnique(this._data.map((point) => point.type));
    const chartData = getChartData(this._data, uniqueTypes);
    const chartDataByPrice = chartData.slice().sort(sortByPrice);
    const chartDataByCount = chartData.slice().sort(sortByCount);
    const chartDataByDuration = chartData.slice().sort(sortByDuration);

    const typesByPrice = chartDataByPrice.map((type) => type.name.toUpperCase());
    const sortedPrices = chartDataByPrice.map((type) => type.price);
    const typesByCounts = chartDataByCount.map((type) => type.name.toUpperCase());
    const sortedCounts = chartDataByCount.map((type) => type.count);
    const typesByDuration = chartDataByDuration.map((type) => type.name.toUpperCase());
    const sortedDuration = chartDataByDuration.map((type) => type.time);

    this._moneyChart = renderChart(moneyCtx, typesByPrice, sortedPrices, ChartLabels.MONEY, moneyFormat);
    this._typeChart = renderChart(typeCtx, typesByCounts, sortedCounts, ChartLabels.TYPE, typeFormat);
    this._timeChart = renderChart(timeCtx, typesByDuration, sortedDuration, ChartLabels.TIME, timeFormat);

    moneyCtx.height = BAR_HEIGHT * 5;
    typeCtx.height = BAR_HEIGHT * 5;
    timeCtx.height = BAR_HEIGHT * 5;
  }

  restoreHandlers() {
    this._setCharts();
  }

  show() {
    document.querySelector('.statistics').classList.remove('statistics--hidden');
  }

  hide() {
    document.querySelector('.statistics').classList.add('statistics--hidden');
  }
}
