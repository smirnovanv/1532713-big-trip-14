import dayjs from 'dayjs';

const formatedFullDate = (date) => {return dayjs(date).format('D/MM/YY HH:mm');};

const sortEventsByDate = (pointA, pointB) => {
  return pointA.dateFrom - pointB.dateFrom;
};

export const sortEventsByPrice = (pointA, pointB) => {

  return pointB.basePrice - pointA.basePrice;
};

export const sortEventsByDuration = (pointA, pointB) => {
  const getDuration = (point) => {
    return dayjs(point.dateTo) - dayjs(point.dateFrom);
  };
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

export {formatedFullDate, sortEventsByDate, formatMonthDayDate, formatDayDate, formatDateFrom, formatDateTo};
