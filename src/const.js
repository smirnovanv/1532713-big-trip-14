import dayjs from 'dayjs';
import {nanoid} from 'nanoid';

const TYPES = ['taxi', 'bus', 'train', 'ship', 'transport', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

const BLANK_POINT = {
  id: nanoid(),
  type: 'taxi',
  destination: {
    description: '',
    name: '',
    pictures: [],
  },
  dateFrom: dayjs().toDate(),
  dateTo: dayjs().toDate(),
  basePrice: '',
  offers: [],
  isFavourite: false,
};

const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

const MenuItem = {
  TABLE: 'table',
  STATS: 'stats',
};

const SortType = {
  DATE_UP: 'date-up',
  PRICE_DOWN: 'price-down',
  DURATION_DOWN: 'duration-down',
};

const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PAST: 'past',
};

export {FilterType, MenuItem, BLANK_POINT, SortType, TYPES, UserAction, UpdateType};


