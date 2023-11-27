<script setup lang="ts">
import { useMutation, useQuery } from '@tanstack/vue-query'
import { getNextMeeting } from '@/api/queries'
import { updateMeetingMutation } from '@/api/mutations'
import { computed, ref } from 'vue'
import { TYPE, useToast } from 'vue-toastification'

const toast = useToast()

const { data, isLoading, refetch } = useQuery({
  queryKey: ['nextMeeting'],
  queryFn: getNextMeeting
})

const { mutateAsync } = useMutation({
  mutationKey: ['updateMeeting'],
  mutationFn: updateMeetingMutation,
  onError: () => toast('Something went wrong', { type: TYPE.ERROR })
})

const isEditable = ref(false)

const date = computed(() => (data.value == null ? new Date() : new Date(data.value.startsAt)))
const dateRef = ref(date.value)

const handleEditClose = () => (isEditable.value = false)
const handleEditOpen = () => (isEditable.value = true)

const handleSave = async () => {
  try {
    await mutateAsync({ startsAt: dateRef.value, meetingId: data.value?.id ?? '' })
    handleEditClose()
    refetch()
  } catch {
    return
  }
}
</script>

<template>
  <p v-if="isLoading">Loading</p>
  <div v-else class="meeting-container">
    <div>Next meeting is:</div>
    <input
      type="date"
      v-if="isEditable"
      v-model="dateRef"
      @blur="handleEditClose"
      v-on:keydown.enter="handleSave"
      autofocus
    />
    <div v-else @click="handleEditOpen">{{ date.toLocaleDateString() }}</div>
  </div>
</template>

<style scoped>
.meeting-container {
  font-size: 22px;
  margin: 30px 0 0;
  display: flex;
  gap: 20px;
  border-bottom: 2px solid black;
}

input {
  border: none;
  outline: none;
  width: 300px;
  padding: 0;
}
</style>
