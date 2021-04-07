import {createMenu} from './view/menu.js';
import {createRouteInfoAndCost} from './view/route-info-and-cost.js';
import {createFilters} from './view/filters.js';
import {createSorting} from './view/sorting.js';
import {createEditForm} from './view/edit-form.js';
import {createAddForm} from './view/add-form.js';
import {createRoutePoint} from './view/route-point.js';
import {render} from './utils.js';
import {addTripEventsList} from './view/events-list.js';
import {generateEvent} from './mock/event.js';
import {generatePossibleOffers} from './mock/offer.js';

const POINTS_COUNT = 5;

const points = new Array(POINTS_COUNT).fill().map(generateEvent);
const possibleOffers = generatePossibleOffers();

const tripMain = document.querySelector('.trip-main');
const tripControlsNavigation = document.querySelector('.trip-controls__navigation');
const tripControlsFilters = document.querySelector('.trip-controls__filters');
const tripEvents = document.querySelector('.trip-events');

render(tripMain, createRouteInfoAndCost(points), 'afterbegin');
render(tripControlsNavigation, createMenu(), 'beforeend');
render(tripControlsFilters, createFilters(), 'beforeend');
render(tripEvents, createSorting(), 'beforeend');
render(tripEvents, addTripEventsList(), 'beforeend');

const tripEventsList = document.querySelector('.trip-events__list');
render(tripEventsList, createEditForm(points[0], possibleOffers), 'beforeend');
render(tripEventsList, createAddForm(), 'beforeend');

for (let i = 1; i < POINTS_COUNT; i++) {
  render(tripEventsList, createRoutePoint(points[i]), 'beforeend');
}
