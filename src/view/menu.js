import AbstractView from './abstract.js';
import {MenuItem} from '../const.js';

const createMenuTemplate = () => {
  return `<nav class="trip-controls__trip-tabs  trip-tabs">
  <a class="trip-tabs__btn  trip-tabs__btn--active" data-menu-button="${MenuItem.TABLE}" href="#">Table</a>
  <a class="trip-tabs__btn" data-menu-button="${MenuItem.STATS}" href="#">Stats</a>
</nav>`;
};

export default class Menu extends AbstractView {
  constructor() {
    super();

    this._menuClickHandler = this._menuClickHandler.bind(this);
  }

  getTemplate() {
    return createMenuTemplate();
  }

  _menuClickHandler(evt) {
    evt.preventDefault();
    this._callback.menuClick(evt.target.dataset.menuButton);
  }

  setMenuClickHandler(callback) {
    this._callback.menuClick = callback;
    this.getElement().addEventListener('click', this._menuClickHandler);
  }

  setMenuItem(menuItem) {
    const menuButtons = this.getElement().querySelectorAll('.trip-tabs__btn');
    menuButtons.forEach((button) => {
      if (button.dataset.menuButton === menuItem) {button.classList.add('trip-tabs__btn--active');
      } else {
        button.classList.remove('trip-tabs__btn--active');
      }
    });
  }
}
