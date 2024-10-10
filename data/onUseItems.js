// data/onUseItems.js
export const onUseItems = [
  {
    id: 1,
    imageUrl: "/img/items/key.jpg",
    title: "Resume Key",
    description: "Use: Unlocks the resume.",
    descriptionColor: "#08e403",
    rarity: "epic",
    type: "wand",
    vendor: {
      costs: { gold: 1, silver: 30 },
      sellPrice: { gold: 1, silver: 0, copper: 0 },
      quantity: 1,
      requiredLevel: 2,
    },
  },
  {
    id: 2,
    imageUrl: "/img/items/speed.png",
    title: "Unlock Boost",
    description: "Use: Increases your treasure open speed by 200% for 10 Min.",
    descriptionColor: "#08e403",
    rarity: "rare",
    type: "ring",
    vendor: {
      costs: { gold: 2, silver: 50, copper: 0 },
      sellPrice: { gold: 1, silver: 25, copper: 0 },
      quantity: 1,
      requiredLevel: 0,
    },
  },
  {
    id: 3,
    imageUrl: "/img/items/time-warp.png",
    title: "Time Reset",
    description: "Use: Go back in time and start from new.",
    descriptionColor: "#08e403",
    rarity: "uncommon",
    type: "water",
    vendor: {
      costs: { gold: 0, silver: 30, copper: 0 },
      sellPrice: { gold: 0, silver: 15, copper: 50 },
      quantity: 1,
      requiredLevel: 0,
    },
  },
];
