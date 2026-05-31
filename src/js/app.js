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
				activeView.value = 'login'
				return
			}

			user.value = data.session?.user ?? null
			activeView.value = data.session?.user ? 'home' : 'login'
			if (!data.session?.user) {
				isProfileDropdownOpen.value = false
				showSignOutModal.value = false
				showSessionClosedModal.value = false
			}
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
			try {
				await supabase.auth.signOut()
			} catch (error) {
				console.error(error)
			}
		}

		const handleSessionClosed = () => {
			showSessionClosedModal.value = false
			user.value = null
			homeSection.value = 'home'
			activeView.value = 'login'
			isProfileDropdownOpen.value = false
		}

		onMounted(async () => {
			await syncSession()
			const { data } = supabase.auth.onAuthStateChange((event, session) => {
				user.value = session?.user ?? null
				if (session?.user) {
					activeView.value = 'home'
					showSessionClosedModal.value = false
				} else if (event === 'SIGNED_OUT') {
					showSessionClosedModal.value = true
					activeView.value = 'login'
					isProfileDropdownOpen.value = false
					showSignOutModal.value = false
					homeSection.value = 'home'
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
		}
	},
}
