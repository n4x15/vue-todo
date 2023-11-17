<script setup lang="ts">
import { ref } from 'vue'
import { useMutation } from '@tanstack/vue-query'
import { createTaskMutation } from '@/api/mutations'
import type { Task } from '@/types/task'

type TaskInputProps = {
  onCreated: (value: Task) => void
}

const { onCreated } = defineProps<TaskInputProps>()
const { mutateAsync } = useMutation({
  mutationFn: createTaskMutation,
  onSuccess: (data) => onCreated?.(data)
})

const text = ref('')

const handleSave = async () => {
  const normalized = text.value.trim()
  if (normalized.length === 0) return
  await mutateAsync({ text: normalized })
  text.value = ''
}
</script>

<template>
  <input type="text" v-model="text" v-on:keydown.enter="handleSave" />
</template>

<style scoped>
input {
  border-bottom: 3px solid #41403e;
  border-top: none;
  border-left: none;
  border-right: none;
  outline: none;
  width: 300px;
  padding: 0;
}
</style>
