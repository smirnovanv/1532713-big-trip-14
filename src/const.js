const TYPES = ['taxi', 'bus', 'train', 'ship', 'transport', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
};

const SortType = {
  DATE_UP: 'date-up',
  PRICE_DOWN: 'price-down',
  DURATION_DOWN: 'duration-down',
};

const possibleOffers = [
  {
    type: 'taxi',
    offers: [
      {
        title: 'Upgrade to a business class',
        price: 120,
      }, {
        title: 'Choose the radio station',
        price: 60,
      },
    ]},
  {
    type: 'bus',
    offers: [
      {
        title: 'Open your window',
        price: 10,
      }, {
        title: 'Choose seats',
        price: 30,
      },
    ],
  },
  {
    type: 'train',
    offers: [
      {
        title: 'Upgrade to comfort',
        price: 100,
      }, {
        title: 'Choose lunch',
        price: 60,
      },
    ],
  },
  {
    type: 'ship',
    offers: [
      {
        title: 'Choose dinner',
        price: 90,
      }, {
        title: 'Choose the room',
        price: 80,
      },
    ],
  },
  {
    type: 'transport',
    offers: [],
  },
  {
    type: 'drive',
    offers: [
      {
        title: 'Add luggage',
        price: 100,
      }, {
        title: 'Choose music',
        price: 20,
      },
    ],
  },
  {
    type: 'flight',
    offers: [
      {
        title: 'Add luggage',
        price: 100,
      }, {
        title: 'Extra meal',
        price: 20,
      },
    ],
  },
  {
    type: 'check-in',
    offers: [
      {
        title: 'Extra room',
        price: 100,
      }, {
        title: 'Conditioner',
        price: 20,
      },
    ],
  },
  {
    type: 'sightseeing',
    offers: [
      {
        title: 'Add photoshoot',
        price: 100,
      }, {
        title: 'Extra tour',
        price: 20,
      },
    ],
  },
  {
    type: 'restaurant',
    offers: [
      {
        title: 'Add beverages',
        price: 100,
      }, {
        title: 'Choose place',
        price: 20,
      },
    ],
  },
];

export {SortType, TYPES, possibleOffers, UserAction, UpdateType};


