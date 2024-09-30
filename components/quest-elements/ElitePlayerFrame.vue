<!-- ElitePlayerFrame.vue -->

<template>
  <div
    class="absolute -translate-x-1/2 -translate-y-1/2 absolute top-[25px] left-[25px] z-[3]"
  >
    <div class="relative max-w-[25vw] md:max-w-[160px]">
      <img
        src="/img/epf.png"
        alt="Main Character Frame"
        class="relative w-full h-full object-cover z-[2]"
      />

      <div
        class="absolute inset-0 flex justify-center items-center z-[1]"
        style="width: 55.36%; height: 69.67%; left: 33.33%; top: 8.56%"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 100 100"
          style="width: 100%; height: 100%"
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
            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style="stop-color: #8c6600; stop-opacity: 1" />
              <stop offset="50%" style="stop-color: #ccac00; stop-opacity: 1" />
              <stop
                offset="100%"
                style="stop-color: #ffd700; stop-opacity: 1"
              />
            </linearGradient>

            <pattern
              id="imagePattern"
              patternUnits="userSpaceOnUse"
              width="100"
              height="100"
            >
              <image
                href="/img/char-profile.png"
                x="0"
                y="0"
                width="100"
                height="100"
                clip-path="url(#clipCircle)"
              />
            </pattern>

            <clipPath id="clipCircle">
              <circle cx="50" cy="50" r="43" />
            </clipPath>
          </defs>

          <circle
            cx="50"
            cy="50"
            r="49"
            fill="url(#metalGradient)"
            stroke="black"
            stroke-width="1"
          />
          <circle
            cx="50"
            cy="50"
            r="46"
            stroke="black"
            stroke-width="1"
            fill="url(#goldGradient)"
          />
          <circle
            cx="50"
            cy="50"
            r="43"
            fill="url(#imagePattern)"
            stroke="black"
            stroke-width="1"
          />
        </svg>
      </div>
    </div>
  </div>
</template>
