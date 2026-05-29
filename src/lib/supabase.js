import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const createNoopQueryBuilder = () => ({
  select() {
    return this
  },
  eq() {
    return this
  },
  maybeSingle() {
    return Promise.resolve({ data: null, error: null })
  },
})

const createNoopSupabaseClient = () => ({
  auth: {
    async getSession() {
      return { data: { session: null }, error: null }
    },
    onAuthStateChange() {
      return {
        data: {
          subscription: {
            unsubscribe() {},
          },
        },
      }
    },
    async signInWithOAuth() {
      return {
        data: null,
        error: {
          message: 'Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to use Google sign-in.',
        },
      }
    },
    async signOut() {
      return { error: null }
    },
  },
  from() {
    return createNoopQueryBuilder()
  },
})

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY is missing from the environment.')
}

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : createNoopSupabaseClient()