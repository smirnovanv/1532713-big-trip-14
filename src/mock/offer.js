import {getRandomInteger} from '../utils.js';

const OFFERS = ['Choose meal', 'Upgrade to comfort class', 'Choose seats', 'Add luggage', 'Travel by train'];

const generateOffersList = () => {
  const shuffledOffers = OFFERS.sort(() => Math.random() - 0.5);
  const offersList = [];

  for (let i = 0; i < getRandomInteger(0, shuffledOffers.length - 1); i++) {
    const newOffer = {};
    newOffer.title = shuffledOffers[i];
    newOffer.price = getRandomInteger(10, 100);
    offersList.push(newOffer);
  }

  return offersList;
};

const generatePossibleOffers = () => {
  const shuffledOffers = OFFERS.sort(() => Math.random() - 0.5);
  const possibleOffersList = [];

  for (let i = 0; i < shuffledOffers.length; i++) {
    const newOffer = {};
    newOffer.title = shuffledOffers[i];
    newOffer.price = getRandomInteger(10, 100);
    possibleOffersList.push(newOffer);
  }

  return possibleOffersList;
};

export {generateOffersList, generatePossibleOffers};
