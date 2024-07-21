<template>
    <Select v-model="menuType" :options="menuTypes" placeholder="Select Menu Type">
        <template #option="slotProps">
            <Tag :value="menuTypeConverter(slotProps.option)" :severity="menuTypeSeverityConverter(slotProps.option)" />
        </template>
        <template #value="slotProps">
            <Tag :value="menuTypeConverter(slotProps.value)" :severity="menuTypeSeverityConverter(slotProps.value)" />
        </template>
    </Select>
</template>

<script setup>
import { menuTypeConverter, menuTypeSeverityConverter } from '@/utils/enumConverter';
import Tag from 'primevue/tag';
import Select from 'primevue/select';
import { menuTypes } from '@/constants/menu';

const menuType = defineModel('value', { type: Number });
</script>

<style scoped></style>