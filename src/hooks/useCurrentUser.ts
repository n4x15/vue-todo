import type { CurrentUserContext } from '@/types/user'
import { inject } from 'vue'

export function useCurrentUser() {
  const currentUser = inject<CurrentUserContext>('currentUser')
  return currentUser as CurrentUserContext
}
