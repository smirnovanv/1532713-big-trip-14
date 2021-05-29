import dayjs from 'dayjs';

const formatedFullDate = (date) => {return dayjs(date).format('D/MM/YY HH:mm');};

const sortEventsByDate = (pointA, pointB) => {
  return pointA.dateFrom - pointB.dateFrom;
};

export const sortEventsByPrice = (pointA, pointB) => {

  return pointB.basePrice - pointA.basePrice;
};

export const getDuration = (point) => {
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

export const isFutureDate = (point) => {
  return dayjs(point.dateFrom).isAfter(dayjs()) || dayjs(point.dateFrom).isSame(dayjs());
};

export const isPastDate = (point) => {
  return dayjs(point.dateTo).isBefore(dayjs());
};

const getFormattedDuration = (timeInMs) => {
  const days = Math.floor(timeInMs / 86400000);
  const hours = Math.floor((timeInMs - days * 86400000) / 3600000);
  const minutes = Math.floor((timeInMs - days * 86400000 - hours * 3600000) / 60000);

  let formattedDays = days.toString();
  if (formattedDays.length < 2) {formattedDays = '0' + formattedDays;}

  let formattedHours = hours.toString();
  if (formattedHours.length < 2) {formattedHours = '0' + formattedHours;}

  let formattedMinutes = minutes.toString();
  if (formattedMinutes.length < 2) {formattedMinutes = '0' + formattedMinutes;}

  if (days > 0) {
    return `${formattedDays}D ${formattedHours}H ${formattedMinutes}M`;
  } else if (hours > 0) {
    return `${formattedHours}H ${formattedMinutes}M`;
  } else {
    return `${formattedMinutes}M`;
  }
};

export {getFormattedDuration, formatedFullDate, sortEventsByDate, formatMonthDayDate, formatDayDate, formatDateFrom, formatDateTo};
