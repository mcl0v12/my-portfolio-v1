<!-- ContactModal.vue -->

<template>
  <div
    v-if="isLoaded"
    class="fixed inset-0 flex justify-center items-center z-[900]"
  >
    <div
      class="max-w-base w-full px-base relative flex justify-center hr:justify-start"
    >
      <div
        class="relative"
        ref="svgContainer"
        :style="{
          width: containerWidth + 'px',
          height: containerHeightStyle,
        }"
      >
        <svg
          :width="svgWidth"
          :height="svgHeight"
          :viewBox="`0 0 ${containerWidth} ${containerHeight}`"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient
              id="metalGradient"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stop-color="#dddddd" stop-opacity="1" />
              <stop offset="50%" stop-color="#777777" stop-opacity="1" />
              <stop offset="100%" stop-color="#444444" stop-opacity="1" />
            </linearGradient>

            <!-- General Clip-Path for all corners -->
            <clipPath :id="cutCornersId">
              <polygon
                :points="
                  scalePoints(
                    '4.5,12.25 12.25,4.5 437.75,4.5 445.5,12.25 445.5,587.75 437.75,595.5 12.25,595.5 4.5,587.75'
                  )
                "
              />
            </clipPath>
          </defs>
          <!-- Outer Polygon -->
          <polygon
            :points="
              scalePoints('1,10 10,1 440,1 449,10 449,590 440,599 10,599 1,590')
            "
            fill="url(#metalGradient)"
            stroke="black"
            stroke-width="1"
          ></polygon>
          <!-- Inner Polygon -->
          <polygon
            :points="
              scalePoints('4,12 12,4 438,4 446,12 446,588 438,596 12,596 4,588')
            "
            fill="none"
            stroke="black"
            stroke-width="1"
          ></polygon>
        </svg>

        <ModalImage
          imageSrc="/img/letters.png"
          wrapperClass="max-w-[18vw] md:max-w-[100px] -translate-x-1/2 -translate-y-1/2 absolute top-[25px] left-[25px] z-[3]"
          patternId="lettersPattern"
        />
        <div
          :class="['absolute light-gradient-to-b top-0 left-0']"
          :style="wrapperStyle"
        >
          <div class="element-wrap">
            <!-- Top Element -->
            <div class="relative" :style="topDivStyle">
              <div class="top-wrap">
                <p
                  class="w-full text-sm text-theme-color text-shadow flex flex-center ml-[18vw] md:ml-[100px] mr-[30px]"
                >
                  Send Mail
                </p>
                <CloseModalButton
                  :width="30"
                  :height="30"
                  symbol="X"
                  @click="closeModal"
                />
              </div>

              <div class="input-wrapper">
                <!-- Name Input -->
                <div class="input-group">
                  <label class="md:ml-5" for="name">From:</label>
                  <div class="input-container">
                    <input
                      id="name"
                      type="text"
                      class="name_input"
                      placeholder="Your Name"
                      v-model="mailStore.name"
                      @blur="validateNameOnBlur"
                    />
                  </div>
                  <p
                    class="font-default"
                    :class="{ 'text-notice-color': isLessThan30Copper }"
                  >
                    <label>Postage:</label>
                    <CurrencyDisplay :gold="0" :silver="0" :copper="30" />
                  </p>
                </div>

                <!-- E-Mail Input -->
                <div class="input-group">
                  <label class="md:ml-5" for="email">E-Mail:</label>
                  <div class="input-container">
                    <input
                      id="email"
                      type="email"
                      class="email_input"
                      placeholder="Your E-Mail"
                      v-model="mailStore.email"
                      @blur="validateEmail"
                    />
                  </div>
                </div>

                <!-- Subject Input -->
                <div class="input-group">
                  <label class="md:ml-5" for="subject">Subject:</label>
                  <div class="input-container">
                    <input
                      id="subject"
                      type="text"
                      class="subject_input"
                      placeholder="Subject"
                      v-model="mailStore.subject"
                      @blur="validateSubjectOnBlur"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Content Element -->
            <div class="relative" :style="contentDivStyle">
              <div class="scroll-wrapper">
                <div
                  class="scroll-content"
                  ref="scrollContent"
                  @scroll="handleScroll"
                  style="background-image: url(/img/quest-paper.png)"
                >
                <ContactForm ref="contactFormRef" />
                </div>
                <div class="scrollbar-utils">
                  <div class="scrollbar-track">
                    <button
                      class="scroll-button up"
                      @click="scrollUp"
                      :style="{
                        backgroundImage: `url(${
                          showUpButton
                            ? '/img/buttons/up-button--enabled.png'
                            : '/img/buttons/up-button.png'
                        })`,
                      }"
                    ></button>

                    <div
                      class="scrollbar-thumb"
                      ref="scrollbar"
                      @mousedown="startDrag"
                      :style="{ transform: thumbTop }"
                    ></div>

                    <button
                      class="scroll-button down"
                      @click="scrollDown"
                      :style="{
                        backgroundImage: `url(${
                          showDownButton
                            ? '/img/buttons/down-button--enabled.png'
                            : '/img/buttons/down-button.png'
                        })`,
                      }"
                    ></button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Bottom Element -->
            <div class="relative" :style="bottomDivStyle">
              <div
                class="bottom-wrap w-full h-full flex items-center justify-between gap-4 px-5"
              >
                <div
                  class="w-full h-[20px] flex justify-end px-2 font-default text-white text-shadow bg-black border border-solid border-theme-color rounded-lg"
                >
                  <CurrencyDisplay
                    :gold="gold"
                    :silver="silver"
                    :copper="copper"
                  />
                </div>
                <SendMailButtons @sendMail="handleSendMail" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import ModalImage from "~/components/main/character-components/ModalImage.vue";
