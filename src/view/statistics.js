
import SmartView from './smart.js';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {getDuration, getFormattedDuration} from '../utils/point.js';
import {makeItemsUnique} from '../utils/common.js';

const BAR_HEIGHT = 55;

const getTypePrice = (points, type) => {
  const reducer = (initialValue, price) => Number(initialValue) + Number(price);
  return points.filter((point) => point.type === type).map((point) => point.basePrice).reduce(reducer);
};

const getTypeDuration = (points, type) => {
  const reducer = (initialValue, time) => Number(initialValue) + Number(time);
  return points.filter((point) => point.type === type).map((point) => getDuration(point)).reduce(reducer);
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
  const chartData = [];
  types.forEach((type) => {
    const typeTotalData = {
      name: type,
      price: getTypePrice(points, type),
      count: points.filter((point) => point.type === type).length,
      time: getTypeDuration(points, type),
    };
    chartData.push(typeTotalData);
  });
  return chartData;
};

const getMoneyChartData = (points, types) => {
  return getChartData(points, types).sort(sortByPrice);
};

const getTypesChartData = (points, types) => {
  return getChartData(points, types).sort(sortByCount);
};

const getTimeChartData = (points, types) => {
  return getChartData(points, types).sort(sortByDuration);
};

const renderMoneyChart = (moneyCtx, points, format) => {
  const uniqueTypes = makeItemsUnique(points.map((point) => point.type));
  const sortedTypes = getMoneyChartData(points,uniqueTypes).map((type) => type.name.toUpperCase());
  const sortedPrices = getMoneyChartData(points,uniqueTypes).map((type) => type.price);

  return new Chart(moneyCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: sortedTypes,
      datasets: [{
        data: sortedPrices,
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
        text: 'MONEY',
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

const renderTypeChart = (typeCtx, points, format) => {
  const uniqueTypes = makeItemsUnique(points.map((point) => point.type));
  const sortedTypes = getTypesChartData(points, uniqueTypes).map((type) => type.name.toUpperCase());
  const sortedCounts = getTypesChartData(points, uniqueTypes).map((type) => type.count);

  return new Chart(typeCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: sortedTypes,
      datasets: [{
        data: sortedCounts,
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
        text: 'TYPE',
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

const renderTimeChart = (timeCtx, points, format) => {
  const uniqueTypes = makeItemsUnique(points.map((point) => point.type));
  const sortedTypes = getTimeChartData(points, uniqueTypes).map((type) => type.name.toUpperCase());
  const sortedDuration = getTimeChartData(points, uniqueTypes).map((type) => type.time);

  return new Chart(timeCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: sortedTypes,
      datasets: [{
        data: sortedDuration,
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
        text: 'TIME-SPEND',
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

    this._moneyChart = renderMoneyChart(moneyCtx, this._data, moneyFormat);
    this._typeChart = renderTypeChart(typeCtx, this._data, typeFormat);
    this._timeChart = renderTimeChart(timeCtx, this._data, timeFormat);

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
