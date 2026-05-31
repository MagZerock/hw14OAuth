import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

export default {
	props: {
		show: { type: Boolean, default: false },
		seconds: { type: Number, default: 5 },
	},
	emits: ['close'],
	setup(props, { emit }) {
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

		return {
			displaySeconds,
		}
	},
}
