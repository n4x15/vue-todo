import { apiUrl } from './api-url'
import type { User } from '@/providers/types'
import type { Task } from '@/types/task'

export const currentUserQuery = async (): Promise<User> => {
  return fetch(apiUrl + '/auth/current-user', {
    method: 'GET',
    credentials: 'include'
  }).then((data) => data.json())
}

type Meeting = {
  id: string
  startsAt: Date
  completedAt?: Date
}

export const getNextMeeting = async (): Promise<Meeting> => {
  return fetch(apiUrl + '/meetings/next', { method: 'GET', credentials: 'include' }).then((data) =>
    data.json()
  )
}

export const getCurrentMeeting = async (): Promise<Meeting> => {
  return fetch(apiUrl + '/meetings', { method: 'GET', credentials: 'include' }).then((data) =>
    data.json()
  )
}

export const getTasks = async (): Promise<Task[]> => {
  return fetch(apiUrl + '/tasks', { method: 'GET', credentials: 'include' }).then((data) =>
    data.json()
  )
}
