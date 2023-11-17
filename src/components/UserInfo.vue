<script setup lang="ts">
import router from '@/router'
import BaseButton from './BaseButton.vue'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { useMutation } from '@tanstack/vue-query'
import { sigOutMutation } from '@/api/mutations'

const { mutateAsync } = useMutation({ mutationFn: sigOutMutation })

const currentUser = useCurrentUser()

if (currentUser == null) router.push('/')
const { user } = currentUser ?? {}
const { firstName, lastName } = user?.value ?? {}

const handleLogout = async () => {
  await mutateAsync()
  currentUser?.logOut()
}
</script>

<template>
  <div class="info-container">
    <p>Hello {{ [firstName, lastName].join(' ') }}!</p>
    <BaseButton @click="handleLogout">Logout</BaseButton>
  </div>
</template>

<style scoped>
.info-container {
  display: flex;
  gap: 10px;
  width: fit-content;
  align-items: center;
  margin: 0 0 0 auto;
}
</style>
