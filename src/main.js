import MenuView from './view/menu.js';
import RouteInfoAndCostView from './view/route-info-and-cost.js';
import FiltersView from './view/filters.js';
//import AddFormView from './view/add-form.js';
import {render, RenderPosition} from './utils/render.js';
import {generateEvent} from './mock/event.js';
import BoardPresenter from './presenter/board.js';
import PointsModel from './model/points.js';
import FilterModel from './model/filter.js';
import FilterPresenter from './presenter/filter.js';

import './view/edit-form.js';

const POINTS_COUNT = 4;

const points = new Array(POINTS_COUNT).fill().map(generateEvent);

const pointsModel = new PointsModel();
pointsModel.setPoints(points);

const filterModel = new FilterModel();

const tripMain = document.querySelector('.trip-main');
const tripControlsNavigation = document.querySelector('.trip-controls__navigation');
const tripControlsFilters = document.querySelector('.trip-controls__filters');
const tripEvents = document.querySelector('.trip-events');

const boardPresenter = new BoardPresenter(tripEvents, pointsModel, filterModel);


render(tripControlsNavigation, new MenuView(), RenderPosition.BEFOREEND);
render(tripMain, new RouteInfoAndCostView(points), RenderPosition.AFTERBEGIN);

const filterPresenter = new FilterPresenter(tripControlsFilters, filterModel, pointsModel);

filterPresenter.init();
boardPresenter.init();

document.querySelector('.trip-main__event-add-btn').addEventListener('click', (evt) => {
  evt.preventDefault();
  boardPresenter.createPoint();
});
