import TripEventsListView from '../view/events-list.js';
import EmptyList from '../view/empty-list.js';
import SortingView from '../view/sorting.js';
import {render, RenderPosition, remove} from '../utils/render.js';
import PointPresenter from './point.js';
import PointNewPresenter from './point-new.js';
import {sortEventsByDate, sortEventsByPrice, sortEventsByDuration} from '../utils/point.js';
import {SortType, UpdateType, UserAction, FilterType} from '../const.js';
import {filter} from '../utils/filter.js';


export default class Board {
  constructor (boardContainer, pointsModel, filterModel) {
    this._pointsModel = pointsModel;
    this._filterModel = filterModel;
    this._boardContainer = boardContainer;
    this._pointPresenter = {};
    this._currentSortType = SortType.DATE_UP;

    this._sortingComponent = null;

    this._tripEventsListComponent = new TripEventsListView();
    this._emptyListComponent = new EmptyList();

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._pointsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);

    this._pointNewPresenter = new PointNewPresenter(this._tripEventsListComponent, this._handleViewAction);
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
    this._pointNewPresenter.destroy();

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

