<script setup lang="ts">
import { computed, ref, unref, watch } from 'vue'
import BaseButton from './BaseButton.vue'
import BaseCheckbox from './BaseCheckbox.vue'
import { useDrag, useDrop } from 'vue3-dnd'
import type { Task } from '@/types/task'
import type { DragItem, DragResult, UpdateTaskInput } from '@/scenes/TasksPage.vue'

type TaskElementProps = {
  task: Readonly<Task>
  index: number
  parentIndex?: number
  isChild?: boolean
  isDragging: { value: boolean; setter: Function }
  disabled: boolean
  onTaskChange: (
    taskId: string,
    input: UpdateTaskInput,
    index: number,
    parentIndex?: number
  ) => void
  onDrop: (result: DragResult) => void
  onDeleteButtonClick: (taskId: string, index: number, parentIndex?: number) => void
  onSubDrop?: (result: DragResult) => void
}

const {
  task,
  isChild,
  index,
  parentIndex,
  isDragging,
  onDrop,
  onSubDrop,
  onDeleteButtonClick,
  onTaskChange
} = defineProps<TaskElementProps>()

const { isCompleted = false } = task
const editableText = ref(task.text)
const editableComment = ref(task.comment)
const hasComment = ref(task.comment != null && task.comment.trim().length > 0)
const isCommentable = ref(false)

const dragRef = ref()
const dropRef = ref()
const subDropRef = ref()

const [dropCollect, drop] = useDrop({
  accept: 'task',
  canDrop: (item) =>
    (!isChild || (isChild && item.parentIndex === parentIndex)) &&
    task.id !== item.id &&
    !isCompleted,
  collect: (monitor) => ({
    isHovered: monitor.isOver(),
    canDrop: monitor.canDrop()
  }),
  drop: (item: DragItem) => onDrop({ dragItem: item, dropItem: { ...task, index, parentIndex } })
})
const [subDropCollect, subDrop] = useDrop({
  accept: 'task',
  canDrop: (item) =>
    (item.subTasks == null || item.subTasks?.length === 0) &&
    item.parentIndex !== index &&
    !isChild,
  collect: (monitor) => ({
    isHovered: monitor.isOver(),
    canDrop: monitor.canDrop()
  }),
  drop: (item: DragItem) => onSubDrop?.({ dragItem: item, dropItem: { ...task, index } })
})

const [dragCollect, drag] = useDrag({
  type: 'task',
  canDrag: () => !isCompleted,
  item: () => ({
    ...task,
    index,
    parentIndex
  }),
  collect: (monitor) => ({
    isDragging: monitor.isDragging(),
    opacity: monitor.isDragging() ? 0.4 : 1
  })
})

const setDrag = (el: HTMLDivElement) => {
  dragRef.value = drag(el)
  return dragRef
}

const setDrop = (el: HTMLDivElement) => {
  dropRef.value = drop(el)
  return dropRef
}
const setSubDrop = (el: HTMLDivElement) => {
  subDropRef.value = subDrop(el)
  return subDropRef
}

const dragging = computed(() => unref(dragCollect).isDragging)
watch(dragging, (dragging) => {
  isDragging.setter(dragging)
})

const opacity = computed(() => unref(dragCollect).opacity)
const isHovered = computed(() => unref(dropCollect).isHovered)
const canDrop = computed(() => unref(dropCollect).canDrop)

const isSubHovered = computed(() => unref(subDropCollect).isHovered)
const subCanDrop = computed(() => unref(subDropCollect).canDrop)

const handleCompletedChange = () =>
  onTaskChange(task.id, { isCompleted: !isCompleted }, index, parentIndex)

const handleDelete = () => onDeleteButtonClick(task.id, index, parentIndex)

const handleTextChange = () => {
  if (task.text !== editableText.value && editableText.value.trim().length > 0)
    onTaskChange(task.id, { text: editableText.value.trim() }, index, parentIndex)
}

const handleCommentChange = () => {
  const value = editableComment.value?.trim() ?? ''
  if (task.comment !== value || value.length !== 0)
    onTaskChange(task.id, { comment: value }, index, parentIndex)
}

const handleDeleteCommentButtonClick = () =>
  onTaskChange(task.id, { comment: null }, index, parentIndex)
</script>

<template>
  <div :class="{ task: true, disabled }">
    <div class="row" :ref="setDrag" :style="{ opacity }">
      <BaseCheckbox class="checkbox" v-bind:on-click="handleCompletedChange" :value="isCompleted" />
      <input
        :class="{ completed: isCompleted, 'task-text': true }"
        type="text"
        @blur="handleTextChange"
        v-model="editableText"
        v-on:keypress.enter="handleTextChange"
      />
      <div class="buttons-group">
        <BaseButton v-if="hasComment" @click="handleDeleteCommentButtonClick"
          >Remove comment</BaseButton
        >
        <BaseButton v-else @click="() => (isCommentable = true)">Add comment</BaseButton>
        <BaseButton @click="handleDelete">X</BaseButton>
      </div>

      <div v-if="isDragging.value && canDrop" class="drop-zone" :ref="setDrop">
        <div class="drop-zone-message" v-if="isHovered">drop here</div>
      </div>
      <div v-if="isDragging.value && subCanDrop" class="sub-drop-zone" :ref="setSubDrop">
        <div class="drop-zone-message" v-if="isSubHovered">sub drop here</div>
      </div>
    </div>
    <input
      :class="{ comment: true, created: isCommentable }"
      type="text"
      @blur="handleCommentChange"
      v-model="editableComment"
      v-on:keypress.enter="handleCommentChange"
      v-if="hasComment || isCommentable"
      :autofocus="isCommentable"
    />

    <div
      class="sub-tasks"
      v-for="(subTask, childIndex) in task.subTasks"
      v-bind:key="JSON.stringify(subTask) + index + parentIndex"
    >
      <TaskElement
        :disabled="disabled"
        :isDragging="isDragging"
        :index="childIndex"
        :task="subTask"
        :isChild="true"
        :onDrop="onDrop"
        :onDeleteButtonClick="onDeleteButtonClick"
        :parentIndex="index"
        :onTaskChange="onTaskChange"
      />
    </div>
  </div>
</template>

<style scoped>
.buttons-group {
  display: flex;
  gap: 10px;
  margin: 0 0 0 auto;
}
.comment {
  margin: 0 0 0 34px;
  word-wrap: break-word;
}
.task {
  width: 100%;
  display: flex;
  flex-direction: column;

  &.disabled {
    pointer-events: none;
  }
}
.drop-zone {
  position: absolute;
  width: 20%;
  height: 24px;
}

.drop-zone-message {
  background-color: aqua;
  height: 44px;
  vertical-align: middle;
}

.sub-drop-zone {
  position: absolute;
  width: 20%;
  height: 24px;
  left: 20%;
}

.sub-drop {
  margin: 0 0 0 30%;
}

.row {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
}

.sub-tasks {
  display: flex;
  gap: 10px;
  flex-direction: column;
  margin: 10px 0 0 24px;
}

.checkbox:hover ~ input.task-text {
  text-decoration-line: line-through;
  text-decoration-color: black;
}
button {
  margin: 0 0 0 auto;
}

input {
  border: none;
  outline: none;
  width: 60%;
  padding: 0;
  transition: text-decoration-color 500ms;
  text-decoration: none transparent;

  &:focus,
  &.created {
    border-bottom: 2px solid black;
  }
  &.completed {
    text-decoration-line: line-through;
    text-decoration-color: black;
  }
}
</style>
