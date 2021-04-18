import {getRandomInteger, generateData} from '../utils/common.js';
import {generateOffersList} from './offer.js';
import dayjs from 'dayjs';

const EVENT_TYPES = ['taxi', 'bus', 'train', 'ship', 'transport', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];
const DESTINATIONS = ['Amsterdam', 'Charmonix', 'Geneva', 'Paris', 'London'];
const DESCRIPTION_PARTS = ['Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 'Cras aliquet varius magna, non porta ligula feugiat eget.', 'Fusce tristique felis at fermentum pharetra.', 'Aliquam id orci ut lectus varius viverra.', 'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.', 'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.', 'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.', 'Sed sed nisi sed augue convallis suscipit in sed felis.', 'Aliquam erat volutpat.', 'Nunc fermentum tortor ac porta dapibus.', 'In rutrum ac purus sit amet tempus.'];
const MAX_DAYS_GAP = 2;
const MAX_HOURS_GAP = 23;
const MAX_MINUTES_GAP = 59;

const generateDescription = () => {
  const description = [];
  for (let i = 0; i < getRandomInteger(1, 5); i++) {
    description.push(DESCRIPTION_PARTS[i]);
  }

  return description.join(' ');
};

const generatePictures = () => {
  const picturesList = [];

  for (let i = 0; i < getRandomInteger(0, 5); i++) {
    const newPicture = {};
    newPicture.src = `http://picsum.photos/248/152?r=${getRandomInteger(1, 20)}`;
    newPicture.description = generateData(DESCRIPTION_PARTS);
    picturesList.push(newPicture);
  }
  return picturesList;
};

const generateDate = () => {
  const daysGap = getRandomInteger(0, MAX_DAYS_GAP);
  const hoursGap = getRandomInteger(0, MAX_HOURS_GAP);
  const minutesGap = getRandomInteger(0, MAX_MINUTES_GAP);

  return dayjs().add(daysGap, 'day').add(hoursGap, 'hour').add(minutesGap, 'minute').toDate();
};

const generateEvent = () => {
  const firstDate = generateDate();
  let secondDate;
  const getSecondDate = () => {
    secondDate = generateDate();
    while (secondDate < firstDate) {
      getSecondDate();
    }
    return secondDate;
  };

  return {
    type: generateData(EVENT_TYPES),
    destination: {
      description: generateDescription(),
      name: generateData(DESTINATIONS),
      pictures: generatePictures(),
    },
    dateFrom: firstDate,
    dateTo: getSecondDate(),
    basePrice: getRandomInteger(100, 500),
    offers: generateOffersList(),
    isFavourite: Boolean(getRandomInteger(0, 1)),
  };
};

export {generateEvent};
