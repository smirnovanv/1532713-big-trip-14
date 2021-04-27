import RoutePointView from '../view/route-point.js';
import EditFormView from '../view/edit-form.js';
import {generatePossibleOffers} from '../mock/offer.js';
import {render, RenderPosition, replace, remove} from '../utils/render.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class Point {
  constructor (pointsListContainer, changeData, changeMode) {
    this._pointsListContainer = pointsListContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._pointComponent = null;
    this._pointEditComponent = null;
    this._mode = Mode.DEFAULT;

    this._handleEditClick = this._handleEditClick.bind(this);
    this._handleFavouriteClick = this._handleFavouriteClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._handleExitClick = this._handleExitClick.bind(this);
  }

  init (point) {
    this._point = point;

    const prevPointComponent = this._pointComponent;
    const prevEditComponent = this._pointEditComponent;

    this._offers = generatePossibleOffers();
    this._pointComponent = new RoutePointView(point);
    this._pointEditComponent = new EditFormView(point, this._offers);

    this._pointComponent.setEditClickHandler(this._handleEditClick);
    this._pointComponent.setFavouriteClickHandler(this._handleFavouriteClick);
    this._pointEditComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._pointEditComponent.setExitClickHandler(this._handleExitClick);

    if (prevPointComponent === null || prevEditComponent === null) {
      render(this._pointsListContainer, this._pointComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._pointComponent, prevPointComponent);
    }

    if (this._mode === Mode.EDITING) {
      replace(this._pointEditComponent, prevEditComponent);
    }

    remove(prevPointComponent);
    remove(prevEditComponent);
  }

  destroy () {
    remove(this._pointComponent);
    remove(this._pointEditComponent);
    document.removeEventListener('keydown', this._escKeyDownHandler);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceFormByPoint();
    }
  }

  _replacePointByForm () {
    replace(this._pointEditComponent, this._pointComponent);
    document.removeEventListener('keydown', this._escKeyDownHandler);
    this._changeMode();
    this._mode = Mode.EDITING;
  }

  _replaceFormByPoint () {
    replace(this._pointComponent, this._pointEditComponent);
    document.removeEventListener('keydown', this._escKeyDownHandler);
    this._mode = Mode.DEFAULT;
  }

  _escKeyDownHandler (evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._replaceFormByPoint();
    }
  }

  _handleFavouriteClick () {
    this._changeData(
      Object.assign(
        {},
        this._point,
        {
          isFavourite: !this._point.isFavourite,
        },
      ),
    );
  }

  _handleEditClick () {
    this._replacePointByForm();
    document.addEventListener('keydown', this._escKeyDownHandler);
  }

  _handleFormSubmit () {
    this._replaceFormByPoint();
  }

  _handleExitClick () {
    this._replaceFormByPoint();
  }
}
