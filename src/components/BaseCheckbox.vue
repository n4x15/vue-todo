<script setup lang="ts">
type BaseCheckboxProps = {
  onClick: () => void
  value: boolean
}

const { value, onClick } = defineProps<BaseCheckboxProps>()
</script>
<template>
  <div class="checkbox-container" @click="onClick">
    <div v-if="value">Y</div>
  </div>
</template>

<style>
.checkbox-container {
  cursor: pointer;
  height: 24px;
  width: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 20px 38px 34px -26px hsla(0, 0%, 0%, 0.2);
  border-radius: 255px 15px 225px 15px/15px 225px 15px 255px;
  border: solid 3px #41403e;
}
</style>
