<!-- Work.vue -->

<template>
  <section id="work">
    <div
      class="max-w-base mx-auto px-base py-16 lg:py-24 text-white text-shadow leading-relaxed"
    >
      <h2 class="numbered-heading heading-lg mb-6">Collection
        <span class="text-sm text-gray-400 ml-2">(more coming soon)</span>
      </h2>

      <ul class="space-y-6 lg:space-y-16">
        <li v-for="project in projects" :key="project.id" class="project-item">
          <div class="project-content">
            <p class="text-sm text-theme-color font-special mb-2">
              {{ project.overline }}
            </p>
            <h3 class="heading-lg mb-6">{{ project.title }}</h3>

            <div class="project-description-wrapper">
              <p class="text-gray-30">{{ project.description }}</p>
            </div>

            <ul class="project-tech-list flex flex-wrap space-x-3 text-sm text-gray-30 mt-6">
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
                  class="w-[20px] mr-2"
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
                  class="w-[20px] mr-2"
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
  import Chest from '~/components/misc/Chest.vue';
  
const projects = projectsData;
</script>

<style scoped>
/* Projektstruktur */
.project-item {
  display: grid;
  min-height: 350px;
}

.project-item .project-content {
  grid-column: 1 / -1;
  grid-row: 1 / -1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 20px;
}

.project-item .project-image {
  grid-column: 1 / -1;
  grid-row: 1 / -1;
  position: relative;
  z-index: -1;
}

.project-item .project-image img {
  height: 100%;
  overflow: hidden;
  border-radius: 5px;
}

.project-item .project-image::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(10, 30, 64, 0.9);
  mix-blend-mode: multiply;
  transition: background-color 300ms ease;
}

@media (min-width: 769px) {
  .project-item .project-image:hover::after {
    background-color: rgba(0, 0, 0, 0);
  }

  .project-item {
    grid-template-columns: repeat(12, 1fr);
    align-items: center;
  }
  .project-item .project-description-wrapper {
    padding: 1.5rem;
    border-radius: 5px;
    background: #162b5c;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
    z-index: 2;
  }

  .project-item .project-content {
    grid-column: 1 / 9;
    grid-row: 1;
    padding: 0;
    text-align: left;
  }

  .project-item:nth-of-type(2n + 1) .project-content {
    grid-column: 5 / -1;
    text-align: right;
  }

  .project-item .project-image {
    grid-column: 6 / -1;
    grid-row: 1;
    opacity: 1;
    z-index: 1;
  }

  .project-item:nth-of-type(2n + 1) .project-image {
    grid-column: 1 / 8;
  }

  .project-item .project-tech-list {
    justify-content: flex-start;
  }

  .project-item:nth-of-type(2n + 1) .project-tech-list {
    justify-content: flex-end;
  }

  .project-item .project-links {
    justify-content: flex-start;
  }

  .project-item:nth-of-type(2n + 1) .project-links {
    justify-content: flex-end;
  }
}

@media (min-width: 900px) {
  .project-item .project-content {
    grid-column: 1 / 7;
    grid-row: 1;
  }

  .project-item:nth-of-type(2n + 1) .project-content {
    grid-column: 7 / -1;
  }
}
</style>
