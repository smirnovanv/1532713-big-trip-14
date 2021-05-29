import TripEventsListView from '../view/events-list.js';
import EmptyList from '../view/empty-list.js';
import SortingView from '../view/sorting.js';
import {render, RenderPosition, remove} from '../utils/render.js';
import PointPresenter, {State as PointPresenterViewState} from './point.js';
import PointNewPresenter from './point-new.js';
import {sortEventsByDate, sortEventsByPrice, sortEventsByDuration} from '../utils/point.js';
import {SortType, UpdateType, UserAction, FilterType} from '../const.js';
import {filter} from '../utils/filter.js';
import LoadingView from '../view/loading.js';


export default class Board {
  constructor (boardContainer, pointsModel, filterModel, api, destinations, offers) {
    this._pointsModel = pointsModel;
    this._filterModel = filterModel;
    this._boardContainer = boardContainer;
    this._pointPresenter = {};
    this._currentSortType = SortType.DATE_UP;
    this._isLoading = true;
    this._api = api;
    this._destinations = destinations;
    this._offers = offers;

    this._sortingComponent = null;

    this._tripEventsListComponent = new TripEventsListView();
    this._emptyListComponent = new EmptyList();
    this._loadingComponent = new LoadingView();

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._pointsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);

    this._pointNewPresenter = new PointNewPresenter(this._tripEventsListComponent, this._handleViewAction, this._destinations, this._offers);
  }

  init() {
    this._renderBoard();
  }

  createPoint() {
    this._currentSortType = SortType.DATE_UP;
    this._filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this._pointNewPresenter.init();
  }

  _getPoints () {
    const filterType = this._filterModel.getFilter();
    const points = this._pointsModel.getPoints();
    const filteredPoints = filter[filterType](points);

    switch (this._currentSortType) {
      case SortType.PRICE_DOWN:
        return filteredPoints.sort(sortEventsByPrice);
      case SortType.DURATION_DOWN:
        return filteredPoints.sort(sortEventsByDuration);
      case SortType.DATE_UP:
        return filteredPoints.sort(sortEventsByDate);
    }
    return filteredPoints;
  }

  _handleModeChange() {
    this._pointNewPresenter.destroy();
    Object
      .values(this._pointPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        if (update.isOnlyStar) {update.isOnlyStar = false;} else {
          this._pointPresenter[update.id].setViewState(PointPresenterViewState.SAVING);
        }
        this._api.updatePoint(update).then((response) => {
          this._pointsModel.updatePoint(updateType, response);
        }).catch(() => {
          this._pointPresenter[update.id].setViewState(PointPresenterViewState.ABORTING);
        });
        break;
      case UserAction.ADD_POINT:
        this._pointNewPresenter.setSaving();
        this._api.addPoint(update).then((response) => {
          this._pointsModel.addPoint(updateType, response);
        }).catch(() => {
          this._pointNewPresenter.setAborting();
        });
        break;
      case UserAction.DELETE_POINT:
        this._pointPresenter[update.id].setViewState(PointPresenterViewState.DELETING);
        this._api.deletePoint(update).then(() => {
          this._pointsModel.deletePoint(updateType, update);
        }).catch(() => {
          this._pointPresenter[update.id].setViewState(PointPresenterViewState.ABORTING);
        });
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
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
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
    this._sortingComponent = new SortingView(this._currentSortType);
    this._sortingComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
    render(this._boardContainer, this._sortingComponent, RenderPosition.BEFOREEND);
  }

  _renderPoint (point) {
    const pointPresenter = new PointPresenter(this._tripEventsListComponent,  this._handleViewAction,  this._handleModeChange, this._destinations, this._offers);
    pointPresenter.init(point);
    this._pointPresenter[point.id] = pointPresenter;
  }

  _renderPoints (points) {
    render(this._boardContainer, this._tripEventsListComponent, RenderPosition.BEFOREEND);
    points.forEach((point) => this._renderPoint(point));
  }

  _renderLoading() {
    render(this._boardContainer, this._loadingComponent, RenderPosition.BEFOREEND);
  }

  _renderNoPoints () {
    render(this._boardContainer, this._emptyListComponent, RenderPosition.BEFOREEND);
  }

  _clearBoard({resetSortType = false} = {}) {
    this._pointNewPresenter.destroy();

    Object
      .values(this._pointPresenter)
      .forEach((presenter) => presenter.destroy());
    this._pointPresenter = {};

    remove(this._sortingComponent);
    remove(this._emptyListComponent);
    remove(this._loadingComponent);

    if (resetSortType) {
      this._currentSortType = SortType.DATE_UP;
    }
  }

  _renderBoard () {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }

    if (this._getPoints().length < 1) {
      this._renderNoPoints();
      return;
    }

    this._renderSort();
    this._renderPoints(this._getPoints());
  }

  show() {
    document.querySelector('.trip-events').classList.remove('trip-events--hidden');
  }

  hide() {
    document.querySelector('.trip-events').classList.add('trip-events--hidden');
    this._pointNewPresenter.destroy();
    Object
      .values(this._pointPresenter)
      .forEach((presenter) => presenter.resetView());
    this._currentSortType = SortType.DATE_UP;
    this._filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
  }
}

