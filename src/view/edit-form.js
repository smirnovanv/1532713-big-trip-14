import SmartView from './smart.js';
import {hideBlockIfEmpty} from '../utils/render.js';
import {formatedFullDate} from '../utils/point.js';
import {TYPES} from '../const.js';
import flatpickr from 'flatpickr';
import {BLANK_POINT} from '../const.js';

import '../../node_modules/flatpickr/dist/flatpickr.min.css';

const getPossibleOffers = (possibleOffers, point = BLANK_POINT) => {
  const currentType = point.type;
  return possibleOffers.filter((offer) => offer.type === currentType)[0].offers;
};

const createPicturesList = (pictures) => {
  if (pictures.length === 0) {
    return '';
  } else {
    const picturesList = pictures.map((picture) => `<img class="event__photo" src="${picture.src}" alt="picture.description">`);
    return picturesList.join('');
  }
};

const createOffersList = (chosenOffers, allOffers) => {
  const offers = allOffers.map((offer) => `<div class="event__offer-selector">
  <input class="event__offer-checkbox  visually-hidden" id="${offer.title.toLowerCase().split(' ').join('-')}" type="checkbox" name="${offer.title.toLowerCase().split(' ').join('-')}" data-offer="${offer.title.toLowerCase().split(' ').join('-')}"
  ${chosenOffers.some((chosenOffer) => chosenOffer.title === offer.title) ? ' checked' : ''}>
  <label class="event__offer-label" for="${offer.title.toLowerCase().split(' ').join('-')}">
    <span class="event__offer-title">${offer.title}</span>
    &plus;&euro;&nbsp;
    <span class="event__offer-price">${offer.price}</span>
  </label>
</div>`);
  return offers.join('');
};

const makeFirstLetterUpperCase = (str) => {
  const newString = str[0].toUpperCase() + str.slice(1);
  return newString;
};

const createEditFormTypeTemplate = (currentType) => {

  return TYPES.map((type) => `<div class="event__type-item">
  <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${currentType === type ? 'checked' : ''}>
  <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${makeFirstLetterUpperCase(type)}</label>
</div>`).join('');
};

const createEditFormDestinationsTemplate = (destinationsData, point) => {
  return destinationsData.map((destination) => `<option value="${destination.name}"${destination.name === point.destination.name ? ' selected' : ''}></option>`).join('');
};

const hideOffersSection = (offers, point) => {
  if (getPossibleOffers(offers, point).length === 0) {
    return ' visually-hidden';}
  return '';
};

const createEditButtonsTemplate = (point) => {
  if (point.isPointNew) {
    return '<button class="event__reset-btn" type="reset">Cancel</button>';
  } else {
    return `<button class="event__reset-btn" type="reset">Delete</button>
    <button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>`;
  }
};

const createEditFormTemplate = (point = BLANK_POINT, destinations, allOffers) => {
  const {type, destination, dateFrom, dateTo, basePrice, offers} = point;

  const typesTemplate = createEditFormTypeTemplate(type);

  return `<li class="trip-events__item">
  <form class="event event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

        <div class="event__type-list">
          <fieldset class="event__type-group">
            <legend class="visually-hidden">Event type</legend>
            ${typesTemplate}
          </fieldset>
        </div>
      </div>

      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-1">
          ${type}
        </label>
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination.name}" list="destination-list-1" required>
        <datalist id="destination-list-1">
        ${createEditFormDestinationsTemplate(destinations, point)}
        </datalist>
      </div>

      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">From</label>
        <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${formatedFullDate(dateFrom)}">
        &mdash;
        <label class="visually-hidden" for="event-end-time-1">To</label>
        <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${formatedFullDate(dateTo)}">
      </div>

      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-1" name="event-price" value="${basePrice}" type="number" step="1" min="1" required>
      </div>

      <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
      ${createEditButtonsTemplate(point)}
    </header>
    <section class="event__details">
      <section class="event__section  event__section--offers${hideOffersSection(allOffers, point)}">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>
        <div class="event__available-offers">
        ${createOffersList(offers, getPossibleOffers(allOffers, point))}
        </div>
      </section>
      <section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${destination.description}</p>
        <div class="event__photos-container ${hideBlockIfEmpty(destination.pictures)}">
          <div class="event__photos-tape">
          ${createPicturesList(destination.pictures)}
          </div>
        </div>
      </section>
    </section>
  </form>
</li>`;
};

export default class EditForm extends SmartView {
  constructor (offers, destinations, point = BLANK_POINT) {
    super();
    this._state = EditForm.parsePointToState(point);
    this._datepickerFrom = null;
    this._datepickerTo = null;
    this._destinations = destinations._destinations;
    this._offers = offers._offers;

    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._formDeleteClickHandler = this._formDeleteClickHandler.bind(this);
    this._priceInputHandler = this._priceInputHandler.bind(this);
    this._clickHandler = this._clickHandler.bind(this);
    this._typeChangeHandler = this._typeChangeHandler.bind(this);
    this._destinationInputHandler = this._destinationInputHandler.bind(this);
    this._dateFromChangeHandler = this._dateFromChangeHandler.bind(this);
    this._dateToChangeHandler = this._dateToChangeHandler.bind(this);
    this._offersChangeHandler = this._offersChangeHandler.bind(this);

    this._setInnerHandlers();
    this._setDatepickerFrom();
    this._setDatepickerTo();
  }

