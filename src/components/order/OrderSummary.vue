<template>
    <Dialog v-model:visible="visible" modal header="Ikhtisas Pesanan" class="w-11/12 xl:w-4/6">
        <div class="container mx-auto">
            <DataView :value="orderStore.orderList" :rows="10">
                <template #list="slotProps">
                    <div class="flex flex-col">
                        <div v-for="(item, index) in slotProps.items" :key="index">
                            <div class="flex flex-row items-center p-6 gap-4"
                                :class="{ 'border-t border-surface-200 dark:border-surface-700': index !== 0 }">
                                <div class="w-40 relative">
                                    <img class="block xl:block mx-auto rounded w-full"
                                        :src="getFirstOrDefaultImage(item)" :alt="item.name" />
                                    <Tag :value="menuStatusConverter(item.menuStatus)"
                                        :severity="menuStatusSeverityConverter(item.menuStatus)"
                                        class="absolute dark:!bg-surface-900" style="left: 4px; top: 4px"></Tag>
                                </div>
                                <div class="flex flex-row justify-between items-center flex-1 gap-6">
                                    <div class="flex flex-col justify-between items-start gap-2">
                                        <div>
                                            <span
                                                class="font-medium text-surface-500 dark:text-surface-400 text-sm">{{ menuTypeConverter(item.menuType) }}</span>
                                            <div class="text-lg font-medium mt-2">{{ item.name }}</div>
                                        </div>
                                        <div>
                                            <span
                                                class="font-medium text-surface-500 dark:text-surface-400 text-sm hidden xl:block"
                                                v-html="item.description"></span>
                                        </div>
                                        <div>
                                            <Textarea v-model="item.note" placeholder="Nota...." />
                                        </div>
                                    </div>
                                    <div class="flex flex-col items-end gap-8">
                                        <div class="flex flex-col items-end">
                                            <span class="text-md font-semibold">{{ currencyFormatter(item.price)
                                                }}</span>
                                            <span class="text-md font-semibold">Total: {{
                                                currencyFormatter(item.totalPrice) }}</span>
                                        </div>
                                        <div>
                                        </div>
                                        <div class="flex flex-row gap-2">
                                            <InputNumber v-model="item.quantity" size="small" showButtons
                                                buttonLayout="vertical" style="width:3rem" :min="1" :max="99">
                                                <template #incrementicon>
                                                    <span class="pi pi-plus" />
                                                </template>
                                                <template #decrementicon>
                                                    <span class="pi pi-minus" />
                                                </template>
                                            </InputNumber>
                                            <Button icon="pi pi-trash" severity="danger"
                                                class="flex-initial whitespace-nowrap"
                                                @click="deleteOrderItem($event, item)"></Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
            </DataView>
        </div>
        <template #footer>
            <div class="flex flex-row items-end gap-2 p-2">
                <span class="text-md font-bold">Total: {{ currencyFormatter(orderStore.totalPrice) }}</span>
                <Button label="Batal" severity="warn" @click="visible = false" autofocus />
                <Button label="Pesan" severity="primary" @click="SendOrder" autofocus />
            </div>
        </template>
    </Dialog>
</template>

<script setup>
import Dialog from 'primevue/dialog';
import { useOrderStore } from '@/stores/order';
import DataView from 'primevue/dataview';
import { computed, ref } from 'vue';
import { generateLinkFromFileId } from '@/utils/file';
import { menuTypesObj } from '@/constants/menu';
import mainCourseImg from '@/assets/images/default_main_course.jpg';
import drinksImg from '@/assets/images/default_drinks.jpg';
import dessertImg from '@/assets/images/default_dessert.jpg';
import othersImg from '@/assets/images/default_others.jpg';
import { menuStatusSeverityConverter, menuStatusConverter, menuTypeConverter } from '@/utils/enumConverter';
import Tag from 'primevue/tag';
import Button from 'primevue/button';
import { currencyFormatter } from '@/utils/formatter';
import InputNumber from 'primevue/inputnumber';
import { useConfirm } from 'primevue/useconfirm';
import Textarea from 'primevue/textarea';
import { useAxiosStore } from '@/stores/axios';
import { useToast } from 'primevue/usetoast';
import { useRoute } from 'vue-router';

const value = ref(1);
const orderStore = useOrderStore();
const confirm = useConfirm();
const axiosStore = useAxiosStore();
const toast = useToast();
const visible = defineModel('visible', { type: Boolean });
const route = useRoute();
function getFirstOrDefaultImage(menu) {
    if (menu.images && menu.images.length > 0) {
        return generateLinkFromFileId(menu.images[0].id, menu.images[0].fullName);
    }
    else {
        switch (menu.menuType) {
            case menuTypesObj.MainCourse:
                return mainCourseImg;
            case menuTypesObj.Drinks:
                return drinksImg;
            case menuTypesObj.Dessert:
                return dessertImg;
            default:
                return othersImg;
        }
    }
}
function deleteOrderItem(event, menu) {
    confirm.require({
        message: `Adakah anda pasti untuk memadam pesanan untuk ${menu.name} ini?`,
        header: 'Pengesahan',
        icon: 'pi pi-exclamation-triangle',
        target: event.currentTarget,
        rejectProps: {
            label: 'Batal',
            severity: 'secondary',
            outlined: true
        },
        acceptProps: {
            label: 'Padam',
            severity: 'danger'
        },
        accept: () => {
            orderStore.removeOrder(menu.id);
        }
    });
}
function SendOrder() {
    const loading = axiosStore.loading.show();
    const tableId = route.params.tableId;
    const orderData = orderStore.orderList.map(o => {
        return {
            menuId: o.id,
            total: o.quantity,
            note: o.note
        }
    });
    axiosStore.post(`/api/order/create/${tableId}`, orderData)
        .then((response) => {
            toast.add({ severity: 'success', summary: 'Berjaya', detail: 'Berjaya menghantar pesanan', life: 3000 });
            orderStore.clearOrder();
            visible.value = false;
        })
        .finally(() => {
            loading.hide();
        });
}
</script>

<style scoped></style>