import dayjs from 'dayjs';

const MillisecondsData = {
  MILLISECONDS_IN_DAY: 86400000,
  MILLISECONDS_IN_HOUR: 3600000,
  MILLISECONDS_IN_MINUTE: 60000,
};

const formatFullDate = (date) => {return dayjs(date).format('D/MM/YY HH:mm');};

const sortEventsByDate = (pointA, pointB) => {
  return pointA.dateFrom - pointB.dateFrom;
};

const sortEventsByPrice = (pointA, pointB) => {

  return pointB.basePrice - pointA.basePrice;
};

const getDuration = (point) => {
  return dayjs(point.dateTo) - dayjs(point.dateFrom);
};

const sortEventsByDuration = (pointA, pointB) => {
  return getDuration(pointB) - getDuration(pointA);
};

const formatMonthDayDate = (date) => {
  return dayjs(date).format('MMM D');
};

const getFormat = (firstDate, secondDate) => {
  if (Date.parse(secondDate) - Date.parse(firstDate) >= MillisecondsData.MILLISECONDS_IN_DAY) {
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

const isDateSame = (dateA, dateB) => {
  return dayjs(dateA).isSame(dateB);
};

const isDurationSame = (pointA, pointB) => {
  return getDuration(pointA) === getDuration(pointB);
};

const isPriceSame = (priceA, priceB) => {
  return priceA === priceB;
};

const isFutureDate = (point) => {
  return dayjs(point.dateFrom).isAfter(dayjs()) || dayjs(point.dateFrom).isSame(dayjs());
};

const isPastDate = (point) => {
  return dayjs(point.dateTo).isBefore(dayjs());
};

const isFutureAndPastDate = (point) => {
  return dayjs(point.dateFrom).isBefore(dayjs()) && dayjs(point.dateTo).isAfter(dayjs());
};

const getFormattedDuration = (timeInMs) => {
  const days = Math.floor(timeInMs / MillisecondsData.MILLISECONDS_IN_DAY);
  const hours = Math.floor((timeInMs - days * MillisecondsData.MILLISECONDS_IN_DAY) / MillisecondsData.MILLISECONDS_IN_HOUR);
  const minutes = Math.floor((timeInMs - days * MillisecondsData.MILLISECONDS_IN_DAY - hours * MillisecondsData.MILLISECONDS_IN_HOUR) / MillisecondsData.MILLISECONDS_IN_MINUTE);

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

export {isFutureAndPastDate, isPastDate, isFutureDate, isPriceSame, isDurationSame, isDateSame, sortEventsByDuration, getDuration, sortEventsByPrice, getFormattedDuration, formatFullDate, sortEventsByDate, formatMonthDayDate, formatDateFrom, formatDateTo};
