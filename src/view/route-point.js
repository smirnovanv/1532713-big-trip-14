import AbstractView from './abstract.js';
import {getFormattedDuration, formatMonthDayDate, formatDateFrom, formatDateTo} from '../utils/point.js';

const getDurationInMS = (firstDate, secondDate) => {
  return Date.parse(secondDate) - Date.parse(firstDate);};

const createOffersList = (chosenOffers) => {
  if (chosenOffers.length === 0) {
    return '';
  } else {
    const offersList = chosenOffers.map((offer) => `<li class="event__offer">
    <span class="event__offer-title">${offer.title}</span>
    &plus;&euro;&nbsp;
    <span class="event__offer-price">${offer.price}</span></li>`);
    return offersList.join('');
  }
};

const createRoutePointTemplate = (point) => {
  const {type, destination, dateFrom, dateTo, basePrice, offers, isFavourite} = point;

  const durationInMS = getDurationInMS(dateFrom, dateTo);

  const getFavouriteClass = isFavourite
    ? 'event__favorite-btn event__favorite-btn--active'
    : 'event__favorite-btn';

  return `<li class="trip-events__item">
  <div class="event">
    <time class="event__date" datetime="2019-03-19">${formatMonthDayDate(dateFrom)}</time>
    <div class="event__type">
      <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
    </div>
    <h3 class="event__title">${type} ${destination.name}</h3>
    <div class="event__schedule">
      <p class="event__time">
        <time class="event__start-time" datetime="2019-03-19T18:00">${formatDateFrom(dateFrom, dateTo)}</time>
        &mdash;
        <time class="event__end-time" datetime="2019-03-19T19:00">${formatDateTo(dateFrom, dateTo)}</time>
      </p>
      <p class="event__duration">${getFormattedDuration(durationInMS)}</p>
    </div>
    <p class="event__price">
      &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
    </p>
    <h4 class="visually-hidden">Offers:</h4>
    <ul class="event__selected-offers">${createOffersList(offers)}</ul>
    <button class="${getFavouriteClass}" type="button">
      <span class="visually-hidden">Add to favorite</span>
      <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
        <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
      </svg>
    </button>
    <button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>
  </div>
</li>`;
};

export default class RoutePoint extends AbstractView {
  constructor(point) {
    super();
    this._point = point;
    this._editClickHandler = this._editClickHandler.bind(this);
    this._favouriteClickHandler = this._favouriteClickHandler.bind(this);
  }

  getTemplate() {
    return createRoutePointTemplate(this._point);
  }

  _editClickHandler(evt) {
    evt.preventDefault();
    this._callback.click();
  }

  _favouriteClickHandler(evt) {
    evt.preventDefault();
    this._callback.favouriteClick();
  }

  setEditClickHandler(callback) {
    this._callback.click = callback;
    this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._editClickHandler);
  }

  setFavouriteClickHandler (callback) {
    this._callback.favouriteClick = callback;
    this.getElement().querySelector('.event__favorite-btn').addEventListener('click', this._favouriteClickHandler);
  }
}
