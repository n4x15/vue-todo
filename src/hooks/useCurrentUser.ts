import { type CurrentUserContext } from '@/providers/types'
import { inject } from 'vue'

export function useCurrentUser() {
  const currentUser = inject<CurrentUserContext>('currentUser')
  return currentUser as CurrentUserContext
}
