<script src="../js/home.js"></script>

<template>
  <section
    class="relative flex w-full flex-1 flex-col items-center justify-center overflow-hidden bg-cover bg-center"
    :style="{ backgroundImage: `url('/img/restaurant-background.png')` }"
  >
    <div class="absolute inset-0 bg-black/35"></div>

    <div class="relative z-10 flex w-full flex-1 items-center justify-center px-6 text-center text-white">
      <div class="max-w-5xl">
        <p class="text-xs font-semibold uppercase tracking-[0.5em] text-white/80">
          Biconoirs Gourmet
        </p>
        <h1 class="mt-4 text-5xl font-extrabold uppercase tracking-[0.35em] sm:text-6xl md:text-7xl">
          FLAVOR & ELEGANCE
        </h1>
        <p class="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/85 sm:text-base">
          A high-end dining experience with classic identity, warm service, and a refined presence.
        </p>

        <div class="mt-8 flex flex-wrap justify-center gap-4">
          <button
            type="button"
            class="rounded-full border border-white/80 bg-transparent px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-white/10"
          >
            BOOK NOW
          </button>
          <button
            type="button"
            class="rounded-full border border-white/80 bg-transparent px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-white/10"
          >
            VIEW MENU
          </button>
        </div>
      </div>
    </div>
  </section>
</template>