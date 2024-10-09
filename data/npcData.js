// npcData.js

import ElitePlayerFrame from "~/components/main/character-components/ElitePlayerFrame.vue";
import ModalImage from "~/components/main/character-components/ModalImage.vue";
import MeTalk from "~/components/characters/Me/Talk.vue";
import FisherPoTalk from "~/components/characters/FisherPo/Talk.vue";

export const npcData = {
  fabian: {
    id: 'fabian',
    name: "Grand Marshal Fabian",
    imageSrc: "/img/char-profile.png",
    FrameComponent: ElitePlayerFrame,
    TalkComponent: MeTalk,
    quests: [1, 2, 3, 99], 
  },
  fisherPo: {
    id: 'fisherPo',
    name: "Fisher Po",
    imageSrc: "/img/fisher-po.png",
    FrameComponent: ModalImage,
    TalkComponent: FisherPoTalk,
    quests: [1], 
  },
};
