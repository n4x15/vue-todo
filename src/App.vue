<script setup lang="ts">
import UserProvider from '@/providers/UserProvider.vue'
import '@/assets/fonts/index.css'
import { DndProvider } from 'vue3-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
</script>

<template>
  <Suspense>
    <DndProvider :backend="HTML5Backend">
      <UserProvider>
        <router-view />
      </UserProvider>
    </DndProvider>
    <template #fallback>Loading...</template>
  </Suspense>
</template>

<style>
html,
body,
#app {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

* {
  box-sizing: border-box;
}
</style>
