import type { Task } from '@/types/task'
import { apiUrl } from './api-url'
import type { User } from '@/providers/types'

type SingInPayload = {
  email: string
  password: string
}

export const signInMutation = async (payload: SingInPayload): Promise<User> => {
  return fetch(apiUrl + '/auth/sign-in', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    credentials: 'include',
    body: JSON.stringify({ input: payload })
  }).then(async (data) => data.json())
}

type SignUpPayload = {
  email: string
  password: string
  firstName: string
  lastName: string
}

export const signUpMutation = async (payload: SignUpPayload): Promise<User> => {
  return fetch(apiUrl + '/auth/sign-up', {
    credentials: 'include',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify({ input: payload })
  }).then(async (response) => response.json())
}

export const sigOutMutation = async (): Promise<void> => {
  fetch(apiUrl + '/auth/sign-out', { method: 'POST', credentials: 'include' })
}

type CreateTaskPayload = {
  text: string
}

export const createTaskMutation = async (payload: CreateTaskPayload): Promise<Task> => {
  return fetch(apiUrl + '/tasks', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify({ input: payload })
  }).then((data) => data.json())
}

type UpdateTaskInput = {
  taskId: string
  text?: string
  isCompleted?: boolean
  subTaskIds?: string[]
  comment?: string | null
}

export const updateTaskMutation = async (payload: UpdateTaskInput) => {
  const { taskId, ...rest } = payload
  return fetch(apiUrl + '/tasks/' + taskId, {
    credentials: 'include',
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify({ input: rest })
  })
}

export const deleteTaskMutation = async (taskId: string) => {
  return fetch(apiUrl + '/tasks/' + taskId, {
    method: 'DELETE',
    credentials: 'include'
  })
}

type OrderItem = {
  id: string
  order: number
}

type UpdateOrderInput = {
  orders: OrderItem[]
}

export const updateTasksOrderMutation = async (input: UpdateOrderInput) => {
  return fetch(apiUrl + '/tasks/order', {
    credentials: 'include',
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify({ input })
  })
}

type UpdateMeetingMutation = {
  startsAt?: Date
  meetingId: string
}

export const updateMeetingMutation = async (payload: UpdateMeetingMutation) => {
  const { meetingId, ...rest } = payload
  return fetch(apiUrl + '/meetings/' + meetingId, {
    credentials: 'include',
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify({ input: rest })
  })
}

export const completeMeetingMutation = async (meetingId: string) => {
  return fetch(apiUrl + '/meetings/' + meetingId, { method: 'POST', credentials: 'include' })
}
