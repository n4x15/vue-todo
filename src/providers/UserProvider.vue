<script setup lang="ts">
import { provide, watch, ref } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { currentUserQuery } from '@/api/queries'
import router from '@/router'
import type { CurrentUserContext, User } from '@/types/user'

const user = ref<User | null>(null)

const emit = (userData?: User): void => {
  if (userData == null) return

  user.value = userData
}

const logOut = () => {
  user.value = null
  router.push('/')
}

const { data, isLoading, isError } = useQuery({
  queryKey: ['user'],
  queryFn: currentUserQuery,
  retry: false
})

watch([isLoading, isError], ([isLoading, isError]) => {
  if (data.value?.id != null && !isLoading && !isError) {
    user.value = data.value
  }
})

provide<CurrentUserContext>('currentUser', { user, emit, logOut })
</script>

<template>
  <slot v-if="!isLoading" />
</template>
