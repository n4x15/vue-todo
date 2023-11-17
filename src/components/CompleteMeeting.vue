<script setup lang="ts">
import { completeMeetingMutation } from '@/api/mutations'
import BaseButton from './BaseButton.vue'
import { useMutation, useQuery } from '@tanstack/vue-query'
import { getCurrentMeeting } from '@/api/queries'
import { computed } from 'vue'

const { data, isLoading, refetch } = useQuery({
  queryKey: ['currentMeeting'],
  queryFn: getCurrentMeeting
})

const { mutateAsync } = useMutation({
  mutationKey: ['completeMeeting'],
  mutationFn: completeMeetingMutation
})

const disabled = computed(() => data.value?.completedAt != null)

const handleClick = async () => {
  try {
    await mutateAsync(data.value?.id ?? '')
    refetch()
  } catch {
    return
  }
}
</script>
<template>
  <div v-if="isLoading">Loading</div>
  <BaseButton v-else @click="handleClick" :disabled="disabled">Complete meeting</BaseButton>
</template>
