import dayjs from 'dayjs';

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

export const sortEventsByPrice = (pointA, pointB) => {

  return pointB.basePrice - pointA.basePrice;
};

export const sortEventsByDuration = (pointA, pointB) => {
  //return dayjs(taskA.dueDate).diff(dayjs(taskB.dueDate));
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
