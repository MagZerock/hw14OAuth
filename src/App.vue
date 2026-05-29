<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import Login from './views/Login.vue'
import Home from './views/Home.vue'
import { supabase } from './lib/supabase'

const activeView = ref('login')
const homeSection = ref('home')
const user = ref(null)
const isProfileDropdownOpen = ref(false)
const showSignOutModal = ref(false)
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
	user.value = null
	homeSection.value = 'home'
	activeView.value = 'login'
}

onMounted(async () => {
	await syncSession()
	const { data } = supabase.auth.onAuthStateChange((_event, session) => {
		user.value = session?.user ?? null
		activeView.value = session?.user ? 'home' : 'login'
		if (!session?.user) {
			isProfileDropdownOpen.value = false
			showSignOutModal.value = false
			homeSection.value = 'home'
		}
	})
	authSubscription = data.subscription
})

onBeforeUnmount(() => {
	authSubscription?.unsubscribe()
})
</script>

<template>
	<div class="flex h-screen max-h-screen w-full flex-col overflow-hidden bg-[#f9fafb] text-slate-800">
		<header v-if="isHomeView" class="sticky top-0 z-40 w-full bg-[#1a4731] text-white shadow-2xl">
			<div class="flex w-full items-center justify-between gap-4 px-6 py-4 lg:px-8">
				<a href="#" class="flex items-center gap-4" @click.prevent="goHomeSection('home')">
					<img src="/img/restaurant-logo-green.png" alt="Biconoirs Gourmet" class="logo-main" />
				</a>

				<div class="flex items-center gap-3">
					<nav class="hidden flex-wrap items-center gap-2 text-sm font-semibold md:flex lg:gap-3">
						<button class="rounded-full px-4 py-2 transition hover:bg-white/10" @click="goHomeSection('home')">Home</button>
						<button class="rounded-full px-4 py-2 transition hover:bg-white/10" @click="goHomeSection('menu')">Menu</button>
						<button class="rounded-full px-4 py-2 transition hover:bg-white/10" @click="goHomeSection('about')">About</button>
					</nav>

					<div class="relative">
						<button
							type="button"
							class="flex items-center gap-2 rounded-full border border-white/15 bg-[#2f7a51] px-4 py-2 text-white shadow-lg transition hover:bg-[#356d4d]"
							@click="toggleProfileDropdown"
						>
							<span class="text-emerald-300">●</span>
							<span class="max-w-[180px] truncate text-sm font-semibold">{{ profileName }}</span>
						</button>

						<div
							v-if="isProfileDropdownOpen"
							class="absolute right-0 mt-3 w-72 rounded-2xl bg-white p-4 text-slate-800 shadow-2xl ring-1 ring-black/5"
						>
							<p class="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">SESSION</p>
							<p class="mt-2 text-lg font-bold text-[#1a4731]">{{ profileRole }}</p>
							<p class="mt-1 text-sm text-slate-500">{{ profileName }}</p>

							<button
								type="button"
								class="mt-4 w-full rounded-xl bg-red-50 px-4 py-3 text-left text-sm font-semibold text-red-700 transition hover:bg-red-100"
								@click="requestSignOut"
							>
								Sign Out
							</button>
						</div>
					</div>
				</div>
			</div>
		</header>

		<main class="flex w-full flex-1 flex-col overflow-hidden">
			<Login v-if="activeView === 'login'" class="flex-1" />
			<Home v-else-if="activeView === 'home'" class="flex-1" :user="user" :section="homeSection" @section-change="goHomeSection" />
		</main>

		<footer class="w-full bg-[#0b111e] px-4 py-8 text-center text-white/75">
			<p class="text-sm font-semibold uppercase tracking-[0.35em] text-white/70">© 2026 BICONOIR'S RESTAURANT</p>
			<p class="mt-2 text-sm text-white/55">Excellence in every culinary detail.</p>
		</footer>

		<div
			v-if="showSignOutModal"
			class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4"
			@click.self="cancelSignOutModal"
		>
			<div class="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
				<h2 class="text-2xl font-bold text-slate-900">Sign out?</h2>
				<p class="mt-3 text-sm leading-6 text-slate-600">
					You are about to leave your Biconoirs Gourmet account. Are you sure you want to continue?
				</p>

				<div class="mt-6 flex items-center justify-end gap-3">
					<button
						type="button"
						class="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
						@click="cancelSignOutModal"
					>
						Cancel
					</button>
					<button
						type="button"
						class="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
						@click="signOut"
					>
						Yes, sign out
					</button>
				</div>
			</div>
		</div>
	</div>
</template>