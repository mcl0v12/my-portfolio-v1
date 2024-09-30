<!-- SuccessPopup.vue -->
<template>
    <div
      v-if="show"
      ref="popupOverlay"
      class="popup opacity-100 w-full h-full fixed inset-0 bg-overlay flex flex-center px transition-opacity ease duration-200 z-[1000]"
    >
      <div class="bg-theme-bg text-center p-6 rounded-lg shadow-lg" @click.stop>
        <h4 class="text-xl mb-4">Thanks for contacting me!</h4>
        <p class="text-sm mb-6">
          I’ll be in touch with you personally soon :)
        </p>
        <ThemeButton
          :height="30"
          buttonText="Close"
          :buttonTextSize="14"
          @click="closePopup"
        />
      </div>
    </div>
  </template>
  
  <script setup>
  import { watch, nextTick } from 'vue';
  import ThemeButton from '~/components/misc/ThemeButton.vue';
  
  const props = defineProps({
    show: {
      type: Boolean,
      default: false,
    },
  });
  
  const emit = defineEmits(['close']);
  
  const closePopup = () => {
    leave();
  };
  
  const enter = () => {
    const el = document.querySelector('.popup');
    if (el) {
      document.body.classList.add('overflow-hidden');
      nextTick(() => {
        requestAnimationFrame(() => {
          el.classList.remove('opacity-0');
          el.classList.add('opacity-100');
        });
      });
    }
  };
  
  const leave = () => {
    const el = document.querySelector('.popup');
    if (el) {
      el.classList.remove('opacity-100');
      el.classList.add('opacity-0');
      el.addEventListener(
        'transitionend',
        () => {
          document.body.classList.remove('overflow-hidden');
          emit('close');
        },
        { once: true }
      );
    }
  };
  
  watch(
    () => props.show,
    (newVal) => {
      if (newVal) {
        nextTick(() => {
          enter();
        });
      }
    }
  );
  </script>
  
  <style scoped>

  </style>
  