<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import TaskInput from '@/components/TaskInput.vue'
import UserInfo from '@/components/UserInfo.vue'
import NextMeeting from '@/components/NextMeeting.vue'
import CompleteMeetingVue from '@/components/CompleteMeeting.vue'
import { getTasks } from '@/api/queries'
import { cloneDeep, isEqual, isEqualWith, sortBy, omit } from 'lodash'
import TaskElement from '@/components/TaskElement.vue'
import { useMutation } from '@tanstack/vue-query'
import { deleteTaskMutation, updateTaskMutation, updateTasksOrderMutation } from '@/api/mutations'
import { type Task } from '@/types/task'
import { TYPE, useToast } from 'vue-toastification'

export type DragItem = Task & {
  index: number
  parentIndex?: number
}

export type DragResult = {
  dragItem: DragItem
  dropItem: DragItem
}

export type UpdateTaskInput = {
  text?: string
  isCompleted?: boolean
  comment?: string | null
}

const toast = useToast()

const { data, isLoading } = useQuery({
  queryKey: ['tasks'],
  queryFn: getTasks
})

const tasks = ref<Task[]>(data.value == null ? [] : cloneDeep(data.value))

watch(
  data,
  (nextTasks, oldTasks) => {
    if (nextTasks == null) return
    if (isEqualWith(nextTasks, oldTasks, isEqual)) return
    tasks.value = cloneDeep(nextTasks)
  },
  { deep: true }
)

const { mutateAsync: updateTask, isPending: isUpdating } = useMutation({
  mutationFn: updateTaskMutation,
  onError: () => toast('Something went wrong', { type: TYPE.ERROR })
})
const { mutateAsync: deleteTask, isPending: isDeleting } = useMutation({
  mutationFn: deleteTaskMutation,
  onError: () => toast('Something went wrong', { type: TYPE.ERROR })
})
const { mutateAsync: updateOrdersMutation, isPending: isOrdering } = useMutation({
  mutationFn: updateTasksOrderMutation,
  onError: () => toast('Something went wrong', { type: TYPE.ERROR })
})

const updateOrders = async () => {
  const reduced = tasks.value.reduce((memo: Task[], task: Task) => {
    const { subTasks = [] } = task
    return [...memo, task, ...subTasks]
  }, [])
  const orders = reduced.map((item, index) => ({ id: item.id, order: index }))
  await updateOrdersMutation({ orders })
}

const handleDeleteButtonClick = async (taskId: string, index: number, parentIndex?: number) => {
  if (parentIndex == null) {
    const subTasks = tasks.value[index]?.subTasks
    if (subTasks != null && subTasks.length > 0) tasks.value.splice(index, 0, ...subTasks)

    tasks.value = tasks.value.filter((item) => item.id !== taskId)
  } else {
    const parentTask = tasks.value[parentIndex]
    parentTask.subTasks = parentTask.subTasks?.filter((item) => item.id !== taskId)
  }

  await deleteTask(taskId)
  await updateOrders()
}

const handleTaskChange = async (
  taskId: string,
  input: UpdateTaskInput,
  index: number,
  parentIndex?: number
) => {
  const parentTask = parentIndex != null ? tasks.value[parentIndex] : undefined
  const task =
    parentTask != null && parentTask.subTasks != null
      ? parentTask.subTasks[index]
      : tasks.value[index]

  Object.assign(task, input)

  const { isCompleted } = input

  if (isCompleted != null) {
    if (parentTask == null) {
      task.subTasks = task.subTasks?.map((sub) => ({ ...sub, isCompleted }))
      tasks.value = sortBy(tasks.value, 'isCompleted')
    } else {
      parentTask.subTasks = sortBy(parentTask.subTasks, 'isCompleted')
    }
    await updateOrders()
  }
  await updateTask({ taskId, ...omit(task, 'order') })
}

