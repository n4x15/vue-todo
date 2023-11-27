import type { Ref } from 'vue'

export type User = {
  id: string
  firstName: string
  lastName: string
  email: string
}

export type CurrentUserContext = {
  user: Ref<User | null>
  emit: (user: User) => void
  logOut: () => void
}
