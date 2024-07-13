<template>
    <div>
        this is home view
    </div>
</template>

<script setup>
import { useBreadcrumbStore } from '@/stores/breadcrumb';

const breadcrumbStore = useBreadcrumbStore();
breadcrumbStore.breadCrumbItem = []
</script>

<style lang="scss" scoped></style>