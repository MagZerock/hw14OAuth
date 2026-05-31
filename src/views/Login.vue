<script src="../js/login.js"></script>

<template>
  <section class="flex min-h-full w-full flex-1 items-center justify-center px-4 py-10 bg-[radial-gradient(circle_at_top,_rgba(34,78,58,0.42),_transparent_42%),linear-gradient(180deg,#08111b_0%,#0e1a24_48%,#0b111e_100%)]">
    <div class="relative w-full max-w-md overflow-hidden rounded-3xl bg-white/95 p-8 shadow-xl ring-1 ring-white/20 backdrop-blur-sm">
      <div class="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-600 via-lime-400 to-emerald-600"></div>

      <div class="space-y-3 text-center">
        <p class="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-800">
          Institutional Access
        </p>
        <h1 class="text-3xl font-bold text-[#1a4731]">Biconoirs Gourmet</h1>
        <p class="text-sm leading-6 text-slate-600">
          Register with Google or use your email and password to enter the panel.
        </p>
      </div>

      <form class="mt-6 space-y-4" @submit.prevent="handleEmailSignIn">
        <label class="block">
          <span class="mb-2 block text-sm font-semibold text-slate-700">Email</span>
          <input
            v-model="email"
            type="email"
            autocomplete="email"
            class="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            placeholder="you@example.com"
          />
        </label>

        <label class="block">
          <span class="mb-2 block text-sm font-semibold text-slate-700">Password</span>
          <input
            v-model="password"
            type="password"
            autocomplete="current-password"
            class="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            placeholder="Enter your password"
          />
        </label>

        <button
          type="submit"
          class="flex w-full items-center justify-center rounded-xl bg-[#1a4731] px-5 py-4 font-semibold text-white shadow-lg shadow-emerald-950/20 transition hover:bg-[#245c40] disabled:cursor-not-allowed disabled:opacity-70"
          :disabled="isLoading"
        >
          {{ isLoading ? 'Processing...' : 'Sign in' }}
        </button>
      </form>

      <button
        class="mt-5 flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-5 py-4 font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-70"
        :disabled="isLoading"
        @click="loginWithGoogle"
      >
        <svg viewBox="0 0 48 48" class="h-5 w-5" aria-hidden="true">
          <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303C33.654 32.658 29.367 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.828 1.154 7.937 3.043l5.657-5.657C34.231 5.047 29.412 3 24 3 12.954 3 4 11.954 4 23s8.954 20 20 20 20-8.954 20-20c0-1.341-.138-2.65-.389-3.917z" />
          <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.828 1.154 7.937 3.043l5.657-5.657C34.231 5.047 29.412 3 24 3 16.318 3 9.656 7.337 6.306 14.691z" />
          <path fill="#4CAF50" d="M24 43c5.292 0 10.024-2.03 13.637-5.337l-6.293-5.302C29.27 34.641 26.807 35.5 24 35.5c-5.327 0-9.8-3.389-11.404-8.127l-6.52 5.021C9.383 39.325 16.156 43 24 43z" />
          <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-1.074 3.046-3.041 5.535-5.959 7.061l.005-.003 6.293 5.302C34.197 40.681 44 33.5 44 23c0-1.341-.138-2.65-.389-3.917z" />
        </svg>
        <span>{{ isLoading ? 'Redirecting...' : 'Continue with Google' }}</span>
      </button>

      <p v-if="errorMessage" class="mt-4 text-sm text-red-600">
        {{ errorMessage }}
      </p>

      <p v-if="successMessage" class="mt-4 text-sm text-emerald-700">
        {{ successMessage }}
      </p>
    </div>
  </section>
</template>