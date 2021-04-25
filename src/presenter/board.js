import TripEventsListView from '../view/events-list.js';
import EmptyList from '../view/empty-list.js';
import SortingView from '../view/sorting.js';
import {render, RenderPosition} from '../utils/render.js';
import PointPresenter from './point.js';
import {updateItem} from '../utils/common.js';
import {sortEventsByDate, sortEventsByPrice, sortEventsByDuration} from '../utils/point.js';
import {SortType} from '../const.js';


export default class Board {
  constructor (boardContainer) {
    this._boardContainer = boardContainer;
    this._pointPresenter = {};
    this._currentSortType = SortType.DATE_UP;

    this._sortingComponent = new SortingView();
    this._tripEventsListComponent = new TripEventsListView();
    this._emptyListComponent = new EmptyList();

    this._handlePointChange = this._handlePointChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init(boardPoints) {
    this._boardPoints = boardPoints.slice();
    this._boardPoints.sort(sortEventsByDate).reverse();
    this._sourcedBoardPoints = this._boardPoints.sort(sortEventsByDate).reverse();
    this._renderBoard();
  }

  _handleModeChange() {
    Object
      .values(this._pointPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _handlePointChange(updatedPoint) {
    this._boardPoints = updateItem(this._boardPoints, updatedPoint);
    this._sourcedBoardPoints = updateItem(this._sourcedBoardPoints, updatedPoint);
    this._pointPresenter[updatedPoint.id].init(updatedPoint);
  }

  _sortPoints (sortType) {
    // 2. Этот исходный массив задач необходим,
    // потому что для сортировки мы будем мутировать
    // массив в свойстве _boardPoints

    switch (sortType) {
      case SortType.PRICE_DOWN:
        this._boardPoints.sort(sortEventsByPrice);
        break;
      case SortType.DURATION_DOWN:
        this._boardPoints.sort(sortEventsByDuration);
        break;
      case SortType.DATE_UP:
        this._boardPoints.sort(sortEventsByDate).reverse();
        break;
      default:
        //как проверить, что дефолт работает? в каком случае нужен?
        //при редактировании пойнта, если нажать на сортировку, задача закрывается, но слушатель ESC не пропадает
        this._boardPoints = this._sourcedBoardPoints.slice();
    }
    this._currentSortType = sortType;
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._sortPoints(sortType);
    this._clearPointsList();
    this._renderPointsList();
  }

  _renderSort () {
    render(this._boardContainer, this._sortingComponent, RenderPosition.BEFOREEND);
    this._sortingComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
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

