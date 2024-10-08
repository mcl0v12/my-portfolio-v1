<!-- Achievments.vue -->
<template>
  <section id="achievments">
    <div
      class="max-w-base mx-auto px-base py-16 lg:py-32 text-white text-shadow leading-relaxed overflow-hidden"
      :style="{ '--animation-duration': animationDuration + 'ms' }"
    >
      <div class="flex justify-between items-center mb-6">
        <h2 class="numbered-heading heading-lg">Achievments</h2>
      </div>

      <div class="flex flex-col lg:flex-row justify-center px-base md:px-0">
        <div
          class="timeline-container w-full relative py-6 space-y-12 lg:space-y-24"
        >
          <div
            v-for="(item, index) in timelineItems"
            :key="index"
            class="timeline-item relative flex"
            :data-visible="item.isVisible"
            :timeline-text="item.timelineText"
            ref="timelineItem"
            :style="{ transitionDelay: `${index * 100}ms` }"
          >
            <div
              class="timeline-mark bg-theme-bg transition-background-color ease duration-300"
              :data-icon="item.icon"
            ></div>
            <div
              class="timeline-content relative p-5 rounded-lg transition-background-color ease duration-300"
              :style="{ animationDelay: `${index * 100}ms` }"
            >
              <h3 class="text-theme-color font-normal pb-0.5">
                {{ item.title }}
              </h3>
              <p class="mt-3">
                <strong>{{ item.subtitle }}</strong>
              </p>
              <p class="text-gray-30 mt-3">{{ item.description }}</p>
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
import FishingPanda from "~/components/characters/FisherPo/FishingPanda.vue";

const timelineItems = ref(timelineData);
const animationDuration = ref(500);

let observer = null;

const observeVisibility = (entries) => {
  entries.forEach((entry) => {
    const index = entry.target.getAttribute("data-index");
    if (entry.isIntersecting && !timelineItems.value[index].isVisible) {
      timelineItems.value[index].isVisible = true;
    }
  });
};

const addHoverEffects = () => {
  const timelineItems = document.querySelectorAll(".timeline-item");

  timelineItems.forEach((item) => {
    const mark = item.querySelector(".timeline-mark");
    const content = item.querySelector(".timeline-content");

    content.addEventListener("mouseenter", () => {
      mark.classList.add("bg-theme-bg--light");
      content.classList.add("bg-theme-bg--light");
    });
    content.addEventListener("mouseleave", () => {
      mark.classList.remove("bg-theme-bg--light");
      content.classList.remove("bg-theme-bg--light");
    });

    mark.addEventListener("mouseenter", () => {
      mark.classList.add("bg-theme-bg--light");
      content.classList.add("bg-theme-bg--light");
    });
    mark.addEventListener("mouseleave", () => {
      mark.classList.remove("bg-theme-bg--light");
      content.classList.remove("bg-theme-bg--light");
    });
  });
};

onMounted(() => {
  observer = new IntersectionObserver(observeVisibility, {
    threshold: 0.5,
  });

  const timelineElements = document.querySelectorAll(".timeline-item");
  timelineElements.forEach((el, index) => {
    el.setAttribute("data-index", index);
    observer.observe(el);
  });

  addHoverEffects();
});

onBeforeUnmount(() => {
  if (observer) {
    observer.disconnect();
  }
});
</script>

<style scoped></style>
