// /data/questData.js

export const questData = [
  {
    id: 1,
    type: 'Talk',
    title: 'Who are you?',
    iconSrc: '/svg/speechbubble.svg',
  },
  {
    id: 2,
    type: 'Objective',
    title: 'Logo Challenge',
    experience: 500,
    rewards: { gold: 1, silver: 50, copper: 20 },
    objective: {
      progress: 0,
      total: 10,
      description: 'Logo Clicked',
    },
  },
  {
    id: 3,
    type: 'Objective',
    title: 'Logo Challenge x2',
    experience: 500,
    rewards: { gold: 5, silver: 20, copper: 80 },
    objective: {
      progress: 0,
      total: 20,
      description: 'Logo Clicked',
    },
  },
  {
    id: 99,
    type: 'Talk',
    title: 'What do you offer?',
    iconSrc: '/svg/vendor.svg',
  },
];
