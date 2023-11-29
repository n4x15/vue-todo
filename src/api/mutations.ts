import type { Task } from '@/types/task'
import apiClient from './instanse'
import responseHandler from './response-handler'
import type { User } from '@/types/user'

type SingInInput = {
  email: string
  password: string
}

export const signInMutation = async (input: SingInInput): Promise<User> =>
  responseHandler(apiClient.post('auth/sign-in', { input }))

type SignUpInput = {
  email: string
  password: string
  firstName: string
  lastName: string
}

export const signUpMutation = async (input: SignUpInput): Promise<User> =>
  responseHandler(apiClient.post('auth/sign-up', { input }))

export const sigOutMutation = async (): Promise<void> =>
  responseHandler(apiClient.post('auth/sign-out'))

type CreateTaskInput = {
  text: string
}

export const createTaskMutation = async (input: CreateTaskInput): Promise<Task> =>
  responseHandler(apiClient.post('tasks', { input }))

type UpdateTaskInput = {
  taskId: string
  text?: string
  isCompleted?: boolean
  subTaskIds?: string[]
  comment?: string | null
}

export const updateTaskMutation = async (input: UpdateTaskInput): Promise<Task> => {
  const { taskId, ...rest } = input
  return responseHandler(apiClient.patch(`tasks/${taskId}`, { input: rest }))
}

export const deleteTaskMutation = async (taskId: string): Promise<void> =>
  responseHandler(apiClient.delete(`tasks/${taskId}`))

type OrderItem = {
  id: string
  order: number
}

type UpdateOrderInput = {
  orders: OrderItem[]
}

export const updateTasksOrderMutation = async (input: UpdateOrderInput): Promise<void> =>
  responseHandler(apiClient.put('tasks/order', { input }))

type UpdateMeetingInput = {
  startsAt: string
  meetingId: string
}

export const updateMeetingMutation = async (input: UpdateMeetingInput) => {
  const { meetingId, ...rest } = input
  return responseHandler(apiClient.patch(`meetings/${meetingId}`, { input: rest }))
}

export const completeMeetingMutation = async (meetingId: string) =>
  responseHandler(apiClient.post(`meetings/${meetingId}`))
