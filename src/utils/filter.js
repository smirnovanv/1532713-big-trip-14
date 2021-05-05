import {FilterType} from '../const';
import {isFutureDate, isPastDate} from './point';

export const filter = {
  [FilterType.EVERYTHING]: (points) => points.slice(),
  [FilterType.FUTURE]: (points) => points.filter((point) => isFutureDate(point)),
  [FilterType.PAST]: (points) => points.filter((point) => isPastDate(point)),
};
