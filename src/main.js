import MenuView from './view/menu.js';
import RouteInfoAndCostView from './view/route-info-and-cost.js';
import FiltersView from './view/filters.js';
import SortingView from './view/sorting.js';
import EditFormView from './view/edit-form.js';
//import AddFormView from './view/add-form.js';
import RoutePointView from './view/route-point.js';
import {render, RenderPosition} from './utils.js';
import TripEventsListView from './view/events-list.js';
import {generateEvent} from './mock/event.js';
import {generatePossibleOffers} from './mock/offer.js';

const POINTS_COUNT = 5;

const points = new Array(POINTS_COUNT).fill().map(generateEvent);
const possibleOffers = generatePossibleOffers();

const tripMain = document.querySelector('.trip-main');
const tripControlsNavigation = document.querySelector('.trip-controls__navigation');
const tripControlsFilters = document.querySelector('.trip-controls__filters');
const tripEvents = document.querySelector('.trip-events');

const renderPoint = (pointsListElement, point, typeOffers) => {
  const pointComponent = new RoutePointView(point);
  const pointEditComponent = new EditFormView(point, typeOffers);
  //points[0], possibleOffers
  const replacePointByForm = () => {
    pointsListElement.replaceChild(pointEditComponent.getElement(), pointComponent.getElement());
  };

  const replaceFormByPoint = () => {
    pointsListElement.replaceChild(pointComponent.getElement(), pointEditComponent.getElement());
  };

  pointComponent.getElement().querySelector('.event__rollup-btn').addEventListener('click', () => {
    replacePointByForm();
  });

  pointEditComponent.getElement().querySelector('form').addEventListener('submit', (evt) => {
    evt.preventDefault();
    replaceFormByPoint();
  });

  pointEditComponent.getElement().querySelector('.event__rollup-btn').addEventListener('click', () => {
    replaceFormByPoint();
  });

  render(pointsListElement, pointComponent.getElement(), RenderPosition.BEFOREEND);
};

render(tripMain, new RouteInfoAndCostView(points).getElement(), RenderPosition.AFTERBEGIN);
render(tripControlsNavigation, new MenuView().getElement(), RenderPosition.BEFOREEND);
render(tripControlsFilters, new FiltersView().getElement(), RenderPosition.BEFOREEND);
render(tripEvents, new SortingView().getElement(), RenderPosition.BEFOREEND);

render(tripEvents, new TripEventsListView().getElement(), RenderPosition.BEFOREEND);

const tripEventsList = document.querySelector('.trip-events__list');

for (let i = 0; i < POINTS_COUNT; i++) {
  renderPoint(tripEventsList, points[i], possibleOffers);
}
