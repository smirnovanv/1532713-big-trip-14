import dayjs from 'dayjs';

const createRouteInfoAndCost = (events) => {
  const calculateCost = () => {
    let totalCost = 0;
    events.forEach((event) => {
      totalCost = totalCost + event.basePrice;
      event.offers.forEach((offer) => {
        totalCost = totalCost + offer.price;
      });
    });
    return totalCost;
  };

  const sortEventsByDate = () => {

    const copiedEventsList = events.slice();
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

  const getRouteInfo = () => {
    if (events.length === 0) {
      return '';
    } else if (events.length === 1) {
      return events[0].destination.name;
    } else if (events.length === 2) {
      const sortedEvents = sortEventsByDate();
      return `<h1 class="trip-info__title">${sortedEvents[0].destination.name} &mdash; ${sortedEvents[1].destination.name}</h1>`;
    } else if (events.length === 3) {
      const sortedEvents = sortEventsByDate();
      return `<h1 class="trip-info__title">${sortedEvents[0].destination.name} &mdash; ${sortedEvents[1].destination.name} &mdash; ${sortedEvents[2].destination.name}</h1>`;
    } else if (events.length > 3) {
      const sortedEvents = sortEventsByDate();
      return `<h1 class="trip-info__title">${sortedEvents[0].destination.name} &mdash; ... &mdash; ${sortedEvents[sortedEvents.length-1].destination.name}</h1>`;
    }
  };

  const getDateInfo = () => {
    if (events.length === 0) {
      return '';
    } else if (events.length === 1) {
      return `<p class="trip-info__dates">${dayjs(events[0].dateFrom).format('MMM D')}</p>`;
    } else if (events.length > 1) {
      const sortedEvents = sortEventsByDate();
      return `<p class="trip-info__dates">${dayjs(sortedEvents[0].dateFrom).format('MMM D')}&nbsp;&mdash;&nbsp;${dayjs(sortedEvents[sortedEvents.length-1].dateTo).format('D')}</p>`;
    }

  };

  return `<section class="trip-main__trip-info  trip-info">
  <div class="trip-info__main">
    ${getRouteInfo()}

    <p class="trip-info__dates">${getDateInfo()}</p>
  </div>

  <p class="trip-info__cost">
    Total: &euro;&nbsp;<span class="trip-info__cost-value">${calculateCost()}</span>
  </p>
</section>`;
};

export {createRouteInfoAndCost};
