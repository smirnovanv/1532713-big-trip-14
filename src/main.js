import MenuView from './view/menu.js';
import RouteInfoAndCostView from './view/route-info-and-cost.js';
import FiltersView from './view/filters.js';
//import AddFormView from './view/add-form.js';
import {render, RenderPosition} from './utils/render.js';
import {generateEvent} from './mock/event.js';
import BoardPresenter from './presenter/board.js';
import PointsModel from './model/points.js';

import './view/edit-form.js';

const POINTS_COUNT = 4;

const points = new Array(POINTS_COUNT).fill().map(generateEvent);

const pointsModel = new PointsModel();
pointsModel.setPoints(points);

const tripMain = document.querySelector('.trip-main');
const tripControlsNavigation = document.querySelector('.trip-controls__navigation');
const tripControlsFilters = document.querySelector('.trip-controls__filters');
const tripEvents = document.querySelector('.trip-events');

const boardPresenter = new BoardPresenter(tripEvents, pointsModel);


render(tripControlsNavigation, new MenuView(), RenderPosition.BEFOREEND);
render(tripControlsFilters, new FiltersView(), RenderPosition.BEFOREEND);
render(tripMain, new RouteInfoAndCostView(points), RenderPosition.AFTERBEGIN);


boardPresenter.init();
