<template>
    <OverlayBadge v-if="orderStore.totalCart" severity="info" :value="orderStore.totalCart" class="fixed-bottom-btn">
        <Button size="small" icon="pi pi-shopping-cart" severity="info" class="ml-2" title="Lihat troli" />
    </OverlayBadge>
    <Button size="small" v-else severity="info" icon="pi pi-shopping-cart" class="ml-2 fixed-bottom-btn"
        title="Lihat troli" />
</template>

<script setup>
import Button from 'primevue/button';
import { useOrderStore } from '@/stores/order';
import OverlayBadge from 'primevue/overlaybadge';

const orderStore = useOrderStore();

</script>

<style scoped>
.fixed-bottom-btn {
    position: fixed;
    /* Fixed positioning relative to the viewport */
    bottom: 3%;
    /* Align to the bottom of the viewport */
    left: 95%;
    /* Center the button horizontally */
    transform: translateX(-50%);
    /* Adjust horizontal position to truly center it */
    z-index: 1000;
    /* Ensure it's above other content */
}
</style>