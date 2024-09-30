<!-- CurrencyDisplay.vue -->
<template>
  <div v-if="gold > 0" class="flex items-center mr-2">
    <span>{{ gold }}</span>
    <img
      src="/img/currency/goldcoin.png"
      alt="Gold"
      class="ml-1 w-[14px] h-[14px]"
    />
  </div>

  <div v-if="silver > 0" class="flex items-center mr-2">
    <span>{{ silver }}</span>
    <img
      src="/img/currency/silvercoin.png"
      alt="Silver"
      class="ml-1 w-[14px] h-[14px]"
    />
  </div>

  <div v-if="copper > 0 || (gold === 0 && silver === 0)" class="flex items-center">
    <span>{{ copper }}</span>
    <img
      src="/img/currency/coppercoin.png"
      alt="Copper"
      class="ml-1 w-[14px] h-[14px]"
    />
  </div>
</template>

<script setup>
const props = defineProps({
  gold: {
    type: Number,
    default: 0, 
  },
  silver: {
    type: Number,
    default: 0,
  },
  copper: {
    type: Number,
    default: 0, 
  },
});
</script>

<style scoped></style>
