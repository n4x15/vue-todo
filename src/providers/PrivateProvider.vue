<script setup lang="ts">
import router from '@/router/index'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { watch } from 'vue'

const currentUser = useCurrentUser()
if (currentUser == null || currentUser.user.value == null) router.push('/')

watch(currentUser.user, (user) => {
  if (user == null) router.push('/')
})
</script>

<template><router-view /></template>
