<template>
    <OverlayBadge v-if="orderStore.totalOrder" severity="info" :value="orderStore.totalOrder" class="fixed-bottom-btn">
        <Button size="small" icon="pi pi-shopping-cart" severity="info" class="ml-2" title="Lihat troli" @click="showOrderSummaryDialog" />
    </OverlayBadge>
    <OrderSummary v-model:visible="showOrderSummary" />
</template>

<script setup>
import Button from 'primevue/button';
import { useOrderStore } from '@/stores/order';
import OverlayBadge from 'primevue/overlaybadge';
import OrderSummary from './OrderSummary.vue';
import { ref } from 'vue';

const orderStore = useOrderStore();

const showOrderSummary = ref(false);

function showOrderSummaryDialog() {
    showOrderSummary.value = true;
}
</script>

<style scoped>
.fixed-bottom-btn {
    position: fixed;
    bottom: 3%;
    transform: translateX(-50%);
    right: 4px;
    z-index: 1000;
}
</style>