import CloseModalButton from "~/components/misc/CloseModalButton.vue";
import ContactForm from "~/components/main/contact-components/ContactForm.vue";
import SendMailButtons from "~/components/main/contact-components/SendMailButtons.vue";
import CurrencyDisplay from "~/components/main/CurrencyDisplay.vue";

import { useModalLoader } from "~/composables/useModalLoader";

import { useUiOverlayStore } from "~/store/uiOverlay";
import { useCurrencyStore } from "~/store/currency";
import { useHandleMailStore } from "~/store/handleMail.js";

const resources = [
  "/img/letters.png",
  "/img/quest-paper.png",
  "/img/currency/goldcoin.png",
  "/img/currency/silvercoin.png",
  "/img/currency/coppercoin.png",
];

const { isLoaded } = useModalLoader(resources);

const currencyStore = useCurrencyStore();
const uiOverlayStore = useUiOverlayStore();
const mailStore = useHandleMailStore();

const contactFormRef = ref(null);

const validateNameOnBlur = () => {
  if (!mailStore.name) {
    uiOverlayStore.showMessage("Please enter your name", 3000, "error");
  }
};

const validateEmail = () => {
  if (!isValidEmail(mailStore.email)) {
    uiOverlayStore.showMessage(
      "Please enter a valid email address",
      3000,
      "error"
    );
  }
};

const validateSubjectOnBlur = () => {
  if (!mailStore.subject) {
    uiOverlayStore.showMessage("Please enter a subject", 3000, "error");
  }
};

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const gold = computed(() => currencyStore.gold);
const silver = computed(() => currencyStore.silver);
const copper = computed(() => currencyStore.copper);

const totalCopper = computed(() => {
  return gold.value * 10000 + silver.value * 100 + copper.value;
});

const isLessThan30Copper = computed(() => {
  return totalCopper.value < 30;
});

const handleSendMail = () => {
  if (isLessThan30Copper.value) {
    uiOverlayStore.showMessage("You don't have enough money.", 3000);
    return;
  }

  if (contactFormRef.value && contactFormRef.value.submitForm) {
    contactFormRef.value.submitForm();
  }
};

const closeModal = () => {
  mailStore.closeModal();
};

// Polygon Logic
const originalWidth = 450;
const originalHeight = 600;
const targetWidth = ref(450);
const padding = 30;
const uniqueId = "M";

const cutCornersId = computed(() => `clip-${uniqueId}`);

const scaleFactorX = computed(() => targetWidth.value / originalWidth);
const containerWidth = computed(() => targetWidth.value);
const containerHeight = computed(() => originalHeight * scaleFactorX.value);

const svgWidth = computed(() => targetWidth.value);
const svgHeight = computed(() => containerHeight.value);

const containerHeightStyle = computed(() => {
  return `${(originalHeight * targetWidth.value) / originalWidth}px`;
});

