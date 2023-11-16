<script setup lang="ts">
import BaseButton from '@/components/BaseButton.vue'
import { reactive } from 'vue'
import router from '@/router/index'
import { useMutation } from '@tanstack/vue-query'
import { signUpMutation } from '@/api/mutations'
import { useCurrentUser } from '@/hooks/useCurrentUser'

const { emit } = useCurrentUser()

const handleBackButtonClick = (): void => {
  router.push('/')
}

const { mutateAsync } = useMutation({
  mutationFn: signUpMutation,
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
  password: '',
  firstName: '',
  lastName: ''
})
</script>

<template>
  <div class="container">
    <h1>Conspectus</h1>
    <form @submit.prevent="onSubmit">
      <div class="form-container">
        <input
          name="firstName"
          type="text"
          v-model="formValues.firstName"
          placeholder="Your first name..."
          required
        />
        <input
          name="lastName"
          type="text"
          v-model="formValues.lastName"
          placeholder="Your last name..."
          required
        />
        <input
          name="email"
          type="email"
          v-model="formValues.email"
          placeholder="Your email..."
          required
        />
        <input
          type="password"
          name="password"
          v-model="formValues.password"
          placeholder="Your password..."
          required
        />
        <div class="buttons-container">
          <BaseButton class="btn" type="button" @click="handleBackButtonClick">Back</BaseButton>
          <BaseButton class="btn" type="submit">Sign Up</BaseButton>
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

input {
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
