<script setup>
import { onBeforeUnmount, onMounted } from 'vue'
import { supabase } from '../lib/supabase'

const emit = defineEmits(['done'])

let timeoutId = null

onMounted(async () => {
  try {
    await supabase.auth.signOut()
  } finally {
    timeoutId = window.setTimeout(() => {
      emit('done')
    }, 5000)
  }
})

onBeforeUnmount(() => {
  if (timeoutId) {
    window.clearTimeout(timeoutId)
  }
})
</script>

<template>
  <section class="flex w-full max-w-md flex-col items-center rounded-2xl bg-white p-8 text-center shadow-xl ring-1 ring-black/5">
    <div class="h-16 w-16 animate-spin rounded-full border-4 border-emerald-100 border-t-[#1a4731]"></div>
    <p class="mt-6 text-lg font-semibold text-slate-800">Signing out securely...</p>
    <p class="mt-2 text-sm text-slate-500">
      The application will return to the start screen once session cleanup is complete.
    </p>
  </section>
</template>