const wrapperStyle = computed(() => ({
  width: `${targetWidth.value}px`,
  height: containerHeightStyle.value,
  clipPath: `url(#${cutCornersId.value})`,
}));

const topDivStyle = computed(() => ({
  height: "175px",
}));

const contentDivStyle = computed(() => ({
  height: `calc(100% - 175px - (60px * ${targetWidth.value} / ${originalWidth}))`,
}));

const bottomDivStyle = computed(() => ({
  height: `calc(60px * ${targetWidth.value} / ${originalWidth})`,
}));

const scalePoints = (points) => {
  return points
    .split(" ")
    .map((point) => {
      const [x, y] = point.split(",").map(Number);
      return `${x * scaleFactorX.value},${y * scaleFactorX.value}`;
    })
    .join(" ");
};

const updateDimensions = () => {
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  const isLandscape = screenWidth > screenHeight;

  if (screenWidth <= 767) {
    targetWidth.value = screenWidth - 2 * padding;
  } else if (screenWidth <= 1024) {
    targetWidth.value = Math.min(420, screenWidth - 2 * padding);
  } else {
    targetWidth.value = 450;
  }
  if (isLandscape && screenWidth <= 1024) {
    targetWidth.value = Math.min(320, screenWidth - 2 * padding);
  }
};

// Scrollbar Logic
const scrollbar = ref(null);
const scrollContent = ref(null);

let isDragging = false;
let startY = 0;
let startScrollTop = 0;

const showUpButton = ref(false);
const showDownButton = ref(false);

const updateScrollButtons = () => {
  if (scrollContent.value) {
    const containerHeight = scrollContent.value.clientHeight;
    const contentHeight = scrollContent.value.scrollHeight;

    showUpButton.value = scrollContent.value.scrollTop > 0;
    showDownButton.value =
      scrollContent.value.scrollTop + containerHeight < contentHeight;
  }
};

const thumbTop = ref("translate3d(0, 0, 0)");

const handleScroll = () => {
  if (scrollContent.value && scrollbar.value) {
    const containerHeight = scrollContent.value.clientHeight;
    const contentHeight = scrollContent.value.scrollHeight;
    const trackHeight = scrollbar.value.parentElement.clientHeight;
    const thumbHeight = 22;

    const maxThumbTop = trackHeight - thumbHeight;
    const scrollRatio =
      scrollContent.value.scrollTop / (contentHeight - containerHeight);
    const translateY = scrollRatio * maxThumbTop;

    thumbTop.value = `translate3d(0, ${translateY}px, 0)`;
    updateScrollButtons();
  }
};

const scrollUp = () => {
  if (scrollContent.value) {
    scrollContent.value.scrollTop -= 20;
  }
  handleScroll();
};

const scrollDown = () => {
  if (scrollContent.value) {
    scrollContent.value.scrollTop += 20;
  }
  handleScroll();
};

const startDrag = (event) => {
  isDragging = true;
  startY = event.clientY;
  startScrollTop = scrollContent.value.scrollTop;
  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("mouseup", stopDrag);
};

const onMouseMove = (event) => {
  if (isDragging && scrollContent.value && scrollbar.value) {
    const thumbHeight = scrollbar.value.clientHeight;
    const trackHeight = scrollbar.value.parentElement.clientHeight;
    const maxScrollTop =
      scrollContent.value.scrollHeight - scrollContent.value.clientHeight;
    const maxThumbTop = trackHeight - thumbHeight;
    const deltaY = event.clientY - startY;
    const scrollRatio = deltaY / maxThumbTop;
    scrollContent.value.scrollTop = Math.min(
      maxScrollTop,
      Math.max(0, startScrollTop + scrollRatio * maxScrollTop)
    );
  }
};

const stopDrag = () => {
  isDragging = false;
  document.removeEventListener("mousemove", onMouseMove);
  document.removeEventListener("mouseup", stopDrag);
};

onMounted(() => {
  updateDimensions();
  updateScrollButtons();
  nextTick(() => {
    window.addEventListener("resize", updateDimensions);
    if (scrollContent.value) {
      scrollContent.value.addEventListener("scroll", handleScroll);
    }
  });
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", updateDimensions);
  if (scrollContent.value) {
    scrollContent.value.removeEventListener("scroll", handleScroll);
  }
});
</script>

<style scoped></style>
