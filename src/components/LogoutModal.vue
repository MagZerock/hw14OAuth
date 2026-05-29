<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = defineProps({
	show: { type: Boolean, default: false },
	seconds: { type: Number, default: 5 },
})

const emit = defineEmits(['close'])

const remainingSeconds = ref(props.seconds)
let intervalId = null
let timeoutId = null

const displaySeconds = computed(() => Math.max(0, remainingSeconds.value))

const clearTimers = () => {
	if (intervalId) {
		clearInterval(intervalId)
		intervalId = null
	}

	if (timeoutId) {
		clearTimeout(timeoutId)
		timeoutId = null
	}
}

const resetAndStartCountdown = () => {
	clearTimers()
	remainingSeconds.value = props.seconds

	intervalId = setInterval(() => {
		remainingSeconds.value = Math.max(0, remainingSeconds.value - 1)
	}, 1000)

	timeoutId = setTimeout(() => {
		clearTimers()
		emit('close')
	}, props.seconds * 1000)
}

watch(
	() => props.show,
	(isVisible) => {
		if (isVisible) {
			resetAndStartCountdown()
			return
		}

		clearTimers()
		remainingSeconds.value = props.seconds
	},
	{ immediate: true },
)

onMounted(() => {
	if (props.show) {
		resetAndStartCountdown()
	}
})

onBeforeUnmount(() => {
	clearTimers()
})
</script>

<template>
	<transition name="fade-scale">
		<div
			v-if="show"
			class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm"
			aria-modal="true"
			role="dialog"
			aria-labelledby="logout-modal-title"
			aria-describedby="logout-modal-description"
		>
			<div class="w-full max-w-md rounded-xl bg-white p-8 text-center shadow-2xl ring-1 ring-black/5">
				<div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
					<svg viewBox="0 0 24 24" class="h-8 w-8" fill="none" aria-hidden="true">
						<path
							d="M20 6L9 17l-5-5"
							stroke="currentColor"
							stroke-width="2.5"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
				</div>

				<h2 id="logout-modal-title" class="mt-6 text-2xl font-bold text-slate-900">
					Sesión cerrada
				</h2>

				<p id="logout-modal-description" class="mt-3 text-sm leading-6 text-slate-600">
					¡Sesión cerrada con éxito! Redirigiendo por seguridad...
				</p>

				<div class="mt-6 inline-flex items-center gap-3 rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
					<span class="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-500"></span>
					<span>Redirección en {{ displaySeconds }}s</span>
				</div>
			</div>
		</div>
	</transition>
</template>

<style scoped>
.fade-scale-enter-active,
.fade-scale-leave-active {
	transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-scale-enter-from,
.fade-scale-leave-to {
	opacity: 0;
	transform: scale(0.97);
}
</style>