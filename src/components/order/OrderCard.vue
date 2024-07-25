<template>
    <Card>
        <template #title>
            <h2>{{ order?.menuName }}</h2>
        </template>
        <template #content>
            <div class="grid grid-cols-4 gap-2">
                <span class="font-semibold">Meja:</span>
                <span class="col-span-3">{{ order?.tableName }}</span>
                <span class="font-semibold">Jumlah:</span>
                <span class="col-span-3">{{ order?.total }}</span>
                <span class="font-semibold">Nota:</span>
                <span class="col-span-3 font-semibold">{{ order?.note }}</span>
                <Select size="small" class="col-span-3" v-model="order.status" :options="statusDropdownItems"
                    optionLabel="label" optionValue="value">
                    <template #option="{ option }">
                        <Tag :value="option.label" :severity="option.severity" />
                    </template>
                    <template #value="{ value }">
                        <Tag :value="orderStatusConverter(value)" :severity="orderStatusSeverityConverter(value)" />
                    </template>
                </Select>
                <Button icon="pi pi-save" text></Button>
            </div>
        </template>
    </Card>
</template>

<script setup>
import Card from 'primevue/card';
import { orderStatus } from '@/constants/order';
import { orderStatusConverter, orderStatusSeverityConverter } from '@/utils/enumConverter';
import Select from 'primevue/select';
import Tag from 'primevue/tag';
import Button from 'primevue/button';

const order = defineModel("order", {
    type: Object,
    required: true
});

const statusDropdownItems = [
    { value: orderStatus.PLACED, label: orderStatusConverter(orderStatus.PLACED), severity: orderStatusSeverityConverter(orderStatus.PLACED) },
    { value: orderStatus.PREPARING, label: orderStatusConverter(orderStatus.PREPARING), severity: orderStatusSeverityConverter(orderStatus.PREPARING) },
    { value: orderStatus.COMPLETED, label: orderStatusConverter(orderStatus.COMPLETED), severity: orderStatusSeverityConverter(orderStatus.COMPLETED) },
    { value: orderStatus.REJECTED, label: orderStatusConverter(orderStatus.REJECTED), severity: orderStatusSeverityConverter(orderStatus.REJECTED) }
]
</script>

<style scoped></style>