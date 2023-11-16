export type Task = {
  id: string
  text: string
  isCompleted: boolean
  subTasks?: Task[]
  comment?: string | null
}
