import TripEventsListView from '../view/events-list.js';
import EmptyList from '../view/empty-list.js';
import SortingView from '../view/sorting.js';
import {render, RenderPosition, remove} from '../utils/render.js';
import PointPresenter from './point.js';
//import {updateItem} from '../utils/common.js';
import {sortEventsByDate, sortEventsByPrice, sortEventsByDuration} from '../utils/point.js';
import {SortType, UpdateType, UserAction} from '../const.js';


export default class Board {
  constructor (boardContainer, pointsModel) {
    this._pointsModel = pointsModel;
    this._boardContainer = boardContainer;
    this._pointPresenter = {};
    this._currentSortType = SortType.DATE_UP;

    this._sortingComponent = null;

    //this._sortingComponent = new SortingView();
    this._tripEventsListComponent = new TripEventsListView();
    this._emptyListComponent = new EmptyList();

    //this._handlePointChange = this._handlePointChange.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._pointsModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._renderBoard();
  }

  _getPoints () {
    switch (this._currentSortType) {
      case SortType.PRICE_DOWN:
        return this._pointsModel.getPoints().slice().sort(sortEventsByPrice);
      case SortType.DURATION_DOWN:
        return this._pointsModel.getPoints().slice().sort(sortEventsByDuration);
      case SortType.DATE_UP:
        return this._pointsModel.getPoints().slice().sort(sortEventsByDate);
    }
    return this._pointsModel.getPoints();
  }

  _handleModeChange() {
    Object
      .values(this._pointPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this._pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this._pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this._pointsModel.deletePoint(updateType, update);
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._pointPresenter[data.id].init(data);
        break;
      case UpdateType.MINOR:
        this._clearBoard();
        this._renderBoard();
        break;
      case UpdateType.MAJOR:
        this._clearBoard({resetSortType: true});
        this._renderBoard();
        break;
    }
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearBoard();
    this._renderBoard();
  }

  _renderSort () {
    if (this._sortingComponent !== null) {
      this._sortingComponent = null;
    }
    this._sortingComponent = new SortingView(this._currentSortType);
    this._sortingComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
    render(this._boardContainer, this._sortingComponent, RenderPosition.BEFOREEND);
  }

  _renderPoint (point) {
    const pointPresenter = new PointPresenter(this._tripEventsListComponent,  this._handleViewAction,  this._handleModeChange);
    pointPresenter.init(point);
    this._pointPresenter[point.id] = pointPresenter;
  }

  _renderPoints (points) {
    render(this._boardContainer, this._tripEventsListComponent, RenderPosition.BEFOREEND);
    points.forEach((point) => this._renderPoint(point));
  }

  _renderNoPoints () {
    render(this._boardContainer, this._emptyListComponent, RenderPosition.BEFOREEND);
  }

  _clearBoard({resetSortType = false} = {}) {
    Object
      .values(this._pointPresenter)
      .forEach((presenter) => presenter.destroy());
    this._pointPresenter = {};

    remove(this._sortingComponent);
    remove(this._emptyListComponent);

    if (resetSortType) {
      this._currentSortType = SortType.DATE_UP;
    }
  }

  _renderBoard () {
    if (this._getPoints().length < 1) {
      this._renderNoPoints();
      return;
    }
    this._renderSort();
    this._renderPoints(this._getPoints());
  }
}

