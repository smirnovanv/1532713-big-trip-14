import {createMenu} from './view/menu.js';
import {createRouteInfoAndCost} from './view/route-info-and-cost.js';
import {createFilters} from './view/filters.js';
import {createSorting} from './view/sorting.js';
import {createEditForm} from './view/edit-form.js';
import {createAddForm} from './view/add-form.js';
import {createRoutePoint} from './view/route-point.js';

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const addTripEventsList = () => {
  return `<ul class="trip-events__list">
  </ul>`;
};

const tripMain = document.querySelector('.trip-main');
const tripControlsNavigation = document.querySelector('.trip-controls__navigation');
const tripControlsFilters = document.querySelector('.trip-controls__filters');
const tripEvents = document.querySelector('.trip-events');


render(tripMain, createRouteInfoAndCost(), 'afterbegin');
render(tripControlsNavigation, createMenu(), 'beforeend');
render(tripControlsFilters, createFilters(), 'beforeend');
render(tripEvents, createSorting(), 'beforeend');
render(tripEvents, addTripEventsList(), 'beforeend');

const tripEventsList = document.querySelector('.trip-events__list');
render(tripEventsList, createEditForm(), 'beforeend');
render(tripEventsList, createAddForm(), 'beforeend');


const POINTS_COUNT = 3;

for (let i = 0; i < POINTS_COUNT; i++) {
  render(tripEventsList, createRoutePoint(), 'beforeend');
}
