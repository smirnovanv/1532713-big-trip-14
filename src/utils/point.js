import dayjs from 'dayjs';
import {possibleOffers} from '../const.js';

const getPossibleOffers = (point) => {
  const currentType = point.type;
  return possibleOffers.filter((offer) => offer.type === currentType)[0].offers;
};

const formatedFullDate = (date) => {return dayjs(date).format('D/MM/YY HH:mm');};

const sortEventsByDate = (pointA, pointB) => {
  return pointA.dateFrom - pointB.dateFrom;
};

export const sortEventsByPrice = (pointA, pointB) => {

  return pointB.basePrice - pointA.basePrice;
};

const getDuration = (point) => {
  return dayjs(point.dateTo) - dayjs(point.dateFrom);
};

export const sortEventsByDuration = (pointA, pointB) => {
  return getDuration(pointB) - getDuration(pointA);
};

const formatMonthDayDate = (date) => {
  return dayjs(date).format('MMM D');
};

const formatDayDate = (date) => {
  return dayjs(date).format('D');
};

const getFormat = (firstDate, secondDate) => {
  if (Date.parse(secondDate) - Date.parse(firstDate) > 86399999) {
    return 'MM/D HH:mm';
  } else {
    return 'HH:mm';
  }
};

const formatDateFrom = (firstDate, secondDate) => {
  return dayjs(firstDate).format(getFormat(firstDate, secondDate));
};

const formatDateTo = (firstDate, secondDate) => {
  return dayjs(secondDate).format(getFormat(firstDate, secondDate));
};

export const isDateSame = (dateA, dateB) => {
  return dayjs(dateA).isSame(dateB);
};

export const isDurationSame = (pointA, pointB) => {
  return getDuration(pointA) === getDuration(pointB);
};

export const isPriceSame = (priceA, priceB) => {
  return priceA === priceB;
};

export {formatedFullDate, sortEventsByDate, formatMonthDayDate, formatDayDate, formatDateFrom, formatDateTo, getPossibleOffers};