const handleDrop = async (dragResult: DragResult) => {
  const { dragItem, dropItem } = dragResult
  const { id: dragItemId, index: dragItemIndex, parentIndex: dragParentIndex } = dragItem
  const { index: dropItemIndex, parentIndex: dropParentIndex } = dropItem

  if (dragItemIndex === dropItemIndex && dropItemIndex !== dragParentIndex) return

  if (dragParentIndex == null) {
    tasks.value.splice(dragItemIndex, 1)
    tasks.value.splice(dropItemIndex, 0, dragItem)
  } else {
    const parentSourceTask = tasks.value[dragParentIndex]
    if (dragParentIndex === dropParentIndex) {
      parentSourceTask.subTasks?.splice(dragItemIndex, 1)
      parentSourceTask.subTasks?.splice(dropItemIndex, 0, dragItem)
    } else {
      parentSourceTask.subTasks = parentSourceTask.subTasks?.filter(
        (item) => item.id !== dragItemId
      )
      tasks.value.splice(dropItemIndex, 0, dragItem)
    }
    const sourceIds = parentSourceTask.subTasks?.map((item) => item.id)
    await updateTask({ taskId: parentSourceTask.id, subTaskIds: sourceIds })
  }
  await updateOrders()
}

const handleSubDrop = async (dragResult: DragResult) => {
  const { dragItem, dropItem } = dragResult
  const { id: dragItemId, index: dragItemIndex, parentIndex: dragParentIndex } = dragItem
  const { index: dropItemIndex } = dropItem

  if (dragItemIndex === dropItemIndex || dropItemIndex === dragParentIndex) return

  const destinationTask = tasks.value[dropItemIndex]

  if (dragParentIndex == null) {
    destinationTask.subTasks?.push(dragItem)
    tasks.value.splice(dragItemIndex, 1)
    const nextIds = destinationTask.subTasks?.map((item) => item.id)
    await updateTask({ taskId: destinationTask.id, subTaskIds: nextIds })
  } else {
    const parentSourceTask = tasks.value[dragParentIndex]
    destinationTask.subTasks?.push(dragItem)
    parentSourceTask.subTasks = parentSourceTask.subTasks?.filter((item) => item.id !== dragItemId)
    const destinationIds = destinationTask.subTasks?.map((item) => item.id)
    const sourceIds = parentSourceTask.subTasks?.map((item) => item.id)
    await updateTask({ taskId: destinationTask.id, subTaskIds: destinationIds })
    await updateTask({ taskId: parentSourceTask.id, subTaskIds: sourceIds })
  }
  await updateOrders()
}

const handleTaskCreated = async (task: Task) => {
  tasks.value.splice(0, 0, task)
  await updateOrders()
}

const isDragging = reactive({
  value: false,
  setter: (value: boolean) => (isDragging.value = value)
})
</script>

<template>
  <p v-if="isLoading">Loading</p>
  <div v-else class="container">
    <UserInfo class="info" />
    <NextMeeting />
    <div class="empty" v-if="tasks == null || tasks.length === 0">No tasks</div>
    <div v-else class="tasks-container">
      <div v-for="(task, index) in tasks" :key="JSON.stringify(task) + index">
        <TaskElement
          :disabled="isUpdating || isDeleting || isOrdering"
          :isDragging="isDragging"
          :index="index"
          :task="task"
          :onDrop="handleDrop"
          :onSubDrop="handleSubDrop"
          :onDeleteButtonClick="handleDeleteButtonClick"
          :onTaskChange="handleTaskChange"
        />
      </div>
    </div>
    <div class="task-input">Create task <TaskInput :onCreated="handleTaskCreated" /></div>
    <div class="complete-meeting-container"><CompleteMeetingVue /></div>
  </div>
</template>

<style scoped>
.container {
  margin: 50px auto;
  padding: 50px;
  border-radius: 255px 15px 225px 15px/15px 225px 15px 255px;
  border: solid 3px #41403e;
  box-shadow: 20px 38px 34px -26px hsla(0, 0%, 0%, 0.2);
  width: 50%;
}

.empty {
  margin: 20px 0 0;
}

.task-input {
  margin: 30px 0 0;
}

.tasks-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px;
  max-height: 500px;
  overflow: auto;

  &::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }

  &::-webkit-scrollbar-track {
    margin: 4px;
    border-radius: 50px;
  }

  &::-webkit-scrollbar-thumb {
    background: #555454;
    border-radius: 50px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #363636;
  }
}

.complete-meeting-container {
  margin: 20px 0 0 auto;
  width: fit-content;
}
</style>
