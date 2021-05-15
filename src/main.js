import MenuView from './view/menu.js';
import RouteInfoAndCostView from './view/route-info-and-cost.js';
import {render, RenderPosition, remove} from './utils/render.js';
import {generateEvent} from './mock/event.js';
import BoardPresenter from './presenter/board.js';
import PointsModel from './model/points.js';
import FilterModel from './model/filter.js';
import FilterPresenter from './presenter/filter.js';
import StatisticsView from './view/stats.js';
import {MenuItem} from './const.js';

import './view/edit-form.js';

const POINTS_COUNT = 14;

const points = new Array(POINTS_COUNT).fill().map(generateEvent);

const pointsModel = new PointsModel();
pointsModel.setPoints(points);

const filterModel = new FilterModel();

const tripMain = document.querySelector('.trip-main');
const tripControlsNavigation = document.querySelector('.trip-controls__navigation');
const tripControlsFilters = document.querySelector('.trip-controls__filters');
const tripEvents = document.querySelector('.trip-events');
const statisticsContainer = document.querySelector('.statistics');
const newEventButton = document.querySelector('.trip-main__event-add-btn');

const siteMenuComponent = new MenuView();
let statisticsComponent = null;

const boardPresenter = new BoardPresenter(tripEvents, pointsModel, filterModel);


render(tripControlsNavigation, siteMenuComponent, RenderPosition.BEFOREEND);
render(tripMain, new RouteInfoAndCostView(points), RenderPosition.AFTERBEGIN);

const filterPresenter = new FilterPresenter(tripControlsFilters, filterModel, pointsModel);

filterPresenter.init();
boardPresenter.init();

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

siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);
