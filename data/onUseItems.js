// data/onUseItems.js
export const onUseItems = [
  {
    id: 1,
    imageUrl: "/img/items/key.jpg",
    text: "Resume Key",
    description: "Use: Unlocks the resume.",
    rarity: "epic",
    costs: { gold: 1, silver: 30 },
    sellPrice: { gold: 0, silver: 75, copper: 0 },
    quantity: 1,
    requiredLevel: 2,  // Level-Anforderung hinzugefügt
  },
  {
    id: 2,
    imageUrl: "/img/items/speed.png",
    text: "Unlock Boost",
    description: "Use: Increases your treasure open speed by 200% for 10 Min.",
    rarity: "rare",
    costs: { gold: 2, silver: 50, copper: 0 },
    sellPrice: { gold: 1, silver: 25, copper: 0 },
    quantity: 1,
    requiredLevel: 0,  // Kein Level-Requirement
  },
  {
    id: 3,
    imageUrl: "/img/items/time-warp.png",
    text: "Time Reset",
    description: "Use: Go back in time and start from new.",
    rarity: "uncommon",
    costs: { gold: 0, silver: 30, copper: 0 },
    sellPrice: { gold: 0, silver: 15, copper: 50 },
    quantity: 1,
    requiredLevel: 0,  // Kein Level-Requirement
  },
];
