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
import EmptyList from './view/empty-list.js';

const POINTS_COUNT = 3;

const points = new Array(POINTS_COUNT).fill().map(generateEvent);
const possibleOffers = generatePossibleOffers();

const tripMain = document.querySelector('.trip-main');
const tripControlsNavigation = document.querySelector('.trip-controls__navigation');
const tripControlsFilters = document.querySelector('.trip-controls__filters');
const tripEvents = document.querySelector('.trip-events');

const renderPoint = (pointsListElement, point, typeOffers) => {
  const pointComponent = new RoutePointView(point);
  const pointEditComponent = new EditFormView(point, typeOffers);
  const replacePointByForm = () => {
    pointsListElement.replaceChild(pointEditComponent.getElement(), pointComponent.getElement());
  };

  const replaceFormByPoint = () => {
    pointsListElement.replaceChild(pointComponent.getElement(), pointEditComponent.getElement());
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      replaceFormByPoint();
      document.removeEventListener('keydown', onEscKeyDown);
    }
  };

  pointComponent.getElement().querySelector('.event__rollup-btn').addEventListener('click', () => {
    replacePointByForm();
    document.addEventListener('keydown', onEscKeyDown);
  });

  pointEditComponent.getElement().querySelector('form').addEventListener('submit', (evt) => {
    evt.preventDefault();
    replaceFormByPoint();
    document.removeEventListener('keydown', onEscKeyDown);
  });

  pointEditComponent.getElement().querySelector('.event__rollup-btn').addEventListener('click', () => {
    replaceFormByPoint();
    document.removeEventListener('keydown', onEscKeyDown);
  });

  render(pointsListElement, pointComponent.getElement(), RenderPosition.BEFOREEND);
};

const renderBoard = (boardContainer, events) => {
  if (events.length < 1) {
    render(boardContainer, new EmptyList().getElement(), RenderPosition.BEFOREEND);
  } else {
    render(tripMain, new RouteInfoAndCostView(events).getElement(), RenderPosition.AFTERBEGIN);
    render(boardContainer, new SortingView().getElement(), RenderPosition.BEFOREEND);
    render(boardContainer, new TripEventsListView().getElement(), RenderPosition.BEFOREEND);
    const tripEventsList = document.querySelector('.trip-events__list');
    for (let i = 0; i < POINTS_COUNT; i++) {
      renderPoint(tripEventsList, events[i], possibleOffers);
    }
  }
};

render(tripControlsNavigation, new MenuView().getElement(), RenderPosition.BEFOREEND);
render(tripControlsFilters, new FiltersView().getElement(), RenderPosition.BEFOREEND);
renderBoard(tripEvents, points);
