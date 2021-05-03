import SmartView from './smart.js';
import {hideBlockIfEmpty} from '../utils/render.js';
import {formatedFullDate} from '../utils/point.js';
import {TYPES} from '../const.js';
import {getPossibleOffers} from '../utils/point.js';
import {nanoid} from 'nanoid';
import {destinationsData} from '../mock/event.js';
import flatpickr from 'flatpickr';

import '../../node_modules/flatpickr/dist/flatpickr.min.css';

const BLANK_POINT = {
  id: nanoid(),
  type: 'taxi',
  destination: {
    description: '',
    name: '',
    pictures: [],
  },
  dateFrom: '',
  dateTo: '',
  basePrice: '',
  offers: [],
  isFavourite: false,
};

const createPicturesList = (pictures) => {
  if (pictures.length === 0) {
    return '';
  } else {
    const picturesList = pictures.map((picture) => `<img class="event__photo" src="${picture.src}" alt="picture.description">`);
    return picturesList.join('');
  }
};

const createChosenOffersList = (chosenOffers) => {
  if (chosenOffers.length === 0) {
    return '';
  } else {
    const chosenOffersList = chosenOffers.map((offer) => `<div class="event__offer-selector">
    <input class="event__offer-checkbox  visually-hidden" id="${offer.title.toLowerCase().split(' ').join('-')}" type="checkbox" name="${offer.title.toLowerCase().split(' ').join('-')}" data-offer="${offer.title.toLowerCase().split(' ').join('-')}" checked>
    <label class="event__offer-label" for="${offer.title.toLowerCase().split(' ').join('-')}">
      <span class="event__offer-title">${offer.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${offer.price}</span>
    </label>
  </div>`);
    return chosenOffersList.join('');
  }
};

const createExtraOffersList = (chosenOffers, allOffers) => {
  const currentOptions = new Set();
  chosenOffers.forEach((offer) => {
    currentOptions.add(offer.title);
  });
  const extraOffersList = [];
  allOffers.forEach((option) => {
    if (!currentOptions.has(option.title)) {
      extraOffersList.push(`<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="${option.title.toLowerCase().split(' ').join('-')}" type="checkbox" name="${option.title.toLowerCase().split(' ').join('-')}" data-offer="${option.title.toLowerCase().split(' ').join('-')}">
      <label class="event__offer-label" for="${option.title.toLowerCase().split(' ').join('-')}">
        <span class="event__offer-title">${option.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${option.price}</span>
      </label>
    </div>`);
    }
  });
  return extraOffersList.join('');
};
//сокращу две функции отрисовки офферов до одной, когде придут реальные данные, пока у меня моки не совпадают. буду отрисовывать все возможные опции,
//а если опция совпадает с выбранной, то поставлю checked

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

const createEditFormDestinationsTemplate = (point) => {
  return destinationsData.map((destination) => `<option value="${destination.name}"${destination.name === point.destination.name ? ' selected' : ''}></option>`).join('');
};

const hideOffersSection = (point) => {
  if (getPossibleOffers(point).length === 0) {
    return ' visually-hidden';}
  return '';
};

const createEditFormTemplate = (point = BLANK_POINT) => {
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
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination.name}" list="destination-list-1">
        <datalist id="destination-list-1">
        ${createEditFormDestinationsTemplate(point)}
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
        <input class="event__input  event__input--price" id="event-price-1" name="event-price" value="${basePrice}" type="number" step="1" min="1">
      </div>

      <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
      <button class="event__reset-btn" type="reset">Delete</button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </header>
    <section class="event__details">
      <section class="event__section  event__section--offers${hideOffersSection(point)}">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>
        <div class="event__available-offers">
        ${createChosenOffersList(offers)}
        ${createExtraOffersList(offers, getPossibleOffers(point))}
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
  constructor (point, typeOffers) {
    super();
    //this._point = point;
    this._state = EditForm.parsePointToState(point);
    this._datepickerFrom = null;
    this._datepickerTo = null;

    this._typeOffers = typeOffers;
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
    return createEditFormTemplate(this._state, this._typeOffers);
  }

  restoreHandlers () {
    this._setInnerHandlers();
    this._setDatepickerFrom();
    this._setDatepickerTo();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setDeleteClickHandler(this._callback.deleteClick);
    this.setExitClickHandler(this._callback.click);
  }

  _setDatepickerFrom() {
    if (this._datepickerFrom) {
      // В случае обновления компонента удаляем вспомогательные DOM-элементы,
      // которые создает flatpickr при инициализации
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
        maxDate: this._state.dateTo, // На событие flatpickr передаём наш колбэк
      },
    );
  }

  _setDatepickerTo() {
    if (this._datepickerTo) {
      // В случае обновления компонента удаляем вспомогательные DOM-элементы,
      // которые создает flatpickr при инициализации
      this._datepickerTo.destroy();
      this._datepickerTo = null;
    }

    this._datepickerTo = flatpickr(
      this.getElement().querySelector('[name="event-end-time"]'),
      {
        dateFormat: 'j/n/Y H:i',
        defaultDate: this._state.dateTo,
        enableTime: true,
        onClose: this._dateToChangeHandler, // На событие flatpickr передаём наш колбэк
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
      const newCheckedOffer = getPossibleOffers(this._state).slice().filter((offer) => offer.title.toLowerCase().split(' ').join('-') === evt.target.dataset.offer)[0];
      this._state.offers.push(newCheckedOffer);
      this.updateData({
        offers: this._state.offers.slice(),
      });
    }
  }

  _destinationInputHandler (evt) {
    evt.preventDefault();
    if (destinationsData.some((destination) => destination.name === evt.target.value)) {
      this.updateData({
        destination: {name: evt.target.value, description: destinationsData.filter((destination) => destination.name === evt.target.value)[0].description, pictures: destinationsData.filter((destination) => destination.name === evt.target.value)[0].pictures},
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
    );
  }

  static parseStateToPoint (state) {
    state = Object.assign({}, state);
    return state;
  }
}

