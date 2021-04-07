import {sortEventsByDate, formatMonthDayDate, formatDayDate} from '../utils.js';

const calculateCost = (points) => {
  let totalCost = 0;
  points.forEach((event) => {
    totalCost = totalCost + event.basePrice;
    event.offers.forEach((offer) => {
      totalCost = totalCost + offer.price;
    });
  });
  return totalCost;
};

const getRouteInfo = (points) => {
  if (points.length === 0) {
    return '';
  } else if (points.length === 1) {
    return points[0].destination.name;
  } else if (points.length === 2) {
    const sortedEvents = sortEventsByDate(points);
    return `<h1 class="trip-info__title">${sortedEvents[0].destination.name} &mdash; ${sortedEvents[1].destination.name}</h1>`;
  } else if (points.length === 3) {
    const sortedEvents = sortEventsByDate(points);
    return `<h1 class="trip-info__title">${sortedEvents[0].destination.name} &mdash; ${sortedEvents[1].destination.name} &mdash; ${sortedEvents[2].destination.name}</h1>`;
  } else if (points.length > 3) {
    const sortedEvents = sortEventsByDate(points);
    return `<h1 class="trip-info__title">${sortedEvents[0].destination.name} &mdash; ... &mdash; ${sortedEvents[sortedEvents.length-1].destination.name}</h1>`;
  }
};

const getDateInfo = (points) => {
  if (points.length === 0) {
    return '';
  } else if (points.length === 1) {
    return `<p class="trip-info__dates">${formatMonthDayDate(points[0].dateFrom)}</p>`;
  } else if (points.length > 1) {
    const sortedEvents = sortEventsByDate(points);
    return `<p class="trip-info__dates">${formatMonthDayDate(sortedEvents[0].dateFrom)}&nbsp;&mdash;&nbsp;${formatDayDate(sortedEvents[sortedEvents.length-1].dateTo)}</p>`;
  }
};

const createRouteInfoAndCost = (events) => {
  return `<section class="trip-main__trip-info  trip-info">
  <div class="trip-info__main">
    ${getRouteInfo(events)}

    <p class="trip-info__dates">${getDateInfo(events)}</p>
  </div>

  <p class="trip-info__cost">
    Total: &euro;&nbsp;<span class="trip-info__cost-value">${calculateCost(events)}</span>
  </p>
</section>`;
};

export {createRouteInfoAndCost};