  removeElement() {
    super.removeElement();

    if (this._datepickerFrom) {
      this._datepickerFrom.destroy();
      this._datepickerFrom = null;
    }

    if (this._datepickerTo) {
      this._datepickerTo.destroy();
      this._datepickerTo = null;
    }
  }

  reset (point) {
    this.updateData(EditForm.parsePointToState(point));
  }

  getTemplate () {
    return createEditFormTemplate(this._state, this._destinations, this._offers);
  }

  restoreHandlers () {
    this._setInnerHandlers();
    this._setDatepickerFrom();
    this._setDatepickerTo();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setDeleteClickHandler(this._callback.deleteClick);
    if (!this._state.isPointNew) {
      this.setExitClickHandler(this._callback.click);
    }
  }

  _setDatepickerFrom() {
    if (this._datepickerFrom) {
      this._datepickerFrom.destroy();
      this._datepickerFrom = null;
    }

    this._datepickerFrom = flatpickr(
      this.getElement().querySelector('[name="event-start-time"]'),
      {
        dateFormat: 'j/n/Y H:i',
        defaultDate: this._state.dateFrom,
        enableTime: true,
        onClose: this._dateFromChangeHandler,
        maxDate: this._state.dateTo,
      },
    );
  }

  _setDatepickerTo() {
    if (this._datepickerTo) {
      this._datepickerTo.destroy();
      this._datepickerTo = null;
    }

    this._datepickerTo = flatpickr(
      this.getElement().querySelector('[name="event-end-time"]'),
      {
        dateFormat: 'j/n/Y H:i',
        defaultDate: this._state.dateTo,
        enableTime: true,
        onClose: this._dateToChangeHandler,
        minDate: this._state.dateFrom,
      },
    );
  }

  _dateFromChangeHandler([userDate]) {
    this.updateData({
      dateFrom: userDate,
    });
  }

  _dateToChangeHandler([userDate]) {
    this.updateData({
      dateTo: userDate,
    });
  }

  _setInnerHandlers () {
    this.getElement().querySelector('.event__input--price').addEventListener('input', this._priceInputHandler);
    this.getElement().querySelector('.event__type-group').addEventListener('change', this._typeChangeHandler);
    this.getElement().querySelector('.event__input--destination').addEventListener('input', this._destinationInputHandler);
    this.getElement().querySelector('.event__available-offers').addEventListener('change', this._offersChangeHandler);
  }

  _priceInputHandler (evt) {
    evt.preventDefault();
    this.updateData({
      basePrice: evt.target.value,
    }, true);
  }

  _typeChangeHandler (evt) {
    this.updateData({
      type: evt.target.value,
      offers: [],
    });
  }

  _offersChangeHandler (evt) {
    if (this._state.offers.some((offer) => offer.title.toLowerCase().split(' ').join('-') === evt.target.dataset.offer)) {
      this.updateData({
        offers: this._state.offers.slice().filter((offer) => offer.title.toLowerCase().split(' ').join('-') !== evt.target.dataset.offer),
      });
    } else {
      const newCheckedOffer = getPossibleOffers(this._offers, this._state).slice().filter((offer) => offer.title.toLowerCase().split(' ').join('-') === evt.target.dataset.offer)[0];
      this.updateData({
        offers: this._state.offers.slice().concat(newCheckedOffer),
      });
    }
  }

  _destinationInputHandler (evt) {
    evt.preventDefault();
    if (this._destinations.some((destination) => destination.name === evt.target.value)) {
      this.updateData({
        destination: {name: evt.target.value, description: this._destinations.filter((destination) => destination.name === evt.target.value)[0].description, pictures: this._destinations.filter((destination) => destination.name === evt.target.value)[0].pictures},
      });
    }
  }

  _formSubmitHandler (evt) {
    evt.preventDefault();
    this._callback.formSubmit(EditForm.parseStateToPoint(this._state));
  }

  setFormSubmitHandler (callback) {
    this._callback.formSubmit = callback;
    this.getElement().querySelector('form').addEventListener('submit', this._formSubmitHandler);
  }

  _clickHandler () {
    this._callback.click();
  }

  setEditClickHandler (callback) {
    this._callback.click = callback;
    this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._clickHandler);
  }

  setExitClickHandler (callback) {
    this._callback.click = callback;
    this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._clickHandler);
  }

  _formDeleteClickHandler(evt) {
    evt.preventDefault();
    this._callback.deleteClick(EditForm.parseStateToPoint(this._state));
  }

  setDeleteClickHandler(callback) {
    this._callback.deleteClick = callback;
    this.getElement().querySelector('.event__reset-btn').addEventListener('click', this._formDeleteClickHandler);
  }

  static parsePointToState (point) {
    return Object.assign(
      {},
      point,
      {
        isPointNew: point.destination.name === '',
      },
    );
  }

  static parseStateToPoint (state) {
    state = Object.assign({}, state);

    delete state.isPointNew;

    return state;
  }
}

