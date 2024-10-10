<!-- Collection.vue -->

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
        <!-- Erste Schleife -->
        <li
          v-for="(project, index) in projects.slice(0, 2)"
          :key="project.id"
          :style="{ transitionDelay: `${index * 100}ms` }"
          class="project-item fly-item"
          :ref="animationRef"
          :class="{ 'project-right': index % 2 === 0, 'project-left': index % 2 !== 0 }"
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
              class="project-tech-list flex flex-wrap gap-3 text-sm text-gray-30 mt-6"
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
                <img src="/svg/github.svg" alt="GitHub" class="w-[20px]" />
              </a>
              <a
                v-if="project.external"
                :href="project.external"
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center"
              >
                <img
                  src="/svg/external.svg"
                  alt="External Link"
                  class="w-[20px] text-white"
                />
              </a>
            </div>
          </div>

          <div class="project-image">
            <img :src="project.image" :alt="`${project.title} Image`" />
          </div>
        </li>

        <!-- Chest-Element -->
        <li class="w-[300px] md:w-[400px] py-8 lg:py-14 mx-auto">
          <Chest :chestId="'chest1'" />
        </li>

        <!-- Zweite Schleife mit angepasstem Index -->
        <li
          v-for="(project, projectIndex) in projects.slice(2)"
          :key="project.id"
          :style="{ transitionDelay: `${(projectIndex + 2) * 100}ms` }"
          class="project-item fly-item"
          :ref="animationRef"
          :class="{ 'project-right': projectIndex % 2 === 0, 'project-left': projectIndex % 2 !== 0 }"
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
              class="project-tech-list flex flex-wrap gap-3 text-sm text-gray-30 mt-6"
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
                <img src="/svg/github.svg" alt="GitHub" class="w-[20px]" />
              </a>
              <a
                v-if="project.external"
                :href="project.external"
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center"
              >
                <img
                  src="/svg/external.svg"
                  alt="External Link"
                  class="w-[20px] text-white"
                />
              </a>
            </div>
          </div>

          <div class="project-image">
            <img :src="project.image" :alt="`${project.title} Image`" />
          </div>
        </li>
      </ul>
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
