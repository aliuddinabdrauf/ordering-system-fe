<script setup>
import { RouterLink, RouterView } from 'vue-router'
import Button from 'primevue/button'
import { ref } from 'vue';
import Toast from 'primevue/toast';
const isDark = ref(false);
const element = document.querySelector('html');
function toggleColorScheme() {
  isDark.value = !isDark.value;
  element.classList.toggle('my-app-dark', isDark.value);
}
</script>

<template>
  <Toast />
  <!-- <Button :icon=" isDark ? 'pi pi-moon' : 'pi pi-sun'" aria-label="Toogle Dark Mode" @click="toggleColorScheme()" /> -->
  <RouterView />
</template>

<style scoped></style>
