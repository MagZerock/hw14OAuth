import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import LogoutModal from '../components/LogoutModal.vue'
import Login from '../views/Login.vue'
import Home from '../views/Home.vue'
import { supabase } from '../lib/supabase'

export default {
	components: {
		Login,
		Home,
		LogoutModal,
	},
	setup() {
		const activeView = ref('login')
		const homeSection = ref('home')
		const user = ref(null)
		const authSource = ref('none')
		const loginMessage = ref('')
		const isProfileDropdownOpen = ref(false)
		const showSignOutModal = ref(false)
		const showSessionClosedModal = ref(false)
		let authSubscription = null

		const isHomeView = computed(() => activeView.value === 'home' && !!user.value)

		const userMetadata = computed(() => user.value?.user_metadata ?? {})

		const profileName = computed(() => {
			return userMetadata.value.full_name || userMetadata.value.name || 'Jefferson Aguilar'
		})

		const profileRole = computed(() => {
			return String(userMetadata.value.role || 'CUSTOMER').toUpperCase()
		})

		const syncSession = async () => {
			const { data, error } = await supabase.auth.getSession()
			if (error) {
				console.error(error)
				user.value = null
				authSource.value = 'none'
				activeView.value = 'login'
				return
			}

			const sessionUser = data.session?.user ?? null
			if (!sessionUser) {
				user.value = null
				authSource.value = 'none'
				activeView.value = 'login'
				isProfileDropdownOpen.value = false
				showSignOutModal.value = false
				showSessionClosedModal.value = false
				return
			}

			const { data: existingUser, error: lookupError } = await supabase
				.from('users')
				.select('user_id, name, email, phone, role')
				.eq('email', sessionUser.email)
				.maybeSingle()

			if (lookupError || !existingUser) {
				console.warn('Google account is not registered in users table.')
				await supabase.auth.signOut()
				user.value = null
				authSource.value = 'none'
				loginMessage.value = 'This Google account is not registered in users.'
				activeView.value = 'login'
				return
			}

			user.value = {
				id: existingUser.user_id,
				email: existingUser.email,
				user_metadata: {
					full_name: existingUser.name,
					name: existingUser.name,
					role: existingUser.role,
				},
			}
			authSource.value = 'google'
			loginMessage.value = ''
			activeView.value = 'home'
		}

		const goHomeSection = (section) => {
			homeSection.value = section
			activeView.value = 'home'
			isProfileDropdownOpen.value = false
		}

		const toggleProfileDropdown = () => {
			isProfileDropdownOpen.value = !isProfileDropdownOpen.value
			if (isProfileDropdownOpen.value) {
				showSignOutModal.value = false
			}
		}

		const requestSignOut = () => {
			isProfileDropdownOpen.value = false
			showSignOutModal.value = true
		}

		const cancelSignOutModal = () => {
			showSignOutModal.value = false
		}

		const signOut = async () => {
			showSignOutModal.value = false
			isProfileDropdownOpen.value = false
			if (authSource.value === 'google') {
				try {
					await supabase.auth.signOut()
				} catch (error) {
					console.error(error)
				}
			} else {
				user.value = null
				authSource.value = 'none'
				activeView.value = 'login'
			}
		}

		const handleSessionClosed = () => {
			showSessionClosedModal.value = false
			user.value = null
			authSource.value = 'none'
			homeSection.value = 'home'
			activeView.value = 'login'
			isProfileDropdownOpen.value = false
		}

		const handleLocalAuthenticated = (authenticatedUser) => {
			user.value = authenticatedUser
			authSource.value = 'local'
			loginMessage.value = ''
			activeView.value = 'home'
		}

		const handleLoginError = (message) => {
			loginMessage.value = message
		}

		onMounted(async () => {
			await syncSession()
			const { data } = supabase.auth.onAuthStateChange((event, session) => {
				if (session?.user) {
					user.value = session.user
					if (authSource.value !== 'local') {
						authSource.value = 'google'
					}
					activeView.value = 'home'
					showSessionClosedModal.value = false
				} else if (event === 'SIGNED_OUT') {
					showSessionClosedModal.value = true
					activeView.value = 'login'
					isProfileDropdownOpen.value = false
					showSignOutModal.value = false
					homeSection.value = 'home'
					authSource.value = 'none'
				} else {
					activeView.value = 'login'
				}
			})
			authSubscription = data.subscription
		})

		onBeforeUnmount(() => {
			authSubscription?.unsubscribe()
		})

		return {
			activeView,
			homeSection,
			user,
			loginMessage,
			isProfileDropdownOpen,
			showSignOutModal,
			showSessionClosedModal,
			isHomeView,
			profileName,
			profileRole,
			goHomeSection,
			toggleProfileDropdown,
			requestSignOut,
			cancelSignOutModal,
			signOut,
			handleSessionClosed,
			handleLocalAuthenticated,
			handleLoginError,
		}
	},
}
