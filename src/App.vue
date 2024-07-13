<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { ref } from 'vue';
import Toast from 'primevue/toast';
import ConfirmPopup from 'primevue/confirmpopup'
const isDark = ref(false);
const element = document.querySelector('html');
function toggleColorScheme() {
  isDark.value = !isDark.value;
  element.classList.toggle('my-app-dark', isDark.value);
}
</script>

<template>
  <Toast />
  <ConfirmPopup />
  <!-- <Button :icon=" isDark ? 'pi pi-moon' : 'pi pi-sun'" aria-label="Toogle Dark Mode" @click="toggleColorScheme()" /> -->
  <RouterView />
</template>

<style scoped></style>
