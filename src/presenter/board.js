import TripEventsListView from '../view/events-list.js';
import EmptyList from '../view/empty-list.js';
import SortingView from '../view/sorting.js';
import {render, RenderPosition} from '../utils/render.js';
import PointPresenter from './point.js';
import {updateItem} from '../utils/common.js';


export default class Board {
  constructor (boardContainer) {
    this._boardContainer = boardContainer;
    this._pointPresenter = {};

    this._sortingComponent = new SortingView();
    this._tripEventsListComponent = new TripEventsListView();
    this._emptyListComponent = new EmptyList();

    this._handlePointChange = this._handlePointChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
  }

  init(boardPoints) {
    this._boardPoints = boardPoints.slice();
    this._renderBoard();
  }

  _handleModeChange() {
    Object
      .values(this._pointPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _handlePointChange(updatedPoint) {
    this._boardPoints = updateItem(this._boardPoints, updatedPoint);
    this._pointPresenter[updatedPoint.id].init(updatedPoint);
  }

  _renderSort () {
    render(this._boardContainer, this._sortingComponent, RenderPosition.BEFOREEND);
  }

  _renderPoint (point) {
    const pointPresenter = new PointPresenter(this._tripEventsListComponent,  this._handlePointChange,  this._handleModeChange);
    pointPresenter.init(point);
    this._pointPresenter[point.id] = pointPresenter;
  }

  _renderPoints () {
    this._boardPoints.forEach((boardPoint) => this._renderPoint(boardPoint));
  }

  _clearPointsList () {
    Object.values(this._pointPresenter).forEach((presenter) => presenter.destroy());
    this._pointPresenter = {};
  }

  _renderPointsList () {
    render(this._boardContainer, this._tripEventsListComponent, RenderPosition.BEFOREEND);
    this._renderPoints();
  }

  _renderNoPoints () {
    render(this._boardContainer, this._emptyListComponent, RenderPosition.BEFOREEND);
  }

  _renderBoard () {
    if (this._boardPoints < 1) {
      this._renderNoPoints();
      return;
    }
    //отрисовку меню выпустила
    this._renderSort();
    this._renderPointsList();
  }
}

