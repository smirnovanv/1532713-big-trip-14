import AbstractView from './abstract.js';
import {SortType} from '../const.js';

const createSortingTemplate = (currentSortType) => {
  return `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
  <div class="trip-sort__item  trip-sort__item--day">
    <input id="sort-day" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-day" data-sort-type="${SortType.DATE_UP}"${currentSortType === SortType.DATE_UP ? ' checked' : ''}>
    <label class="trip-sort__btn" for="sort-day">Day</label>
  </div>

  <div class="trip-sort__item  trip-sort__item--event">
    <input id="sort-event" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-event" disabled>
    <label class="trip-sort__btn" for="sort-event">Event</label>
  </div>

  <div class="trip-sort__item  trip-sort__item--time">
    <input id="sort-time" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-time" data-sort-type="${SortType.DURATION_DOWN}"${currentSortType === SortType.DURATION_DOWN ? ' checked' : ''}>
    <label class="trip-sort__btn" for="sort-time">Time</label>
  </div>

  <div class="trip-sort__item  trip-sort__item--price">
    <input id="sort-price" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-price" data-sort-type="${SortType.PRICE_DOWN}"${currentSortType === SortType.PRICE_DOWN ? ' checked' : ''}>
    <label class="trip-sort__btn" for="sort-price">Price</label>
  </div>

  <div class="trip-sort__item  trip-sort__item--offer">
    <input id="sort-offer" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-offer" disabled>
    <label class="trip-sort__btn" for="sort-offer">Offers</label>
  </div>
</form>`;
};

export default class Sorting extends AbstractView {
  constructor(currentSortType) {
    super();

    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
    this._currentSortType = currentSortType;
  }

  _sortTypeChangeHandler(evt) {
    if (evt.target.tagName !== 'INPUT') {
      return;
    }

    this._callback.sortTypeChange(evt.target.dataset.sortType);
  }

  setSortTypeChangeHandler(callback) {
    this._callback.sortTypeChange = callback;
    this.getElement().addEventListener('click', this._sortTypeChangeHandler);
  }

  getTemplate() {
    return createSortingTemplate(this._currentSortType);
  }
}
