// data/lootItems.js

export const lootItemsData = {
  chest1: [
    {
      id: 20, // Währungs-Item
      imageUrl: "/img/items/coin.png",
      title: "10 Silver, 50 Copper",
      description: "",
      rarity: "common",
      type: "currency",
      gold: 0,
      silver: 10,
      copper: 50,
    },
    {
      id: 10,
      imageUrl: "/img/items/speed.png",
      title: "X",
      description: "X",
      descriptionColor: "#08e403",
      rarity: "uncommon",
      sellPrice: { gold: 1, silver: 20, copper: 0 },
      quantity: 1,
    },
    {
      id: 11,
      imageUrl: "/img/items/key.jpg",
      title: "X",
      description: "X",
      descriptionColor: "#08e403",
      rarity: "epic",
      sellPrice: { gold: 1, silver: 50, copper: 0 },
      quantity: 1,
    },
  ],
  chest2: [
    {
      id: 21, // Währungs-Item
      imageUrl: "/img/items/coin.png",
      title: "30 Silver, 20 Copper",
      description: "",
      rarity: "common",
      type: "currency",
      gold: 0,
      silver: 50,
      copper: 20,
    },
    {
      id: 12,
      imageUrl: "/img/items/time-warp.png",
      title: "X",
      description: "X",
      descriptionColor: "#08e403",
      rarity: "epic",
      sellPrice: { gold: 1, silver: 25, copper: 0 },
      quantity: 1,
    },
    {
      id: 13,
      imageUrl: "/img/items/speed.png",
      title: "X",
      description: "X",
      descriptionColor: "#08e403",
      rarity: "rare",
      sellPrice: { gold: 1, silver: 0, copper: 0 },
      quantity: 1,
    },
  ],
};
