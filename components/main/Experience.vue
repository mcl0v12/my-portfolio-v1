<!-- Experience.vue -->
<template>
  <section id="experience">
    <div
      class="max-w-base mx-auto px-base py-16 lg:py-32 text-white text-shadow leading-relaxed overflow-hidden"
      :style="{ '--animation-duration': animationDuration + 'ms' }"
    >
      <div class="flex justify-between items-center mb-6">
        <h2 class="numbered-heading heading-lg">Career Milestones</h2>
      </div>

      <div class="flex flex-col lg:flex-row justify-center px-base md:px-0">
        <div
          class="timeline-container w-full relative py-6 space-y-12 lg:space-y-24"
        >
          <div
            v-for="(item, index) in timelineItems"
            :key="index"
            class="timeline-item relative flex"
            :data-icon="item.icon"
            :data-visible="item.isVisible"
            :timeline-text="item.timelineText"
            ref="timelineItem"
          >
            <div class="timeline-content relative p-5 rounded-lg">
              <h3 class="text-theme-color font-special font-normal pb-0.5">{{ item.title }}</h3>
              <p class="mt-3"><strong>{{ item.subtitle }}</strong></p>
              <p class="text-gray-30  mt-3" >{{ item.description }}</p>
              <p class="md:hidden mt-3">{{ item.timelineText }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <FishingPanda />
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { timelineItems as timelineData } from "@/data/experienceData";
import FishingPanda from "~/components/characters/FishingPanda.vue";

const timelineItems = ref(timelineData);
const animationDuration = ref(500);

let observer = null;

const observeVisibility = (entries) => {
  entries.forEach((entry) => {
    const index = entry.target.getAttribute('data-index');

    if (entry.isIntersecting && !timelineItems.value[index].isVisible) {
      timelineItems.value[index].isVisible = true;
    }
  });
};

onMounted(() => {
  observer = new IntersectionObserver(observeVisibility, {
    threshold: 0.5, 
  });

  const timelineElements = document.querySelectorAll('.timeline-item');
  timelineElements.forEach((el, index) => {
    el.setAttribute('data-index', index); 
    observer.observe(el);
  });
});

onBeforeUnmount(() => {
  if (observer) {
    observer.disconnect();
  }
});
</script>

<style scoped>

</style>
