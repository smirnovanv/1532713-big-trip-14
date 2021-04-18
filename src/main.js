import MenuView from './view/menu.js';
import RouteInfoAndCostView from './view/route-info-and-cost.js';
import FiltersView from './view/filters.js';
import SortingView from './view/sorting.js';
import EditFormView from './view/edit-form.js';
//import AddFormView from './view/add-form.js';
import RoutePointView from './view/route-point.js';
import {render, RenderPosition, replace} from './utils/render.js';
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
    replace(pointEditComponent, pointComponent);
  };

  const replaceFormByPoint = () => {
    replace(pointComponent, pointEditComponent);
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      replaceFormByPoint();
      document.removeEventListener('keydown', onEscKeyDown);
    }
  };

  pointComponent.setEditClickHandler(() => {
    replacePointByForm();
    document.addEventListener('keydown', onEscKeyDown);
  });

  pointEditComponent.setFormSubmitHandler((evt) => {
    evt.preventDefault();
    replaceFormByPoint();
    document.removeEventListener('keydown', onEscKeyDown);
  });

  pointEditComponent.setExitClickHandler(() => {
    replaceFormByPoint();
    document.removeEventListener('keydown', onEscKeyDown);
  });

  render(pointsListElement, pointComponent, RenderPosition.BEFOREEND);
};

const renderBoard = (boardContainer, events) => {
  if (events.length < 1) {
    render(boardContainer, new EmptyList(), RenderPosition.BEFOREEND);
  } else {
    render(tripMain, new RouteInfoAndCostView(events), RenderPosition.AFTERBEGIN);
    render(boardContainer, new SortingView(), RenderPosition.BEFOREEND);
    render(boardContainer, new TripEventsListView(), RenderPosition.BEFOREEND);
    const tripEventsList = document.querySelector('.trip-events__list');
    for (let i = 0; i < POINTS_COUNT; i++) {
      renderPoint(tripEventsList, events[i], possibleOffers);
    }
  }
};

render(tripControlsNavigation, new MenuView(), RenderPosition.BEFOREEND);
render(tripControlsFilters, new FiltersView(), RenderPosition.BEFOREEND);
renderBoard(tripEvents, points);
