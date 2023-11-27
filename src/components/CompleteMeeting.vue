<script setup lang="ts">
import { completeMeetingMutation } from '@/api/mutations'
import BaseButton from './BaseButton.vue'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { getCurrentMeeting } from '@/api/queries'
import { TYPE, useToast } from 'vue-toastification'

const toast = useToast()

const { data, isLoading } = useQuery({
  queryKey: ['currentMeeting'],
  queryFn: getCurrentMeeting
})

const { mutateAsync } = useMutation({
  mutationKey: ['completeMeeting'],
  mutationFn: completeMeetingMutation,
  onError: () => toast('Something went wrong', { type: TYPE.ERROR })
})

const client = useQueryClient()

const handleClick = async () => {
  try {
    await mutateAsync(data.value?.id ?? '')
    client.invalidateQueries({
      queryKey: ['tasks']
    })
    client.invalidateQueries({
      queryKey: ['currentMeeting']
    })
    await client.invalidateQueries({
      queryKey: ['nextMeeting']
    })
  } catch {
    return
  }
}
</script>
<template>
  <BaseButton :disabled="isLoading" @click="handleClick">Complete meeting</BaseButton>
</template>
