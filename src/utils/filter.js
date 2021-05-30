import {FilterType} from '../const';
import {isFutureDate, isPastDate, isFutureAndPastDate} from './point';

export const filter = {
  [FilterType.EVERYTHING]: (points) => points.slice(),
  [FilterType.FUTURE]: (points) => points.filter((point) => isFutureDate(point) || isFutureAndPastDate(point)),
  [FilterType.PAST]: (points) => points.filter((point) => isPastDate(point) || isFutureAndPastDate(point)),
};
