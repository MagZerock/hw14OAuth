<script setup>
import { ref } from 'vue'
import { supabase } from '../lib/supabase'

const isLoading = ref(false)
const errorMessage = ref('')

const getFriendlyErrorMessage = (error) => {
  const rawMessage = error?.message ?? 'Unable to sign in with Google.'

  if (typeof rawMessage !== 'string') {
    return 'Unable to sign in with Google.'
  }

  try {
    const parsed = JSON.parse(rawMessage)

    if (typeof parsed === 'object' && parsed) {
      return parsed.msg ?? parsed.error ?? rawMessage
    }
  } catch {
    // The message is not JSON; use it as-is.
  }

  return rawMessage
}

const loginWithGoogle = async () => {
  isLoading.value = true
  errorMessage.value = ''

  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin,
    },
  })

  if (error) {
    errorMessage.value = getFriendlyErrorMessage(error)
    isLoading.value = false
  }
}
</script>

<template>
  <section class="flex min-h-full w-full flex-1 items-center justify-center px-4 py-10 bg-[radial-gradient(circle_at_top,_rgba(34,78,58,0.42),_transparent_42%),linear-gradient(180deg,#08111b_0%,#0e1a24_48%,#0b111e_100%)]">
    <div class="relative w-full max-w-md overflow-hidden rounded-2xl bg-white/95 p-8 shadow-xl ring-1 ring-white/20 backdrop-blur-sm">
      <div class="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-600 via-lime-400 to-emerald-600"></div>

      <div class="space-y-3 text-center">
        <p class="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-800">
          Institutional Access
        </p>
        <h1 class="text-3xl font-bold text-[#1a4731]">Biconoirs Gourmet</h1>
        <p class="text-sm leading-6 text-slate-600">
          Sign in with Google to access the academic panel and review your profile.
        </p>
      </div>

      <button
        class="mt-8 flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-5 py-4 font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-70"
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
    </div>
  </section>
</template>