<script setup lang="ts">

type ButtonProps = {
  type?: 'submit' | 'reset' | 'button'
  disabled?: boolean
  onClick?: () => void
}

withDefaults(defineProps<ButtonProps>(), {
  type: 'button',
  disabled: false,
  onClick: () => {}
})
</script>

<template>
  <button :type="type" :disabled="disabled" @click="onClick"><slot /></button>
</template>

<style scoped>
button {
  cursor: pointer;
  padding: 2px 4px;
  box-shadow: 20px 38px 34px -26px hsla(0, 0%, 0%, 0.2);
  border-radius: 255px 15px 225px 15px/15px 225px 15px 255px;
  border: solid 3px #41403e;
  background-color: transparent;

  &:active {
    translate: 1px 1px;
  }
}
</style>
