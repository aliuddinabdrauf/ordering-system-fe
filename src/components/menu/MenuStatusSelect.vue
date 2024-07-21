<template>
    <Select v-model="menuStatus" :options="menuStatuses" placeholder="Select Menu Status">
        <template #option="slotProps">
            <Tag :value="menuStatusConverter(slotProps.option)"
                :severity="menuStatusSeverityConverter(slotProps.option)" />
        </template>
        <template #value="slotProps">
            <Tag :value="menuStatusConverter(slotProps.value)"
                :severity="menuStatusSeverityConverter(slotProps.value)" />
        </template>
    </Select>
</template>

<script setup>
import { menuStatusConverter, menuStatusSeverityConverter } from '@/utils/enumConverter';
import Tag from 'primevue/tag';
import Select from 'primevue/select';
import { menuStatuses } from '@/constants/menu';

const menuStatus = defineModel('value', { type: Number, default: 0 });
</script>

<style scoped></style>