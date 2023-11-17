<script setup lang="ts">
import BaseButton from '@/components/BaseButton.vue'
import { reactive } from 'vue'
import router from '@/router/index'
import { useMutation } from '@tanstack/vue-query'
import { signInMutation } from '@/api/mutations'
import { useCurrentUser } from '@/hooks/useCurrentUser'

const handleSignUpClick = (): void => {
  router.push('/sign-up')
}
const { user, emit } = useCurrentUser()
if (user?.value?.id != null) router.push('/private/tasks')

const { mutateAsync } = useMutation({
  mutationFn: signInMutation,
  mutationKey: ['signIn'],
  onSuccess: (userData) => {
    if (userData == null) return
    emit(userData)
    router.push('/private/tasks')
  }
})

const onSubmit = async (): Promise<void> => {
  await mutateAsync(formValues)
}

const formValues = reactive({
  email: '',
  password: ''
})
</script>

<template>
  <div class="container">
    <h1>Conspectus</h1>
    <form @submit.prevent="onSubmit">
      <div class="form-container">
        <input
          class="input"
          type="email"
          v-model="formValues.email"
          placeholder="Your email..."
          required
        />
        <input
          class="input"
          type="password"
          name="password"
          v-model="formValues.password"
          placeholder="Your password..."
          required
        />
        <div class="buttons-container">
          <BaseButton class="btn" type="submit">Login</BaseButton>
          <BaseButton class="btn" type="button" @click="handleSignUpClick">Sign Up</BaseButton>
        </div>
      </div>
    </form>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

h1 {
  max-width: 200px;
  margin: 50px 50px 0 auto;
  text-align: right;
}

form {
  margin: auto;
}

.form-container {
  width: 300px;
}

.input {
  border-radius: 255px 15px 225px 15px/15px 225px 15px 255px;
  width: 100%;
  padding: 2px 4px;
  border: 2px solid #41403e;

  & + & {
    margin: 10px 0 0 0;
  }
}

.buttons-container {
  margin: 10px 0 auto;
  display: flex;
  gap: 20px;
  width: 100%;
}

.btn {
  width: 100%;
}
</style>
