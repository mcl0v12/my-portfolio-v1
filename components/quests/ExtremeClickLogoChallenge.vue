<!-- ExtremeClickLogoChallenge.vue -->

<template>
  <div class="px-5">
    <!-- Quest Text -->
    <h1 class="heading-base font-special font-bold mb-3">
      {{ quest.title }}
    </h1>
    <p class="mb-3">Click the logo 20 times.</p>
    <p class="mb-3">0/20 Logo Clicks</p>

    <!-- Quest Objective -->
    <h2 class="heading-base font-special mb-3">Quest Objective:</h2>
    <p class="mb-3">Click the logo 20 times to complete this challenge.</p>

    <!-- Rewards Section -->
    <h2 class="heading-base font-special mb-3">Reward:</h2>

    <div class="flex items-center mb-3">
      <p>You will receive:</p>
      <div class="flex gap-2 ml-3">
        <CurrencyDisplay
          :gold="quest.rewards.gold"
          :silver="quest.rewards.silver"
          :copper="quest.rewards.copper"
        />
      </div>
    </div>

    <div
      class="w-full flex flex-col xl:flex-row gap-0.5 text-white text-shadow"
    >
      <div v-for="(reward, index) in rewards" :key="index" class="flex">
        <RewardBadge
          :gradientId="index"
          :imageUrl="reward.imageUrl"
          :gradientTopColor="reward.gradientTopColor"
          :gradientMidColor="reward.gradientMidColor"
          :gradientBottomColor="reward.gradientBottomColor"
        />
        <div
          class="reward-text-container w-full flex items-center rounded-lg p-2 bg-overlay-light shadow-inner"
        >
          <p>{{ reward.text }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import RewardBadge from "~/components/misc/RewardBadge.vue";
import CurrencyDisplay from "~/components/main/CurrencyDisplay.vue";
import { questData } from "~/data/questData.js";

const questId = 3; 
const quest = questData.find((item) => item.id === questId);

const rewards = [
  {
    imageUrl: "/img/questRewards/social-credit.png",
    text: `+${quest.experience} Experience`,
    gradientTopColor: "#ffcc00",
    gradientMidColor: "#ff6600",
    gradientBottomColor: "#cc3300",
  },
];
</script>

<style scoped></style>
