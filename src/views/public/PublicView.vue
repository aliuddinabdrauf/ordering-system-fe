<template>
    <div>
        <RouterView></RouterView>
    </div>
</template>

<script setup>
import { useBreadcrumbStore } from '@/stores/breadcrumb';
import { RouterView } from 'vue-router';

const breadcrumbStore = useBreadcrumbStore();
breadcrumbStore.breadCrumbItem = []
</script>

<style lang="scss" scoped></style>