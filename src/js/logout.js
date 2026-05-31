import { onBeforeUnmount, onMounted } from 'vue'
import { supabase } from '../lib/supabase'

export default {
	emits: ['done'],
	setup(_, { emit }) {
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
	},
}
