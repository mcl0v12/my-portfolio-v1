<!-- Work.vue -->

<template>
  <section id="collection">
    <div
      class="max-w-base mx-auto px-base py-16 lg:py-24 text-white text-shadow leading-relaxed"
    >
      <h2 class="numbered-heading heading-lg mb-6">
        Collection
        <span class="text-sm text-gray-400 ml-2">(more coming soon)</span>
      </h2>

      <ul class="space-y-6 lg:space-y-16">
        <li
        v-for="(project, index) in projects"
        :key="project.id"
        :style="{ transitionDelay: `${index * 100}ms` }"
        class="project-item fly-item"
        :ref="animationRef"
        data-animation="enter-up"
        >
          <div class="project-content">
            <p class="text-sm text-theme-color mb-2">
              {{ project.overline }}
            </p>
            <h3 class="heading-lg mb-6">{{ project.title }}</h3>

            <div class="project-description-wrapper">
              <p class="text-gray-30">{{ project.description }}</p>
            </div>

            <ul
              class="project-tech-list flex flex-wrap space-x-3 text-sm text-gray-30 mt-6"
            >
              <li v-for="tool in project.tools" :key="tool.name">
                {{ tool.name }}
              </li>
            </ul>

            <div class="project-links mt-6 flex space-x-3">
              <a
                v-if="project.github"
                :href="project.github"
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  role="img"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="w-[20px]"
                >
                  <title>GitHub</title>
                  <path
                    d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77A5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"
                  ></path>
                </svg>
              </a>

              <a
                v-if="project.external"
                :href="project.external"
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  role="img"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="w-[20px]"
                >
                  <title>External Link</title>
                  <path
                    d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"
                  ></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
              </a>
            </div>
          </div>

          <div class="project-image">
            <img :src="project.image" :alt="`${project.title} Image`" />
          </div>
        </li>
      </ul>

      <div class="py-8 lg:py-14">
        <Chest :chestId="'chest1'" />
      </div>

      <div class="py-8 lg:py-14">
        <Chest :chestId="'chest2'" />
      </div>
    </div>
  </section>
</template>

<script setup>
import { projectsData } from "@/data/projectsData.js";
import Chest from "~/components/misc/Chest.vue";
import { animationObserver } from "~/composables/useIntersectionObserver";

const projects = projectsData;

const intersectionItems = ref([]);

const animationRef = (el) => {
  if (el) {
    intersectionItems.value.push(el);
  }
};

animationObserver([intersectionItems]);
</script>

<style scoped></style>
