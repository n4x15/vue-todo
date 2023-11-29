<script setup lang="ts">
import { useMutation, useQuery } from '@tanstack/vue-query'
import { getNextMeeting } from '@/api/queries'
import { updateMeetingMutation } from '@/api/mutations'
import { computed, ref, watch } from 'vue'
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

const date = computed(() =>
  data.value == null ? '' : new Date(data.value.startsAt).toISOString().substring(0, 10)
)

watch(date, (nextDate) => (nextDate.length > 0 ? (dateRef.value = nextDate) : undefined))
const dateRef = ref(date.value)

const minDate = computed(() => {
  const currentDate = new Date()
  currentDate.setDate(currentDate.getDate() + 1)
  return currentDate.toISOString().substring(0, 10)
})

const handleSave = async () => {
  try {
    await mutateAsync({ startsAt: dateRef.value, meetingId: data.value?.id ?? '' })
    await refetch()
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
      v-model="dateRef"
      @blur="handleSave"
      v-on:keydown.enter="handleSave"
      :min="minDate"
    />
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
  width: 150px;
  padding: 0;
}

.meeting-date {
  min-height: 30px;
}
</style>
