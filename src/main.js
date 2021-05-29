import MenuView from './view/menu.js';
import RouteInfoAndCostView from './view/route-info-and-cost.js';
import {render, RenderPosition, remove} from './utils/render.js';
import BoardPresenter from './presenter/board.js';
import PointsModel from './model/points.js';
import FilterModel from './model/filter.js';
import FilterPresenter from './presenter/filter.js';
import StatisticsView from './view/stats.js';
import {MenuItem, UpdateType} from './const.js';
import Api from './api.js';
import Destinations from './data/destinations.js';
import Offers from './data/offers.js';

const AUTHORIZATION = 'Basic myproject560420';
const END_POINT = 'https://14.ecmascript.pages.academy/big-trip';

const tripMain = document.querySelector('.trip-main');
const tripControlsNavigation = document.querySelector('.trip-controls__navigation');
const tripControlsFilters = document.querySelector('.trip-controls__filters');
const tripEvents = document.querySelector('.trip-events');
const statisticsContainer = document.querySelector('.statistics');
const newEventButton = document.querySelector('.trip-main__event-add-btn');

const api = new Api(END_POINT, AUTHORIZATION);
const offers = new Offers();
const destinations = new Destinations();

const pointsModel = new PointsModel();
const filterModel = new FilterModel();

const siteMenuComponent = new MenuView();
let statisticsComponent = null;

const boardPresenter = new BoardPresenter(tripEvents, pointsModel, filterModel, api, destinations, offers);

const filterPresenter = new FilterPresenter(tripControlsFilters, filterModel, pointsModel);

newEventButton.addEventListener('click', (evt) => {
  evt.preventDefault();
  boardPresenter.createPoint();
});

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.TABLE:
      boardPresenter.show();
      statisticsComponent.hide();
      remove(statisticsComponent);
      siteMenuComponent.setMenuItem(menuItem);
      filterPresenter.init();
      newEventButton.disabled = false;
      break;
    case MenuItem.STATS:
      boardPresenter.hide();
      statisticsComponent = new StatisticsView(pointsModel.getPoints());
      render(statisticsContainer, statisticsComponent, RenderPosition.BEFOREEND);
      statisticsComponent.show();
      siteMenuComponent.setMenuItem(menuItem);
      filterPresenter.disable();
      newEventButton.disabled = true;
      break;
  }
};

boardPresenter.init();

newEventButton.disabled = true;

Promise.all([api.getOffers(), api.getDestinations(), api.getPoints()]).then(([offersData, destinationPoints, points]) => {
  offers.setOffers(offersData);
  destinations.setDestinations(destinationPoints);
  pointsModel.setPoints(UpdateType.INIT, points);
  render(tripControlsNavigation, siteMenuComponent, RenderPosition.BEFOREEND);
  render(tripMain, new RouteInfoAndCostView(pointsModel.getPoints()), RenderPosition.AFTERBEGIN);
  siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);
  newEventButton.disabled = false;
});

