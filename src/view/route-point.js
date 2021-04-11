import {formatMonthDayDate, formatDateFrom, formatDateTo, createElement} from '../utils.js';

const getDuration = (firstDate, secondDate) => {
  const timeInMs = Date.parse(secondDate) - Date.parse(firstDate);
  const days = Math.floor(timeInMs / 86400000);
  const hours = Math.floor((timeInMs - days * 86400000) / 3600000);
  const minutes = Math.floor((timeInMs - days * 86400000 - hours * 3600000) / 60000);

  let formatedDays = days.toString();
  if (formatedDays.length < 2) {formatedDays = '0' + formatedDays;}

  let formatedHours = hours.toString();
  if (formatedHours.length < 2) {formatedHours = '0' + formatedHours;}

  let formatedMinutes = minutes.toString();
  if (formatedMinutes.length < 2) {formatedMinutes = '0' + formatedMinutes;}

  if (days > 0) {
    return `${formatedDays}D ${formatedHours}H ${formatedMinutes}M`;
  } else if (hours > 0) {
    return `${formatedHours}H ${formatedMinutes}M`;
  } else {
    return `${formatedMinutes}M`;
  }
};

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

const getFavouriteClass = (favouriteStatus) => {
  if (favouriteStatus === true) {
    return ' event__favorite-btn--active';
  } else {
    return '';
  }
};

const createRoutePointTemplate = (point) => {
  const {type, destination, dateFrom, dateTo, basePrice, offers, isFavourite} = point;

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
      <p class="event__duration">${getDuration(dateFrom, dateTo)}</p>
    </div>
    <p class="event__price">
      &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
    </p>
    <h4 class="visually-hidden">Offers:</h4>
    <ul class="event__selected-offers">${createOffersList(offers)}</ul>
    <button class="event__favorite-btn${getFavouriteClass(isFavourite)}" type="button">
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

export default class RoutePoint {
  constructor(point) {
    this._point = point;
    this._element = null;
  }

  getTemplate() {
    return createRoutePointTemplate(this._point);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}

