// data/questItems.js
import { iconPaths } from '~/data/questPaths.js';

export const questItems = [
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
    iconSvg: {
      paths: iconPaths.exclamationMark,  
    },
    questionMarkPaths: iconPaths.questionMark,  
    experience: 500,
    rewards: { gold: 1, silver: 50, copper: 20 }, 
  },
  {
    id: 3,
    type: 'Objective',
    title: 'Logo Challenge x2',
    iconSvg: {
      paths: iconPaths.exclamationMark,  
    },
    questionMarkPaths: iconPaths.questionMark,  
    experience: 500,
    rewards: { gold: 5, silver: 20, copper: 80 }, 
  },
  {
    id: 99,
    type: 'Talk',
    title: 'What do you offer?',
    iconSrc: '/svg/vendor.svg',
  },
];
