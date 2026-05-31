import { computed, onMounted, ref, watch } from 'vue'
import { supabase } from '../lib/supabase'

export default {
	props: {
		user: { type: Object, default: null },
		section: { type: String, default: 'home' },
	},
	setup(props) {
		const profile = ref({
			name: 'Jefferson Aguilar',
			email: '',
			role: 'CUSTOMER',
		})

		const loading = ref(true)

		const sessionFallback = computed(() => {
			const metadata = props.user?.user_metadata ?? {}
			return {
				name: metadata.full_name || metadata.name || 'Jefferson Aguilar',
				email: props.user?.email ?? '',
				role: String(metadata.role || 'CUSTOMER').toUpperCase(),
			}
		})

		const applyFallback = () => {
			profile.value = {
				name: sessionFallback.value.name,
				email: sessionFallback.value.email,
				role: sessionFallback.value.role,
			}
		}

		const loadProfile = async () => {
			loading.value = true

			if (!props.user) {
				applyFallback()
				loading.value = false
				return
			}

			try {
				const lookupKeys = [
					{ column: 'user_id', value: props.user.id },
					{ column: 'email', value: props.user.email },
				].filter((entry) => entry.value)

				let resolvedProfile = null

				for (const lookup of lookupKeys) {
					const { data, error } = await supabase
						.from('users')
						.select('name, email, role')
						.eq(lookup.column, lookup.value)
						.maybeSingle()

					if (error) {
						resolvedProfile = null
						break
					}

					if (data) {
						resolvedProfile = data
						break
					}
				}

				if (resolvedProfile) {
					profile.value = {
						name: resolvedProfile.name || sessionFallback.value.name,
						email: resolvedProfile.email || sessionFallback.value.email,
						role: String(resolvedProfile.role || sessionFallback.value.role || 'CUSTOMER').toUpperCase(),
					}
				} else {
					applyFallback()
				}
			} catch (error) {
				console.warn('Falling back to auth metadata for Home.vue profile:', error)
				applyFallback()
			} finally {
				loading.value = false
			}
		}

		watch(
			() => props.user?.id,
			() => loadProfile(),
			{ immediate: true },
		)

		onMounted(() => {
			if (!props.user) {
				applyFallback()
				loading.value = false
			}
		})

		return {
			profile,
			loading,
		}
	},
}
