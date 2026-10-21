import { computed, shallowRef } from 'vue'
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'
import { roleForUser } from './roles'

export const firebaseUser = shallowRef(null)
export const firebaseRole = computed(() => roleForUser(firebaseUser.value))
export const roleLabel = computed(
  () => ({ member: 'Member', librarian: 'Librarian' })[firebaseRole.value] || 'Guest'
)

let resolveReady
export const firebaseAuthReady = new Promise((resolve) => {
  resolveReady = resolve
})

export const syncFirebaseUser = (user) => {
  firebaseUser.value = user
}

export const startFirebaseAuth = () => {
  onAuthStateChanged(
    getAuth(),
    (user) => {
      syncFirebaseUser(user)
      resolveReady()
    },
    (error) => {
      console.error('Firebase session error:', error.code)
      syncFirebaseUser(null)
      resolveReady()
    }
  )
}

export const skipFirebaseAuth = () => resolveReady()

export const logoutFirebase = async () => {
  const auth = getAuth()
  await signOut(auth)
  syncFirebaseUser(auth.currentUser)
  console.log('Firebase Sign out Successful!')
  console.log('Current Firebase user:', auth.currentUser)
}
