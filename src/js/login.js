import { ref } from 'vue'
import { supabase } from '../lib/supabase'

export default {
	setup() {
		const authMode = ref('login')
		const email = ref('')
		const password = ref('')
		const isLoading = ref(false)
		const errorMessage = ref('')
		const successMessage = ref('')

		const getFriendlyErrorMessage = (error) => {
			const rawMessage = error?.message ?? 'Unable to complete authentication.'

			if (typeof rawMessage !== 'string') {
				return 'Unable to complete authentication.'
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

		const handleEmailAuth = async () => {
			isLoading.value = true
			errorMessage.value = ''
			successMessage.value = ''

			const normalizedEmail = email.value.trim()
			const trimmedPassword = password.value.trim()

			if (!normalizedEmail || !trimmedPassword) {
				errorMessage.value = 'Enter your email and password.'
				isLoading.value = false
				return
			}

			const authRequest =
				authMode.value === 'register'
					? supabase.auth.signUp({
						email: normalizedEmail,
						password: trimmedPassword,
						options: {
							emailRedirectTo: window.location.origin,
						},
					})
					: supabase.auth.signInWithPassword({
						email: normalizedEmail,
						password: trimmedPassword,
					})

			const { data, error } = await authRequest

			if (error) {
				errorMessage.value = getFriendlyErrorMessage(error)
			} else if (authMode.value === 'register' && !data.session) {
				successMessage.value = 'Check your email to confirm the account before signing in.'
				password.value = ''
			}

			isLoading.value = false
		}

		const loginWithGoogle = async () => {
			isLoading.value = true
			errorMessage.value = ''
			successMessage.value = ''

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

		return {
			authMode,
			email,
			password,
			isLoading,
			errorMessage,
			successMessage,
			handleEmailAuth,
			loginWithGoogle,
		}
	},
}
