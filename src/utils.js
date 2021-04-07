import dayjs from 'dayjs';

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const generateData = (data) => {
  return data[getRandomInteger(0, data.length - 1)];
};

const hideBlockIfEmpty = (array) => {
  if (array.length === 0) {
    return ' visually-hidden';
  } else {return '';}
};

const formatedFullDate = (date) => {return dayjs(date).format('D/MM/YY HH:mm');};

const sortEventsByDate = (points) => {
  const copiedEventsList = points.slice();
  const sortedEvents = [];

  const getEarliestEvent = () => {
    if (copiedEventsList.length === 0) {
      return '';
    } else {
      let earliestEvent = copiedEventsList[0];
      let index = 0;
      for (let i = 0; i < copiedEventsList.length; i++) {
        if (dayjs(copiedEventsList[i].dateFrom).isBefore(earliestEvent.dateFrom)) {
          earliestEvent = copiedEventsList[i];
          index++;
        }
      }
      copiedEventsList.splice(index, 1);
      sortedEvents.push(earliestEvent);
    }
  };

  while (copiedEventsList.length > 0) {
    getEarliestEvent();
  }
  return sortedEvents;
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

export {render, getRandomInteger, generateData, hideBlockIfEmpty, formatedFullDate, sortEventsByDate, formatMonthDayDate, formatDayDate, formatDateFrom, formatDateTo};
