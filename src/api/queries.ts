import type { Task } from '@/types/task'
import responseHandler from './response-handler'
import apiClient from './instanse'
import type { Meeting } from '@/types/meeting'
import type { User } from '@/types/user'

export const currentUserQuery = async (): Promise<User> =>
  responseHandler(apiClient.get('auth/current-user'))

export const getNextMeeting = async (): Promise<Meeting> =>
  responseHandler(apiClient.get('meetings/next'))

export const getCurrentMeeting = async (): Promise<Meeting> =>
  responseHandler(apiClient.get('meetings'))

export const getTasks = async (): Promise<Task[]> => responseHandler(apiClient.get('tasks'))
